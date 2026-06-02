/**
 * Yacht snapshot sync script.
 *
 * Fetches the full eligible yacht list from Ankor and writes a self-contained
 * local snapshot to `src/data/yachts/`:
 *
 *   src/data/yachts/
 *     ├── index.json        — YachtCard[] (catalogue summaries with pricing)
 *     ├── manifest.json     — { generatedAt, count, durationMs, source }
 *     └── entities/
 *         └── <slug>.json   — raw VesselEntity per yacht (input to entityToYacht)
 *
 * The Astro request path reads from this directory. The script is the only
 * place that talks to Ankor for catalogue data.
 *
 * Run:    node --env-file=.env --import tsx scripts/sync-yachts.ts
 * Or:     npm run sync-yachts
 *
 * On any failure (auth, network, partial fleet), the script exits non-zero
 * BEFORE swapping in the new snapshot — the previous good snapshot is
 * preserved.
 */

import { mkdir, writeFile, rename, rm, readdir, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ankorConfig } from "../src/lib/ankor/config";
import { ankorGet } from "../src/lib/ankor/client";
import { ensureRegistered } from "../src/lib/ankor/registry";
import { summaryToCard, uniqueSlug, computeSeasonTags } from "../src/lib/ankor/mappers";
import type { DiscoveryResponse, VesselEntity, VesselSummary } from "../src/lib/ankor/types";
import type { YachtCard } from "../src/data/types/yacht";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const OUT_DIR = join(PROJECT_ROOT, "src", "data", "yachts");
const TMP_DIR = join(PROJECT_ROOT, "src", "data", "yachts.tmp");
const OLD_DIR = join(PROJECT_ROOT, "src", "data", "yachts.old");

// Aborts the write if the fleet shrinks below this threshold — protects the
// site from a partial Ankor response wiping out a healthy snapshot. Today's
// fleet is ~800 yachts; a drop below 600 (>25%) likely means a degraded API
// response. Bump up as the fleet grows.
const MIN_EXPECTED_YACHTS = 600;

// Concurrent entity fetches. ~10 keeps Ankor happy while still finishing
// the fleet in ~2 minutes. Tune if rate-limited.
const PARALLEL = 10;

// Retry transient entity errors (Ankor occasionally 500s). Keep this small —
// the goal is to absorb flakes, not to mask sustained outages.
const ENTITY_RETRIES = 2;
const RETRY_BACKOFF_MS = 1000;

interface FetchedYacht {
  hit: VesselSummary;
  slug: string;
  entity: VesselEntity;
}

/** Run `fn` over `items` with a max of `limit` in flight at once. */
async function pLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers: Promise<void>[] = [];
  const n = Math.min(limit, items.length);
  for (let w = 0; w < n; w++) {
    workers.push(
      (async () => {
        while (true) {
          const i = cursor++;
          if (i >= items.length) return;
          results[i] = await fn(items[i]!, i);
        }
      })(),
    );
  }
  await Promise.all(workers);
  return results;
}

function passesGlobalFilters(hit: VesselSummary): boolean {
  const len = typeof hit.length === "number" ? hit.length : Number(hit.length);
  return Number.isFinite(len) && len > ankorConfig.minLengthM;
}

