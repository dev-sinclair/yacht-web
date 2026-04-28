// Client-side currency handling for the yacht catalogue.
// Yachts are priced in their native currency (mostly EUR, sometimes USD).
// We let the user pick a display currency on /yachts pages and convert
// client-side using rates fetched from /api/fx-rates.json (proxied + edge-cached
// from open.er-api.com), with a hardcoded fallback for resilience.

export type SupportedCurrency = "EUR" | "USD" | "GBP";

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = ["EUR", "USD", "GBP"];

// Hardcoded fallback rates relative to EUR, used when the live fetch hasn't
// arrived yet OR when both the API and the localStorage cache are unavailable.
// Update periodically (quarterly is fine) to keep the worst-case drift small.
const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
};

const CURRENCY_STORAGE_KEY = "sinclair:currency";
const RATES_STORAGE_KEY = "sinclair:fx-rates";
const RATES_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
export const CURRENCY_EVENT = "sinclair:currency-changed";

interface CachedRates {
  rates: Record<SupportedCurrency, number>;
  fetchedAt: number; // ms epoch
}

// Module-level mutable state. Any caller of convertCents/formatPriceConverted
// gets whichever rates are currently loaded.
let activeRates: Record<SupportedCurrency, number> = { ...FALLBACK_RATES };

export function isSupported(c: string): c is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(c as SupportedCurrency);
}

export function getActiveCurrency(): SupportedCurrency {
  if (typeof window === "undefined") return "EUR";
  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && isSupported(stored)) return stored;
  } catch {
    // localStorage may be blocked
  }
  return "EUR";
}

export function setActiveCurrency(c: SupportedCurrency): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, c);
  } catch {
    // ignore write failure
  }
  window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: c }));
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
      typeof parsed?.rates?.GBP !== "number"
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
      typeof r?.GBP !== "number"
    ) {
      return null;
    }
    return {
      rates: { EUR: r.EUR, USD: r.USD, GBP: r.GBP },
      fetchedAt: typeof data.fetchedAt === "number" ? data.fetchedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

// Initialize on module load: prefer fresh-enough cached rates, then refresh in
// the background. Re-paint via CURRENCY_EVENT once new rates land.
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
    // Notify .cur-price elements to re-paint with the new rates.
    window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: getActiveCurrency() }));
  });
}

initRates();

// ---- conversion ----

export function convertCents(
  amountCents: number,
  from: string,
  to: SupportedCurrency,
): number {
  const fromRate = activeRates[from as SupportedCurrency] ?? activeRates.EUR;
  const toRate = activeRates[to];
  return amountCents * (toRate / fromRate);
}

export function formatPriceConverted(
  amountCents: number | null | undefined,
  fromCurrency: string,
  toCurrency: SupportedCurrency = getActiveCurrency(),
): string {
  if (!amountCents) return "On Request";
  const converted = convertCents(amountCents, fromCurrency, toCurrency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: toCurrency,
    maximumFractionDigits: 0,
  }).format(converted / 100);
}
