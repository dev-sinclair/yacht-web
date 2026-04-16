import type { Yacht, YachtFacets, YachtFilters } from "./types/yacht";
import { mockYachts } from "./yachts-mock";

// ─── Data access (SWAP POINT: replace mockYachts with API fetch) ───

export function getAllYachts(): Yacht[] {
  return mockYachts;
}

export function getYachtBySlug(slug: string): Yacht | undefined {
  return getAllYachts().find((y) => y.slug === slug);
}

export function getFilteredYachts(filters: YachtFilters): Yacht[] {
  let yachts = getAllYachts();

  if (filters.yachtType) {
    yachts = yachts.filter((y) => y.yachtType.includes(filters.yachtType!));
  }
  if (filters.lengthMin != null) {
    yachts = yachts.filter((y) => y.blueprint.length >= filters.lengthMin!);
  }
  if (filters.lengthMax != null) {
    yachts = yachts.filter((y) => y.blueprint.length <= filters.lengthMax!);
  }
  if (filters.guestsMin != null) {
    yachts = yachts.filter((y) => y.blueprint.sleeps >= filters.guestsMin!);
  }
  if (filters.priceMax != null) {
    yachts = yachts.filter(
      (y) => y.dayPricingFrom != null && y.dayPricingFrom <= filters.priceMax!
    );
  }

  return yachts;
}

export function getFacets(): YachtFacets {
  const yachts = getAllYachts();
  const types = [...new Set(yachts.flatMap((y) => y.yachtType))];
  const lengths = yachts.map((y) => y.blueprint.length);
  const guests = yachts.map((y) => y.blueprint.sleeps);
  const prices = yachts
    .map((y) => y.dayPricingFrom)
    .filter((p): p is number => p != null);

  return {
    yachtTypes: types,
    lengthRange: { min: Math.min(...lengths), max: Math.max(...lengths) },
    guestRange: { min: Math.min(...guests), max: Math.max(...guests) },
    priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
  };
}

export function formatPrice(
  cents: number | null,
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
