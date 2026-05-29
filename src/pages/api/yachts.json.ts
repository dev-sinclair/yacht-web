import type { APIRoute } from "astro";
import { getAllYachts, getFacets, isYachtCategory } from "../../data/yacht-service";
import { regionBySlug } from "../../lib/destinations/registry";
import { getYachtSlugsForRegion } from "../../lib/destinations/location-yachts";
import type { YachtCard } from "../../data/types/yacht";

// Business rule: only serve yachts that charter for €15,000/week or more.
// Compared on a week-equivalent EUR basis — day-only yachts are extrapolated
// as day × 7. Yachts with no pricing data are excluded too: we can't confirm
// they clear the threshold, so we don't show them.
const MIN_WEEK_EUR_CENTS = 15_000 * 100;

// Reciprocal of FALLBACK_RATES in src/lib/currency.ts (native → EUR factor).
// This filter is a business gate, not a price quote — fallback rates are
// stable enough and avoid pulling in the client-side rates module here.
const TO_EUR: Record<string, number> = {
  EUR: 1,
  USD: 1 / 1.08,
  GBP: 1 / 0.85,
  AUD: 1 / 1.65,
  AED: 1 / 3.95,
};

function meetsMinimumWeekPrice(y: YachtCard): boolean {
  const native =
    y.weekPricingFrom ?? (y.dayPricingFrom != null ? y.dayPricingFrom * 7 : null);
  if (native == null || native <= 0) return false;
  const rate = TO_EUR[y.currency || "EUR"] ?? 1;
  return native * rate >= MIN_WEEK_EUR_CENTS;
}

export const GET: APIRoute = async ({ url }) => {
  const rawType = url.searchParams.get("yachtType") ?? "";
  const activeType = isYachtCategory(rawType) ? rawType : "";

  const rawRegion = url.searchParams.get("region") ?? "";
  const region = rawRegion ? regionBySlug(rawRegion) : null;

  try {
    let items = await getAllYachts(activeType || undefined);
    items = items.filter(meetsMinimumWeekPrice);

    if (region) {
      const allowed = await getYachtSlugsForRegion(region);
      items = items.filter((y) => allowed.has(y.slug));
    }

    const facets = getFacets(items);

    return new Response(JSON.stringify({ items, facets }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[api/yachts] failed:", err);
    return new Response(JSON.stringify({ error: "Failed to load yachts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
