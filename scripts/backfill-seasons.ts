/**
 * One-shot snapshot backfill: adds `seasons: string[]` to every yacht in
 * `src/data/yachts/index.json` by reading season tags out of the local
 * entity files (`src/data/yachts/entities/<slug>.json`). No Ankor calls.
 *
 * Safe to re-run — it's idempotent: each card's seasons field is
 * recomputed from the entity file every time.
 *
 * Run:    node --import tsx scripts/backfill-seasons.ts
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { computeSeasonTags } from "../src/lib/ankor/mappers";
import type { YachtCard } from "../src/data/types/yacht";
import type { VesselEntity } from "../src/lib/ankor/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = join(__dirname, "..", "src", "data", "yachts");
const INDEX_FILE = join(SNAPSHOT_DIR, "index.json");
const ENTITIES_DIR = join(SNAPSHOT_DIR, "entities");

async function main(): Promise<void> {
  const startedAt = Date.now();
  console.log(`[backfill] reading ${INDEX_FILE}`);
  const raw = await readFile(INDEX_FILE, "utf8");
  const index = JSON.parse(raw) as YachtCard[];
  console.log(`[backfill] ${index.length} cards in index`);

  const distribution = new Map<string, number>();
  let withTags = 0;
  let missingEntity = 0;
  let withNoPricing = 0;

  // Process sequentially — file reads are local and fast, no need to fan out.
  for (const card of index) {
    let entity: VesselEntity | null = null;
    try {
      const path = join(ENTITIES_DIR, `${card.slug}.json`);
      const buf = await readFile(path, "utf8");
      entity = JSON.parse(buf) as VesselEntity;
    } catch {
      missingEntity++;
    }
    const seasons = computeSeasonTags(entity?.pricing?.pricingInfo);
    card.seasons = seasons;
    if (seasons.length === 0) {
      withNoPricing++;
    } else {
      withTags++;
      for (const s of seasons) distribution.set(s, (distribution.get(s) ?? 0) + 1);
    }
  }

  await writeFile(INDEX_FILE, JSON.stringify(index, null, 2));

  const elapsed = Date.now() - startedAt;
  console.log(`[backfill] wrote ${INDEX_FILE}`);
  console.log(
    `[backfill]   tagged: ${withTags}  ·  no pricing dates: ${withNoPricing}  ·  missing entity file: ${missingEntity}`,
  );
  const sortedTags = [...distribution.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  console.log("[backfill]   season distribution:");
  for (const [tag, count] of sortedTags) {
    console.log(`[backfill]     ${tag.padEnd(14)} ${count}`);
  }
  console.log(`[backfill] done in ${elapsed}ms`);
}

main().catch((err) => {
  console.error("[backfill] failed:", err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
