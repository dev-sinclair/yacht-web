import type { APIRoute } from "astro";
import { getAllYachts, getFacets } from "../../data/yacht-service";

const ANKOR_TYPES = [
  "Gulet", "Sailing", "Catamaran", "Motor",
  "Power Catamaran", "Classic", "Expedition", "Sport fishing",
];

export const GET: APIRoute = async ({ url }) => {
  const rawType = url.searchParams.get("yachtType") ?? "";
  const activeType = ANKOR_TYPES.includes(rawType) ? rawType : "";

  try {
    const items = await getAllYachts(activeType || undefined);
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
