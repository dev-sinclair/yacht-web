import type { APIRoute } from "astro";
import {
  getAllYachts,
  getFacets,
  isYachtCategory,
  isYachtSeason,
} from "../../data/yacht-service";
import { regionBySlug } from "../../lib/destinations/registry";
import {
  getYachtSlugsForLocation,
  getYachtSlugsForRegion,
  locationBySlug,
} from "../../lib/destinations/location-yachts";

export const GET: APIRoute = async ({ url }) => {
  const rawType = url.searchParams.get("yachtType") ?? "";
  const activeType = isYachtCategory(rawType) ? rawType : "";

  const rawRegion = url.searchParams.get("region") ?? "";
  const region = rawRegion ? regionBySlug(rawRegion) : null;

  const rawLocation = url.searchParams.get("location") ?? "";
  const location = region && rawLocation ? locationBySlug(region, rawLocation) : null;

  const rawSeason = url.searchParams.get("season") ?? "";
  const activeSeason = isYachtSeason(rawSeason) ? rawSeason : "";

  try {
    // Eligibility (length/guests/week-price) is enforced inside getAllYachts —
    // see isEligibleYacht in yacht-service.ts. No need to re-filter here.
    let items = await getAllYachts(activeType || undefined);

    if (region) {
      const allowed = location
        ? await getYachtSlugsForLocation(location)
        : await getYachtSlugsForRegion(region);
      items = items.filter((y) => allowed.has(y.slug));
    }

    if (activeSeason) {
      // Yachts with no seasons array (older snapshots or no pricing dates)
      // get dropped — we can't confirm they have inventory in that window.
      items = items.filter((y) => y.seasons?.includes(activeSeason));
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
