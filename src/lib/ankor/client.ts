import { ankorConfig } from "./config";
import { getToken, invalidateToken } from "./auth";

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  const url = path.startsWith("http") ? path : `${ankorConfig.baseUrl}${path}`;
  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    invalidateToken();
    const retryToken = await getToken();
    headers.set("Authorization", `Bearer ${retryToken}`);
    return fetch(url, { ...init, headers });
  }

  return res;
}

async function parseOrThrow<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ankor ${label} failed (${res.status}): ${text.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

export async function ankorGet<T>(path: string): Promise<T> {
  const res = await authedFetch(path, { method: "GET" });
  return parseOrThrow<T>(res, `GET ${path}`);
}

export async function ankorPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await authedFetch(path, {
    method: "POST",
    body: body == null ? undefined : JSON.stringify(body),
  });
  return parseOrThrow<T>(res, `POST ${path}`);
}

export async function ankorDelete<T>(path: string): Promise<T> {
  const res = await authedFetch(path, { method: "DELETE" });
  return parseOrThrow<T>(res, `DELETE ${path}`);
}
