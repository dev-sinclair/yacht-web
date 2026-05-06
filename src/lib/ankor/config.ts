// Vite/Astro injects `import.meta.env` at build time. When this module is
// imported from a plain Node context (e.g. `scripts/sync-yachts.ts` run via
// tsx), `import.meta.env` is undefined — guard so a direct property read
// doesn't crash.
const importMetaEnv: Record<string, string | undefined> =
  ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {};

const env = (key: string, fallback?: string): string => {
  const v = importMetaEnv[key] ?? process.env[key] ?? fallback;
  if (v == null || v === "") {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
};

const optionalEnv = (key: string, fallback: string): string =>
  importMetaEnv[key] ?? process.env[key] ?? fallback;

function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  if (!key.includes("BEGIN") || !key.includes("END")) {
    throw new Error(
      "ANKOR_PRIVATE_KEY does not look like a PEM key (missing BEGIN/END markers). " +
      "In .env, put the whole key on one line with literal \\n separators, e.g.:\n" +
      'ANKOR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMI...\\n-----END PRIVATE KEY-----"',
    );
  }
  return key;
}

export const ankorConfig = {
  baseUrl: optionalEnv("ANKOR_BASE_URL", "https://api.ankor.io").replace(/\/$/, ""),
  companyUri: () => env("ANKOR_COMPANY_URI"),
  keyId: () => env("ANKOR_KEY_ID"),
  privateKey: () => normalizePrivateKey(env("ANKOR_PRIVATE_KEY")),
  defaultCurrency: optionalEnv("ANKOR_DEFAULT_CURRENCY", "EUR"),
  minLengthM: Number(optionalEnv("ANKOR_MIN_LENGTH_M", "15")),
  minWeekPriceCents: Number(optionalEnv("ANKOR_MIN_WEEK_PRICE_CENTS", "1500000")),
};

export const tokenUrl = () => `${ankorConfig.baseUrl}/iam/oauth/token`;
