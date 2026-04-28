import type { APIRoute } from "astro";
import { getYachtBySlug } from "../../../data/yacht-service";

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const yacht = await getYachtBySlug(slug);
    if (!yacht) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60",
        },
      });
    }

    return new Response(JSON.stringify(yacht), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[api/yacht/:slug] failed:", err);
    return new Response(JSON.stringify({ error: "Failed to load yacht" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
