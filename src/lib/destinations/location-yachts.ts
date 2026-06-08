import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { YachtCard } from "../../data/types/yacht";
import type { Region, Location } from "../../data/types/destination";
import type { VesselEntity } from "../ankor/types";
import { summaryToCard } from "../ankor/mappers";
import { loadSnapshotIndex } from "../../data/snapshot";
import { isEligibleYacht } from "../../data/yacht-service";

interface YachtForLocation extends YachtCard {
  zones: string[];
}

function resolveEntitiesDir(): string {
  const candidates = [
    join(process.cwd(), "src", "data", "yachts", "entities"),
    resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "yachts", "entities"),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  return candidates[0]!;
}

const ENTITIES_DIR = resolveEntitiesDir();

let cachePromise: Promise<YachtForLocation[]> | null = null;

function extractZones(entity: VesselEntity): string[] {
  const set = new Set<string>();
  const info = entity.pricing?.pricingInfo;
  if (!info) return [];
  for (const item of info) {
    for (const zone of item.inclusionZones ?? []) {
      if (zone.label) set.add(zone.label);
    }
  }
  return [...set];
}

async function loadEnrichedYachts(): Promise<YachtForLocation[]> {
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    // Apply the global eligibility gate up front so every region/location
    // matcher (and its consumers) sees the same yacht universe as the catalog.
    const cards = (await loadSnapshotIndex()).filter(isEligibleYacht);
    const cardBySlug = new Map(cards.map((c) => [c.slug, c]));

    let entityFiles: string[];
    try {
      entityFiles = (await readdir(ENTITIES_DIR)).filter((f) => f.endsWith(".json"));
    } catch {
      return [];
    }

    const enriched = await Promise.all(
      entityFiles.map(async (file) => {
        const slug = file.replace(/\.json$/, "");
        const card = cardBySlug.get(slug);
        if (!card) return null;
        try {
          const raw = await readFile(join(ENTITIES_DIR, file), "utf8");
          const entity = JSON.parse(raw) as VesselEntity;
          const zones = extractZones(entity);
          if (zones.length === 0) return null;
          return { ...card, zones } as YachtForLocation;
        } catch {
          return null;
        }
      }),
    );

    return enriched.filter((y): y is YachtForLocation => y !== null);
  })();
  return cachePromise;
}

function normalizeTerm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalizeTerm(s).split(" ").filter(Boolean);
}

// Generic geographic modifier tokens. These appear in many place names (e.g.
// "Papua **New** Guinea" and "**New** England") and create false positives
// when used as standalone match keys. Phrase-level matching still uses them —
// "new england" as a whole phrase will still match curated cruising spots —
// only the *single-token* fallback excludes them. Without this stop-list a
// yacht cruising Papua New Guinea would match the North America region via
// the "new" token shared with "New England".
const STOP_TOKENS = new Set([
  "new", "old",
  "north", "south", "east", "west", "central", "far",
  "northern", "southern", "eastern", "western",
  "great", "greater", "lesser", "upper", "lower",
  "coast", "coastal", "bay", "gulf", "sea", "ocean", "lake", "river",
  "island", "islands", "isles", "isle",
  "cape", "point",
]);

function isMeaningfulToken(t: string): boolean {
  return t.length >= 3 && !STOP_TOKENS.has(t);
}

export interface LocationMatch {
  yachts: YachtCard[];
  totalMatches: number;
}

/**
 * Return matching yachts for a whole region, as YachtCards. Wraps
 * `getYachtSlugsForRegion` so the matching logic isn't duplicated.
 */
export async function getYachtsForRegion(
  region: Region,
  limit = 6,
): Promise<LocationMatch> {
  const slugs = await getYachtSlugsForRegion(region);
  const all = await loadEnrichedYachts();
  const matches = all.filter((y) => slugs.has(y.slug));
  const publicCards: YachtCard[] = matches.map(({ zones: _zones, ...rest }) => rest);
  return {
    yachts: publicCards.slice(0, limit),
    totalMatches: publicCards.length,
  };
}

/**
 * Return the set of yacht slugs that match any location within a region.
 * Used by `/api/yachts.json?region=<slug>` to filter the catalogue server-side.
 */
export async function getYachtSlugsForRegion(region: Region): Promise<Set<string>> {
  const phraseTerms: string[] = [normalizeTerm(region.name)];
  for (const location of region.locations) {
    phraseTerms.push(normalizeTerm(location.name));
    for (const spot of location.cruisingSpots) {
      phraseTerms.push(normalizeTerm(spot));
    }
  }
  return matchSlugsForPhrases(phraseTerms);
}

/**
 * Return the set of yacht slugs that match a single location within a region.
 * Used by `/api/yachts.json?region=<slug>&location=<slug>` to drill down
 * below the region filter. Matching uses only the location's own name and
 * cruisingSpots — sibling locations and the region name are excluded so the
 * result is a strict subset of `getYachtSlugsForRegion`.
 */
export async function getYachtSlugsForLocation(location: Location): Promise<Set<string>> {
  const phraseTerms: string[] = [normalizeTerm(location.name)];
  for (const spot of location.cruisingSpots) {
    phraseTerms.push(normalizeTerm(spot));
  }
  return matchSlugsForPhrases(phraseTerms);
}

async function matchSlugsForPhrases(phraseTerms: string[]): Promise<Set<string>> {
  const all = await loadEnrichedYachts();
  const cleanedPhrases = phraseTerms.filter(Boolean);
  const tokenTerms = new Set(cleanedPhrases.flatMap((t) => tokenize(t)));
  const meaningfulTokens = [...tokenTerms].filter(isMeaningfulToken);

  const slugs = new Set<string>();
  for (const y of all) {
    const zonesNorm = y.zones.map(normalizeTerm);
    const matches = zonesNorm.some((zone) => {
      for (const term of cleanedPhrases) {
        if (zone.includes(term) || term.includes(zone)) return true;
      }
      const zoneTokens = new Set(tokenize(zone));
      for (const t of meaningfulTokens) {
        if (zoneTokens.has(t)) return true;
      }
      return false;
    });
    if (matches) slugs.add(y.slug);
  }
  return slugs;
}

/** Find a Location by slug under a Region. Returns undefined if not present. */
export function locationBySlug(region: Region, slug: string): Location | undefined {
  return region.locations.find((l) => l.slug === slug);
}

// Re-export summaryToCard so callers don't need to dig into ankor/mappers.
export { summaryToCard };
