import type { Yacht, YachtCard, CabinByType, PricingInfo, CrewMember } from "../../data/types/yacht";
import { resolveImage } from "./image";
import type {
  AnkorCabinLayout,
  AnkorPricingInfo,
  VesselEntity,
  VesselSummary,
} from "./types";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(name: string, uri: string, used: Set<string>): string {
  const base = slugify(name) || "yacht";
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  const tail = uri.split("::").pop()?.slice(0, 6) ?? Math.random().toString(36).slice(2, 8);
  // Two yachts can share both base name AND first-6 URI chars (Ankor URIs
  // are time-ordered UUIDs, so older yachts cluster on prefixes). If the
  // primary candidate collides too, add a numeric counter.
  let candidate = `${base}-${tail}`;
  let i = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${tail}-${i++}`;
  }
  used.add(candidate);
  return candidate;
}

const num = (v: unknown, fallback = 0): number => {
  if (v == null) return fallback;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const numOrNull = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const toArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string" && v) return [v];
  return [];
};

export function summaryToCard(s: VesselSummary, slug: string): YachtCard {
  // Keep the raw hero URL (with `{imageVariant}` token) so each consumer can
  // resolve to the appropriate size — the grid uses ~640x, the home carousel
  // uses 1280w/2560w.
  return {
    uri: s.uri,
    slug,
    name: s.name,
    hero: s.hero ?? "",
    length: num(s.length),
    sleeps: num(s.sleeps),
    cabins: num(s.cabins),
    builtYear: numOrNull(s.builtYear),
    builder: s.make ?? "",
    yachtType: toArray(s.yachtType),
    dayPricingFrom: numOrNull(s.dayPricingFrom),
    weekPricingFrom: numOrNull(s.weekPricingFrom),
    currency: s.currency ?? "EUR",
  };
}

function mapCabinLayout(layout: AnkorCabinLayout[] | undefined): CabinByType[] {
  if (!layout) return [];
  return layout
    .map((c) => {
      const qty = typeof c.quantity === "number" ? c.quantity : Number(c.quantity);
      return {
        type: (c.label ?? "").toLowerCase().replace(/\s+cabin$/i, "").trim() || "cabin",
        count: Number.isFinite(qty) ? qty : 1,
      };
    })
    .filter((c) => c.count > 0);
}

function mapPricingInfo(info: AnkorPricingInfo[] | undefined, currency: string): PricingInfo[] {
  if (!info) return [];
  const out: PricingInfo[] = [];
  for (const item of info) {
    const cur = item.pricing?.currency ?? currency;
    const total = item.pricing?.total ?? item.pricing?.charterFee ?? 0;
    const period: "day" | "week" = item.pricing?.unit === "DAY" ? "day" : "week";
    const dates = item.effectiveDates ?? [];
    if (dates.length === 0) {
      out.push({
        effectiveDateStart: "",
        effectiveDateEnd: "",
        currency: cur,
        total,
        period,
      });
      continue;
    }
    for (const d of dates) {
      out.push({
        effectiveDateStart: d.from,
        effectiveDateEnd: d.to,
        currency: cur,
        total,
        period,
      });
    }
  }
  return out;
}

/**
 * Derive season-year tags from a yacht's pricing date ranges.
 *
 * Windows (Northern-hemisphere convention):
 *   Summer YYYY = May 1 YYYY → Oct 31 YYYY
 *   Winter YYYY = Nov 1 YYYY → Apr 30 (YYYY+1)
 *
 * A yacht qualifies for a tag if ANY priced effective-date range intersects
 * that season window. Yachts with only an annual rate (Jan 1 → Dec 31) will
 * intersect every Summer Y window inside the range AND the adjacent Winter
 * (Y-1) + Winter Y windows via the Jan–Apr / Nov–Dec legs respectively — so
 * "available year-round" charters surface in both summer and winter filters.
 */
export function computeSeasonTags(
  info: AnkorPricingInfo[] | undefined,
): string[] {
  if (!info) return [];
  const tags = new Set<string>();
  for (const item of info) {
    for (const d of item.effectiveDates ?? []) {
      addSeasonsForRange(d.from, d.to, tags);
    }
  }
  return [...tags].sort();
}

function addSeasonsForRange(fromIso: string, toIso: string, out: Set<string>): void {
  const fromMs = Date.parse(fromIso);
  const toMs = Date.parse(toIso);
  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs) || toMs < fromMs) return;
  const sy = new Date(fromMs).getUTCFullYear();
  const ey = new Date(toMs).getUTCFullYear();
  // Start one year earlier so a range that begins in Jan–Apr can still tag
  // the prior year's Winter (Nov (Y-1) → Apr Y).
  for (let y = sy - 1; y <= ey; y++) {
    const summerStart = Date.UTC(y, 4, 1);
    const summerEnd = Date.UTC(y, 9, 31, 23, 59, 59, 999);
    if (fromMs <= summerEnd && toMs >= summerStart) out.add(`summer-${y}`);

    const winterStart = Date.UTC(y, 10, 1);
    const winterEnd = Date.UTC(y + 1, 3, 30, 23, 59, 59, 999);
    if (fromMs <= winterEnd && toMs >= winterStart) out.add(`winter-${y}`);
  }
}

function collectZones(info: AnkorPricingInfo[] | undefined): string[] {
  if (!info) return [];
  const set = new Set<string>();
  for (const item of info) {
    for (const zone of item.inclusionZones ?? []) {
      if (zone.label) set.add(zone.label);
    }
  }
  return [...set];
}

function mapCrew(crew: VesselEntity["crew"]): CrewMember[] {
  if (!crew) return [];
  return crew.map((c) => ({
    name: c.name,
    role: Array.isArray(c.role) ? c.role.join(", ") : c.role ?? "",
    description: c.bio ?? "",
    photo: c.avatar ? resolveImage(c.avatar, "640x") : "",
  }));
}

export function entityToYacht(e: VesselEntity, slug: string): Yacht {
  const bp = e.blueprint;
  const pricing = e.pricing ?? {};
  const currency = pricing.currency ?? pricing.weekPricingFrom?.currency ?? "EUR";

  // Hero is rendered full-bleed (~65vh tall, viewport-wide) so it gets the
  // larger variant. Gallery thumbnails sit in a 3-column 4:3 grid (≤400px
  // wide on desktop) so a 640x variant is more than enough — saves ~75%
  // bandwidth per thumbnail vs 1280w on a 50-image gallery.
  // Fall back to bp.images[0] if bp.hero is missing (some yachts only set
  // the gallery and rely on the first image as the hero).
  const allRaws = (bp.images ?? []).filter((u): u is string => !!u);
  const heroRaw = bp.hero || allRaws[0] || "";
  const galleryRaws = allRaws.filter((u) => u !== heroRaw);
  const heroImg = resolveImage(heroRaw, "1280w");
  const galleryImgs = galleryRaws
    .map((u) => resolveImage(u, "640x"))
    .filter((u): u is string => !!u);
  const allImageUrls: string[] = heroImg ? [heroImg, ...galleryImgs] : galleryImgs;

  const images = allImageUrls.map((url) => ({ url, alt: bp.name }));

  return {
    uri: e.uri,
    slug,
    blueprint: {
      name: bp.name,
      length: num(bp.length),
      beam: num(bp.beam),
      draft: num(bp.draft),
      sleeps: num(bp.sleeps),
      cruisingCapacity: num(bp.cruisingCapacity, num(bp.sleeps)),
      buildYear: num(bp.builtYear),
      builder: bp.make ?? "",
      architect: bp.architect ?? "",
      refitYear: bp.refitYear ?? null,
    },
    yachtType: toArray(e.yachtType),
    cabins: {
      total: num(bp.cabins),
      byType: mapCabinLayout(bp.cabinLayout),
      bathrooms: num(bp.bathrooms),
    },
    pricingInfo: mapPricingInfo(pricing.pricingInfo, currency),
    dayPricingFrom: numOrNull(pricing.dayPricingFrom?.price),
    weekPricingFrom: numOrNull(pricing.weekPricingFrom?.price),
    currency,
    images,
    toys: (bp.toys ?? []).map((t) => t.label ?? "").filter(Boolean),
    amenities: (bp.amenities ?? []).map((a) => a.label ?? "").filter(Boolean),
    entertainment: bp.entertainment ?? [],
    tenders: bp.tenders ?? [],
    crew: mapCrew(e.crew),
    hull: {
      type: bp.hullType ?? "",
      construction: bp.hullConstruction ?? "",
    },
    performance: {
      topSpeed: num(bp.topSpeed),
      cruisingSpeed: num(bp.cruiseSpeed),
    },
    geographicZones: collectZones(pricing.pricingInfo),
    description: e.description ?? "",
  };
}
