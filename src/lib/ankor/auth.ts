import { tokenUrl } from "./config";
import { signAssertion } from "./jwt";
import type { OAuthTokenResponse } from "./types";

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;
let inFlight: Promise<string> | null = null;

const SAFETY_MARGIN_MS = 30_000;

async function fetchToken(): Promise<string> {
  const assertion = signAssertion();
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const res = await fetch(tokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ankor token request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as OAuthTokenResponse;
  const now = Date.now();
  const expiresMs = data.expires > 1_000_000_000_000 ? data.expires : now + data.expires * 1000;
  cached = {
    token: data.access_token,
    expiresAt: expiresMs - SAFETY_MARGIN_MS,
  };
  return data.access_token;
}

export async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  if (inFlight) return inFlight;
  inFlight = fetchToken().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

export function invalidateToken(): void {
  cached = null;
}
