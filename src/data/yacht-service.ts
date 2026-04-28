import type { Yacht, YachtCard, YachtFacets } from "./types/yacht";
import { ankorGet } from "../lib/ankor/client";
import { ankorConfig } from "../lib/ankor/config";
import { memoize } from "../lib/ankor/cache";
import { ensureRegistered } from "../lib/ankor/registry";
import { entityToYacht, summaryToCard, uniqueSlug } from "../lib/ankor/mappers";
import type { DiscoveryResponse, VesselEntity, VesselSummary } from "../lib/ankor/types";

const SEARCH_TTL_MS = 60_000;
const ENTITY_TTL_MS = 5 * 60_000;
const SLUG_INDEX_TTL_MS = SEARCH_TTL_MS;

interface SlugIndex {
  cards: YachtCard[];
  bySlug: Map<string, string>;
}

async function loadCardsAndIndex(yachtType?: string): Promise<SlugIndex> {
  const cacheKey = `ankor:search:index:${yachtType ?? "all"}`;
  return memoize<SlugIndex>(cacheKey, SLUG_INDEX_TTL_MS, async () => {
    try {
      const params = new URLSearchParams({
        currency: ankorConfig.defaultCurrency,
        minLength: String(ankorConfig.minLengthM),
        priceMin: String(Math.round(ankorConfig.minWeekPriceCents / 100)),
      });
      if (yachtType) params.set("yachtType", yachtType);
      const data = await ankorGet<DiscoveryResponse>(`/website/search?${params.toString()}`);
      const hits = data.hits ?? [];

      const used = new Set<string>();
      const cards: YachtCard[] = [];
      const bySlug = new Map<string, string>();

      for (const hit of hits) {
        const eligible = passesGlobalFilters(hit);
        if (!eligible) continue;
        const slug = uniqueSlug(hit.name ?? "yacht", hit.uri, used);
        const card = summaryToCard(hit, slug);
        if (yachtType && card.yachtType.length === 0) {
          card.yachtType = [yachtType];
        }
        cards.push(card);
        bySlug.set(slug, hit.uri);
      }

      return { cards, bySlug };
    } catch (err) {
      console.error("[ankor] search failed:", err instanceof Error ? err.message : err);
      return { cards: [], bySlug: new Map() };
    }
  });
}

function passesGlobalFilters(hit: VesselSummary): boolean {
  const len = typeof hit.length === "number" ? hit.length : Number(hit.length);
  if (!Number.isFinite(len) || len <= ankorConfig.minLengthM) return false;
  return true;
}

async function fetchEntity(uri: string): Promise<VesselEntity | null> {
  return memoize<VesselEntity | null>(`ankor:entity-raw:${uri}`, ENTITY_TTL_MS, async () => {
    try {
      await ensureRegistered(uri);
      return await ankorGet<VesselEntity>(`/website/entity/${encodeURIComponent(uri)}`);
    } catch (err) {
      console.warn("[ankor] entity fetch failed:", uri, err instanceof Error ? err.message : err);
      return null;
    }
  });
}

export async function enrichWithPricing(cards: YachtCard[]): Promise<YachtCard[]> {
  const results = await Promise.all(
    cards.map(async (card) => {
      if (card.weekPricingFrom != null || card.dayPricingFrom != null) return card;
      const entity = await fetchEntity(card.uri);
      if (!entity) return card;
      const pricing = entity.pricing ?? {};
      return {
        ...card,
        dayPricingFrom: pricing.dayPricingFrom?.price ?? null,
        weekPricingFrom: pricing.weekPricingFrom?.price ?? null,
        currency: pricing.currency ?? pricing.weekPricingFrom?.currency ?? card.currency,
        yachtType: card.yachtType.length ? card.yachtType : (entity.yachtType ?? []),
      };
    }),
  );
  return results;
}

export async function getAllYachts(yachtType?: string): Promise<YachtCard[]> {
  const { cards } = await loadCardsAndIndex(yachtType);
  return cards;
}

export async function getFeaturedYachts(limit = 10): Promise<YachtCard[]> {
  const cards = await getAllYachts();
  const slice = cards.slice(0, limit);
  return enrichWithPricing(slice);
}

export async function getYachtBySlug(slug: string): Promise<Yacht | null> {
  const { bySlug } = await loadCardsAndIndex();
  const uri = bySlug.get(slug);
  if (!uri) return null;

  return memoize<Yacht>(`ankor:entity:${uri}`, ENTITY_TTL_MS, async () => {
    const entity = await fetchEntity(uri);
    if (!entity) throw new Error(`Failed to fetch entity ${uri}`);
    return entityToYacht(entity, slug);
  });
}

export function getFacets(yachts: YachtCard[]): YachtFacets {
  const types = [...new Set(yachts.flatMap((y) => y.yachtType))].filter(Boolean);
  const lengths = yachts.map((y) => y.length).filter((n) => n > 0);
  const guests = yachts.map((y) => y.sleeps).filter((n) => n > 0);
  const prices = yachts
    .map((y) => y.weekPricingFrom ?? y.dayPricingFrom)
    .filter((p): p is number => p != null);

  const safe = (arr: number[]) => (arr.length ? arr : [0]);

  return {
    yachtTypes: types,
    lengthRange: { min: Math.min(...safe(lengths)), max: Math.max(...safe(lengths)) },
    guestRange: { min: Math.min(...safe(guests)), max: Math.max(...safe(guests)) },
    priceRange: { min: Math.min(...safe(prices)), max: Math.max(...safe(prices)) },
  };
}

export function formatPrice(
  cents: number | null | undefined,
  currency: string = "EUR"
): string {
  if (!cents) return "On Request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatLength(meters: number): string {
  const feet = Math.round(meters * 3.28084);
  return `${meters.toFixed(2)}m / ${feet}'`;
}