async function main(): Promise<void> {
  const startedAt = Date.now();
  console.log("[sync] starting yacht sync");
  console.log(
    `[sync] config: minLength=${ankorConfig.minLengthM}m, ` +
      `priceMin=${Math.round(ankorConfig.minWeekPriceCents / 100)} (no currency lock)`,
  );

  // 1. Search.
  // No `currency` param: passing one filters out yachts whose pricing is
  // declared in a different currency, shrinking the hit count even though
  // we'd happily accept yachts priced in USD/AED/etc. (the snapshot stores
  // the original currency per yacht anyway).
  const params = new URLSearchParams({
    minLength: String(ankorConfig.minLengthM),
    priceMin: String(Math.round(ankorConfig.minWeekPriceCents / 100)),
  });
  const search = await ankorGet<DiscoveryResponse>(`/website/search?${params.toString()}`);
  const allHits = search.hits ?? [];
  console.log(`[sync] /website/search returned ${allHits.length} hits`);

  // 2. Apply length filter (matches existing yacht-service.ts behaviour).
  const eligible = allHits.filter(passesGlobalFilters);
  console.log(`[sync] ${eligible.length} hits pass length>${ankorConfig.minLengthM}m`);

  if (eligible.length < MIN_EXPECTED_YACHTS) {
    throw new Error(
      `[sync] aborting: only ${eligible.length} eligible yachts, ` +
        `expected at least ${MIN_EXPECTED_YACHTS}. Refusing to overwrite snapshot ` +
        `with potentially partial data.`,
    );
  }

  // 3. Allocate slugs (collision-safe via uniqueSlug).
  const used = new Set<string>();
  const withSlugs: Array<{ hit: VesselSummary; slug: string }> = eligible.map((hit) => ({
    hit,
    slug: uniqueSlug(hit.name ?? "yacht", hit.uri, used),
  }));

  // 4. Fetch entities (registration + entity GET) in parallel batches.
  console.log(`[sync] fetching ${withSlugs.length} entities (parallel=${PARALLEL})...`);
  let progress = 0;
  const failures: Array<{ uri: string; slug: string; error: string }> = [];

  const fetched: FetchedYacht[] = (
    await pLimit(withSlugs, PARALLEL, async ({ hit, slug }) => {
      let lastErr: unknown;
      for (let attempt = 0; attempt <= ENTITY_RETRIES; attempt++) {
        try {
          await ensureRegistered(hit.uri);
          const entity = await ankorGet<VesselEntity>(
            `/website/entity/${encodeURIComponent(hit.uri)}`,
          );
          progress++;
          if (progress % 50 === 0 || progress === withSlugs.length) {
            console.log(`[sync] entity ${progress}/${withSlugs.length}`);
          }
          return { hit, slug, entity } satisfies FetchedYacht;
        } catch (err) {
          lastErr = err;
          if (attempt < ENTITY_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS * (attempt + 1)));
          }
        }
      }
      failures.push({
        uri: hit.uri,
        slug,
        error: lastErr instanceof Error ? lastErr.message : String(lastErr),
      });
      return null as unknown as FetchedYacht;
    })
  ).filter((x): x is FetchedYacht => x != null);

  if (failures.length > 0) {
    console.warn(`[sync] ${failures.length} entity fetches failed:`);
    for (const f of failures.slice(0, 10)) {
      console.warn(`[sync]   ${f.slug} (${f.uri}): ${f.error}`);
    }
    if (failures.length > 10) {
      console.warn(`[sync]   ...and ${failures.length - 10} more`);
    }
  }

  if (fetched.length < MIN_EXPECTED_YACHTS) {
    throw new Error(
      `[sync] aborting: only ${fetched.length} entities fetched successfully, ` +
        `expected at least ${MIN_EXPECTED_YACHTS}. Refusing to overwrite snapshot.`,
    );
  }

  // 5. Build catalogue index — summary fields plus pricing/yachtType pulled
  //    from the entity (more authoritative than the summary). Mirrors the
  //    enrichment that happened on every request in yacht-service.enrichWithPricing.
  const index: YachtCard[] = fetched.map(({ hit, slug, entity }) => {
    const card = summaryToCard(hit, slug);
    const pricing = entity.pricing ?? {};
    return {
      ...card,
      dayPricingFrom: pricing.dayPricingFrom?.price ?? card.dayPricingFrom,
      weekPricingFrom: pricing.weekPricingFrom?.price ?? card.weekPricingFrom,
      currency:
        pricing.currency ?? pricing.weekPricingFrom?.currency ?? card.currency,
      yachtType: card.yachtType.length ? card.yachtType : (entity.yachtType ?? []),
      seasons: computeSeasonTags(pricing.pricingInfo),
    };
  });

  // 6. Write atomically: build the full snapshot in TMP_DIR, then swap.
  console.log(`[sync] writing snapshot to ${TMP_DIR}`);
  await rm(TMP_DIR, { recursive: true, force: true });
  await mkdir(join(TMP_DIR, "entities"), { recursive: true });

  await writeFile(join(TMP_DIR, "index.json"), JSON.stringify(index, null, 2));

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: index.length,
    durationMs: Date.now() - startedAt,
    source: "ankor",
    failedEntityFetches: failures.length,
  };
  await writeFile(join(TMP_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

  // Entity files: write in chunks to avoid spawning 1000 fs handles at once.
  await pLimit(fetched, 32, async ({ slug, entity }) => {
    await writeFile(
      join(TMP_DIR, "entities", `${slug}.json`),
      JSON.stringify(entity, null, 2),
    );
  });

  // Swap into OUT_DIR. We avoid renaming OUT_DIR itself because Windows
  // refuses to rename a directory with open handles (e.g. the Astro dev
  // server's file watcher), and CI works the same either way.
  //
  // Strategy: copy TMP_DIR over OUT_DIR (file-by-file overwrite via fs.cp),
  // then prune any entity files in OUT_DIR that aren't in the new snapshot
  // (so delisted yachts disappear). The window of inconsistency is per-file,
  // not directory-wide, and the sanity check above guarantees we'd never
  // arrive here with a partial snapshot.
  await mkdir(join(OUT_DIR, "entities"), { recursive: true });
  await cp(TMP_DIR, OUT_DIR, { recursive: true, force: true });

  const validSlugs = new Set(fetched.map((f) => f.slug));
  const existingEntities = await readdir(join(OUT_DIR, "entities"));
  let pruned = 0;
  for (const filename of existingEntities) {
    if (!filename.endsWith(".json")) continue;
    const slug = filename.slice(0, -5);
    if (!validSlugs.has(slug)) {
      await rm(join(OUT_DIR, "entities", filename), { force: true });
      pruned++;
    }
  }
  if (pruned > 0) {
    console.log(`[sync] pruned ${pruned} stale entity files (delisted yachts)`);
  }

  await rm(TMP_DIR, { recursive: true, force: true });
  await rm(OLD_DIR, { recursive: true, force: true });

  const elapsed = Date.now() - startedAt;
  console.log(
    `[sync] done: ${index.length} yachts, ${failures.length} failures, ${elapsed}ms`,
  );
}

main().catch((err) => {
  console.error("[sync] failed:", err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
