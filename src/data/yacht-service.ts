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

export const YACHT_CATEGORIES = ["Sailing", "Motor", "Catamarans"] as const;
export type YachtCategory = (typeof YACHT_CATEGORIES)[number];

// User-facing season filter options. The snapshot carries tags for many more
// years (currently 2022–2029 fall in the priced ranges) but we surface only
// the next two summer/winter pairs in the UI to keep the dropdown short. To
// add 2028, just append `"summer-2028", "winter-2028"` here — the snapshot
// data is already there.
export const YACHT_SEASONS = [
  "summer-2026",
  "winter-2026",
  "summer-2027",
  "winter-2027",
] as const;
export type YachtSeason = (typeof YACHT_SEASONS)[number];

export function isYachtSeason(s: string): s is YachtSeason {
  return (YACHT_SEASONS as readonly string[]).includes(s);
}

export function formatSeason(s: YachtSeason): string {
  const [season, year] = s.split("-");
  const cap = season ? season.charAt(0).toUpperCase() + season.slice(1) : "";
  return `${cap} ${year}`;
}

const CATEGORY_TO_TYPES: Record<YachtCategory, readonly string[]> = {
  Sailing: ["Sailing", "Gulet"],
  Motor: ["Motor", "Classic", "Expedition"],
  Catamarans: ["Catamaran", "Power Catamaran"],
};

export function isYachtCategory(s: string): s is YachtCategory {
  return (YACHT_CATEGORIES as readonly string[]).includes(s);
}

// ─── Global eligibility ────────────────────────────────────────────────────
// Single source of truth for "should this yacht appear anywhere on the
// site". Anything user-facing — catalog, region pages, featured carousel,
// detail page — should run candidates through `isEligibleYacht` (or the
// helpers below) so we never leak ineligible yachts to one surface and
// hide them on another.

const LENGTH_MIN_DEFAULT = 30;     // meters
const LENGTH_MIN_CATAMARAN = 24;   // meters — catamarans are wider for their length
const CATAMARAN_TYPES = new Set(["Catamaran", "Power Catamaran"]);
const GUESTS_MAX = 12;             // private-charter market cap

// Minimum acceptable price = €15,000 / week-equivalent. Day-only yachts
// are aggregated as day × 7 before comparison so high-end day charters
// still surface with their weekly equivalent.
const MIN_WEEK_EUR_CENTS = 15_000 * 100;

// Reciprocal of FALLBACK_RATES in src/lib/currency.ts (native → EUR factor).
// This is a business gate, not a live quote — fallback rates are stable
// enough and avoid pulling in the client-side rates module on the server.
const TO_EUR: Record<string, number> = {
  EUR: 1,
  USD: 1 / 1.08,
  GBP: 1 / 0.85,
  AUD: 1 / 1.65,
  AED: 1 / 3.95,
};

function isCatamaran(yachtType: readonly string[]): boolean {
  return yachtType.some((t) => CATAMARAN_TYPES.has(t));
}

/**
 * Week-equivalent price in NATIVE-currency cents (no FX conversion).
 * Returns weekPricingFrom verbatim when present; otherwise day × 7 when
 * a positive day price exists; otherwise null.
 */
export function weekEquivalentCents(y: Pick<YachtCard, "weekPricingFrom" | "dayPricingFrom">): number | null {
  if (y.weekPricingFrom != null && y.weekPricingFrom > 0) return y.weekPricingFrom;
  if (y.dayPricingFrom != null && y.dayPricingFrom > 0) return y.dayPricingFrom * 7;
  return null;
}

/**
 * Week-equivalent price converted to EUR cents using the static fallback
 * FX rates. Use for cross-currency comparisons (filter ranges, sorting,
 * the €15k eligibility gate) — not for displayed quotes.
 */
export function weekEquivalentEurCents(
  y: Pick<YachtCard, "weekPricingFrom" | "dayPricingFrom" | "currency">,
): number | null {
  const cents = weekEquivalentCents(y);
  if (cents == null) return null;
  const rate = TO_EUR[y.currency || "EUR"] ?? 1;
  return Math.round(cents * rate);
}

export function meetsMinimumWeekPrice(y: Pick<YachtCard, "weekPricingFrom" | "dayPricingFrom" | "currency">): boolean {
  const cents = weekEquivalentCents(y);
  if (cents == null) return false;
  const rate = TO_EUR[y.currency || "EUR"] ?? 1;
  return cents * rate >= MIN_WEEK_EUR_CENTS;
}

/**
 * Returns true if the yacht should be shown anywhere on the site. Applies:
 * - length: 24m+ for catamarans, 30m+ for all other yacht types
 * - guests (sleeps): 1–12 inclusive; yachts with no/zero sleep data are
 *   rejected since we can't confirm they fit the cap
 * - price: week-equivalent ≥ €15,000 (day-only yachts aggregated as day × 7)
 */
export function isEligibleYacht(
  y: Pick<YachtCard, "yachtType" | "length" | "sleeps" | "weekPricingFrom" | "dayPricingFrom" | "currency">,
): boolean {
  const minLength = isCatamaran(y.yachtType) ? LENGTH_MIN_CATAMARAN : LENGTH_MIN_DEFAULT;
  if (!y.length || y.length < minLength) return false;
  if (!y.sleeps || y.sleeps <= 0 || y.sleeps > GUESTS_MAX) return false;
  return meetsMinimumWeekPrice(y);
}

export async function getAllYachts(category?: string): Promise<YachtCard[]> {
  const cards = await loadSnapshotIndex();
  const eligible = cards.filter(isEligibleYacht);
  if (!category || !isYachtCategory(category)) return eligible;
  const allowed = new Set(CATEGORY_TO_TYPES[category]);
  return eligible.filter((c) => c.yachtType.some((t) => allowed.has(t)));
}

export async function getFeaturedYachts(limit = 10): Promise<YachtCard[]> {
  const cards = await loadSnapshotIndex();
  return cards.filter(isEligibleYacht).slice(0, limit);
}

export async function getYachtBySlug(slug: string): Promise<Yacht | null> {
  const entity = await loadSnapshotEntity(slug);
  if (!entity) return null;
  const yacht = entityToYacht(entity, slug);
  // Gate detail-page access on the same eligibility rules as the catalog —
  // direct URLs to ineligible yachts 404 (the detail page then redirects to /yachts).
  const eligibilityProbe = {
    yachtType: yacht.yachtType,
    length: yacht.blueprint.length,
    sleeps: yacht.blueprint.sleeps,
    weekPricingFrom: yacht.weekPricingFrom,
    dayPricingFrom: yacht.dayPricingFrom,
    currency: yacht.currency,
  };
  if (!isEligibleYacht(eligibilityProbe)) return null;
  return yacht;
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
  // EUR-cents week-equivalent so the range is comparable across currencies
  // and aggregates day-only yachts as day × 7 (mirrors the catalog display).
  const prices = yachts
    .map(weekEquivalentEurCents)
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
  return `${meters.toFixed(1)}m / ${feet}'`;
}
