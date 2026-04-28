import type { APIRoute } from "astro";
import { getAllYachts, enrichWithPricing, getFacets } from "../../data/yacht-service";

const ANKOR_TYPES = [
  "Gulet", "Sailing", "Catamaran", "Motor",
  "Power Catamaran", "Classic", "Expedition", "Sport fishing",
];

const FEATURED_LIMIT = 9;

export const GET: APIRoute = async ({ url }) => {
  const rawType = url.searchParams.get("yachtType") ?? "";
  const activeType = ANKOR_TYPES.includes(rawType) ? rawType : "";

  try {
    const allYachts = await getAllYachts(activeType || undefined);
    const featured = await enrichWithPricing(allYachts.slice(0, FEATURED_LIMIT));
    const rest = allYachts.slice(FEATURED_LIMIT);
    const facets = getFacets(allYachts);

    return new Response(JSON.stringify({ featured, rest, facets }), {
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
