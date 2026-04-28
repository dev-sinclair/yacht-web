import { ankorPost } from "./client";

const registered = new Set<string>();
const inFlight = new Map<string, Promise<void>>();

export async function ensureRegistered(uri: string, link?: string): Promise<void> {
  if (registered.has(uri)) return;
  const pending = inFlight.get(uri);
  if (pending) return pending;

  const path = `/website/register/${encodeURIComponent(uri)}`;
  const body = { link: link ?? "https://sinclair-yachts.com" };

  const p = ankorPost(path, body)
    .then(() => {
      registered.add(uri);
    })
    .catch((err) => {
      console.warn(`[ankor] register ${uri} failed:`, err instanceof Error ? err.message : err);
      registered.add(uri);
    })
    .finally(() => {
      inFlight.delete(uri);
    });

  inFlight.set(uri, p);
  return p;
}
