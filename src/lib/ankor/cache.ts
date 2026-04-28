interface Entry<T> {
  value: T;
  expiresAt: number;
}

const memo = new Map<string, Entry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

export async function memoize<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = memo.get(key) as Entry<T> | undefined;
  if (hit && hit.expiresAt > now) return hit.value;

  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const p = fn()
    .then((value) => {
      memo.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, p);
  return p;
}

export function invalidateCacheKey(key: string): void {
  memo.delete(key);
}
