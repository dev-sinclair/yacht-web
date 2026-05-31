// Client-side FX conversion for the yacht catalogue.
// Yachts are priced in their native currency (mostly EUR, sometimes USD/AUD/AED).
// We convert client-side using rates fetched from /api/fx-rates.json
// (proxied + edge-cached from open.er-api.com), with a hardcoded fallback for
// resilience. Today there's no user-facing currency switcher — `convertCents`
// is used by /yachts to fold prices to EUR-equivalents so the catalogue can
// sort by price across mixed currencies.

export type SupportedCurrency = "EUR" | "USD" | "GBP" | "AUD" | "AED";

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  "EUR", "USD", "GBP", "AUD", "AED",
];

// Hardcoded fallback rates relative to EUR, used when the live fetch hasn't
// arrived yet OR when both the API and the localStorage cache are unavailable.
// Update periodically (quarterly is fine) to keep the worst-case drift small.
const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  AUD: 1.65,
  AED: 3.95,
};

const RATES_STORAGE_KEY = "sinclair:fx-rates";
const RATES_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface CachedRates {
  rates: Record<SupportedCurrency, number>;
  fetchedAt: number; // ms epoch
}

// Module-level mutable state. Any caller of convertCents gets whichever rates
// are currently loaded.
let activeRates: Record<SupportedCurrency, number> = { ...FALLBACK_RATES };

function isSupported(c: string): c is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(c as SupportedCurrency);
}

// ---- live rates ----

function loadCachedRates(): CachedRates | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RATES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedRates;
    if (
      typeof parsed?.fetchedAt !== "number" ||
      typeof parsed?.rates?.EUR !== "number" ||
      typeof parsed?.rates?.USD !== "number" ||
      typeof parsed?.rates?.GBP !== "number" ||
      typeof parsed?.rates?.AUD !== "number" ||
      typeof parsed?.rates?.AED !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveCachedRates(c: CachedRates): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(c));
  } catch {
    // ignore write failure
  }
}

async function fetchLiveRates(): Promise<CachedRates | null> {
  try {
    const res = await fetch("/api/fx-rates.json");
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: Record<string, number>; fetchedAt?: number };
    const r = data?.rates;
    if (
      typeof r?.EUR !== "number" ||
      typeof r?.USD !== "number" ||
      typeof r?.GBP !== "number" ||
      typeof r?.AUD !== "number" ||
      typeof r?.AED !== "number"
    ) {
      return null;
    }
    return {
      rates: { EUR: r.EUR, USD: r.USD, GBP: r.GBP, AUD: r.AUD, AED: r.AED },
      fetchedAt: typeof data.fetchedAt === "number" ? data.fetchedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

// Initialize on module load: prefer fresh-enough cached rates, then refresh in
// the background. Re-sort/paint is the caller's responsibility — today no one
// listens for rate updates, so a refresh applies on the next page load.
function initRates(): void {
  if (typeof window === "undefined") return;

  const cached = loadCachedRates();
  if (cached) {
    activeRates = cached.rates;
  }

  const cacheStale = !cached || Date.now() - cached.fetchedAt > RATES_TTL_MS;
  if (!cacheStale) return; // fresh cache, no fetch needed

  // Fire-and-forget: don't block module load.
  void fetchLiveRates().then((live) => {
    if (!live) return;
    activeRates = live.rates;
    saveCachedRates(live);
  });
}

initRates();

// ---- conversion ----

export function convertCents(
  amountCents: number,
  from: string,
  to: SupportedCurrency,
): number {
  const fromRate = isSupported(from) ? activeRates[from] : activeRates.EUR;
  const toRate = activeRates[to];
  return amountCents * (toRate / fromRate);
}
