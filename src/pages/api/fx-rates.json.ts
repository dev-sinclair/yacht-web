import type { APIRoute } from "astro";

// Server-side proxy for FX rates. Hides the upstream from clients, lets us
// CDN-cache the response at the edge (~4 upstream calls per day per region),
// and validates the response before it ever reaches the browser.
//
// Upstream: open.er-api.com — free tier, no auth, daily updates, ECB-derived.

const UPSTREAM = "https://open.er-api.com/v6/latest/EUR";

// Sanity bounds: any rate outside these is treated as a bad response.
// USD ~0.85–1.6 vs EUR; GBP ~0.55–1.0; AUD ~1.4–2.0; AED is USD-pegged
// so its EUR rate tracks USD * 3.67 ≈ 3.5–4.5.
const USD_BOUNDS = { min: 0.5, max: 2.0 };
const GBP_BOUNDS = { min: 0.5, max: 1.5 };
const AUD_BOUNDS = { min: 1.0, max: 2.5 };
const AED_BOUNDS = { min: 3.0, max: 5.0 };

const FALLBACK = {
  rates: { EUR: 1, USD: 1.08, GBP: 0.85, AUD: 1.65, AED: 3.95 },
  fetchedAt: 0,        // 0 = "we don't actually know how fresh this is"
  source: "fallback",
};

interface UpstreamShape {
  result?: string;
  base_code?: string;
  rates?: Record<string, number>;
  time_last_update_unix?: number;
}

function inRange(v: unknown, b: { min: number; max: number }): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= b.min && v <= b.max;
}

export const GET: APIRoute = async () => {
  try {
    const res = await fetch(UPSTREAM, {
      // Don't let a hung upstream block the function for 30s.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`upstream status ${res.status}`);
    const data = (await res.json()) as UpstreamShape;

    if (data.result !== "success" || data.base_code !== "EUR" || !data.rates) {
      throw new Error("unexpected upstream shape");
    }
    const usd = data.rates.USD;
    const gbp = data.rates.GBP;
    const aud = data.rates.AUD;
    const aed = data.rates.AED;
    if (
      !inRange(usd, USD_BOUNDS) ||
      !inRange(gbp, GBP_BOUNDS) ||
      !inRange(aud, AUD_BOUNDS) ||
      !inRange(aed, AED_BOUNDS)
    ) {
      throw new Error(
        `rate out of bounds: USD=${usd}, GBP=${gbp}, AUD=${aud}, AED=${aed}`,
      );
    }

    return new Response(
      JSON.stringify({
        rates: { EUR: 1, USD: usd, GBP: gbp, AUD: aud, AED: aed },
        fetchedAt: (data.time_last_update_unix ?? Math.floor(Date.now() / 1000)) * 1000,
        source: "live",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // 6h fresh, 24h stale: edge caches and serves stale while revalidating.
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (err) {
    console.warn("[api/fx-rates] upstream failed, serving fallback:", err);
    // Don't cache failures at the edge — retry on next request.
    return new Response(JSON.stringify(FALLBACK), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
};
