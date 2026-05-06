/**
 * Yacht catalogue service.
 *
 * Reads yacht data from the local snapshot at `src/data/yachts/`, populated
 * by `scripts/sync-yachts.ts` running on a 6-hourly cron. The Astro request
 * path never calls Ankor directly — that decoupling is what gives us
 * sub-100ms catalogue loads and resilience against Ankor outages.
 *
 * Public surface (function signatures) is unchanged from the old live-API
 * implementation, so callers in pages/components/api routes don't need to
 * change.
 */

import type { Yacht, YachtCard, YachtFacets } from "./types/yacht";
import { entityToYacht } from "../lib/ankor/mappers";
import { loadSnapshotIndex, loadSnapshotEntity } from "./snapshot";

export async function getAllYachts(yachtType?: string): Promise<YachtCard[]> {
  const cards = await loadSnapshotIndex();
  if (!yachtType) return cards;
  return cards.filter((c) => c.yachtType.includes(yachtType));
}

export async function getFeaturedYachts(limit = 10): Promise<YachtCard[]> {
  const cards = await loadSnapshotIndex();
  return cards.slice(0, limit);
}

export async function getYachtBySlug(slug: string): Promise<Yacht | null> {
  const entity = await loadSnapshotEntity(slug);
  if (!entity) return null;
  return entityToYacht(entity, slug);
}

/**
 * Pricing enrichment is now baked into the snapshot index at sync time
 * (see scripts/sync-yachts.ts), so this is an identity function. Kept as
 * a named export to preserve the public API for existing callers like
 * `/api/yachts.json`. Safe to remove once those callers stop importing it.
 */
export async function enrichWithPricing(cards: YachtCard[]): Promise<YachtCard[]> {
  return cards;
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
  currency: string = "EUR",
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
