/**
 * Snapshot reader: serves yacht data from the local JSON snapshot at
 * `src/data/yachts/`, populated by `scripts/sync-yachts.ts`.
 *
 * This is the canonical data source for the public catalogue. The Astro
 * request path never calls Ankor directly — it reads from disk via this
 * module. Errors fetching/parsing the snapshot surface as real errors;
 * we don't fall back to anything (a missing snapshot is a deploy bug).
 *
 * The full index is loaded once per server instance (~17 MB on disk,
 * ~5 MB in memory after JSON.parse). Individual entity files are read
 * on demand for /yachts/[slug] and cached.
 */

import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { YachtCard } from "./types/yacht";
import type { VesselEntity } from "../lib/ankor/types";

// Resolve relative to this file rather than process.cwd() so it works the
// same in dev (cwd = project root) and in Vercel's bundled function (cwd
// can be /var/task).
const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = resolve(__dirname, "yachts");
const INDEX_FILE = join(SNAPSHOT_DIR, "index.json");
const MANIFEST_FILE = join(SNAPSHOT_DIR, "manifest.json");
const ENTITIES_DIR = join(SNAPSHOT_DIR, "entities");

export interface SnapshotManifest {
  generatedAt: string;
  count: number;
  durationMs: number;
  source: string;
  failedEntityFetches?: number;
}

let indexPromise: Promise<YachtCard[]> | null = null;
let manifestPromise: Promise<SnapshotManifest> | null = null;
const entityCache = new Map<string, VesselEntity | null>();

/** Lazily load and cache the catalogue index. */
export function loadSnapshotIndex(): Promise<YachtCard[]> {
  if (!indexPromise) {
    indexPromise = readFile(INDEX_FILE, "utf8")
      .then((raw) => JSON.parse(raw) as YachtCard[])
      .catch((err) => {
        // Reset so a transient FS error doesn't permanently poison the cache.
        indexPromise = null;
        throw new Error(
          `[snapshot] failed to read index.json at ${INDEX_FILE}: ` +
            (err instanceof Error ? err.message : String(err)),
        );
      });
  }
  return indexPromise;
}

/** Lazily load the manifest. */
export function loadSnapshotManifest(): Promise<SnapshotManifest> {
  if (!manifestPromise) {
    manifestPromise = readFile(MANIFEST_FILE, "utf8")
      .then((raw) => JSON.parse(raw) as SnapshotManifest)
      .catch((err) => {
        manifestPromise = null;
        throw new Error(
          `[snapshot] failed to read manifest.json at ${MANIFEST_FILE}: ` +
            (err instanceof Error ? err.message : String(err)),
        );
      });
  }
  return manifestPromise;
}

/**
 * Read a single yacht entity by slug. Returns null if no entity file exists
 * (i.e. unknown slug). Cached per-slug — subsequent calls are free.
 */
export async function loadSnapshotEntity(slug: string): Promise<VesselEntity | null> {
  if (entityCache.has(slug)) {
    return entityCache.get(slug) ?? null;
  }
  // Defensive: prevent path traversal via crafted slugs. Slugs from our
  // sync are always [a-z0-9-], but the function is exported and a caller
  // could pass anything.
  if (!/^[a-z0-9-]+$/.test(slug)) {
    entityCache.set(slug, null);
    return null;
  }
  const path = join(ENTITIES_DIR, `${slug}.json`);
  try {
    const raw = await readFile(path, "utf8");
    const entity = JSON.parse(raw) as VesselEntity;
    entityCache.set(slug, entity);
    return entity;
  } catch (err) {
    // ENOENT is expected for unknown slugs — return null silently.
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      entityCache.set(slug, null);
      return null;
    }
    throw new Error(
      `[snapshot] failed to read entity ${slug}.json: ` +
        (err instanceof Error ? err.message : String(err)),
    );
  }
}
