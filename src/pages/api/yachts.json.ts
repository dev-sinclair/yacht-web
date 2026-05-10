import type { APIRoute } from "astro";
import { getAllYachts, getFacets } from "../../data/yacht-service";
import { regionBySlug } from "../../lib/destinations/registry";
import { getYachtSlugsForRegion } from "../../lib/destinations/location-yachts";

const ANKOR_TYPES = [
  "Gulet", "Sailing", "Catamaran", "Motor",
  "Power Catamaran", "Classic", "Expedition", "Sport fishing",
];

export const GET: APIRoute = async ({ url }) => {
  const rawType = url.searchParams.get("yachtType") ?? "";
  const activeType = ANKOR_TYPES.includes(rawType) ? rawType : "";

  const rawRegion = url.searchParams.get("region") ?? "";
  const region = rawRegion ? regionBySlug(rawRegion) : null;

  try {
    let items = await getAllYachts(activeType || undefined);

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
