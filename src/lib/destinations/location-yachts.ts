import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { YachtCard } from "../../data/types/yacht";
import type { Location, Region } from "../../data/types/destination";
import type { VesselEntity } from "../ankor/types";
import { summaryToCard } from "../ankor/mappers";
import { loadSnapshotIndex } from "../../data/snapshot";

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
    const cards = await loadSnapshotIndex();
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

export interface LocationMatch {
  yachts: YachtCard[];
  totalMatches: number;
}

/**
 * Find yachts cruising a given location. Matches a yacht's geographicZones
 * (free-text labels from Ankor pricing data) against the location's name
 * plus its curated cruising spots, normalised to ASCII and case-insensitive.
 */
export async function getYachtsForLocation(
  location: Location,
  limit = 6,
): Promise<LocationMatch> {
  const all = await loadEnrichedYachts();

  const terms = [location.name, ...location.cruisingSpots].map(normalizeTerm);
  // Track multi-word terms separately so we can do whole-phrase matching
  // for things like "great barrier reef" before falling back to tokens.
  const phraseTerms = terms.filter(Boolean);
  const tokenTerms = new Set(phraseTerms.flatMap((t) => tokenize(t)));
  // Filter out tokens that are too generic to be useful as standalone hits
  // (e.g. "of", "the"). Anything 3+ chars is kept.
  const meaningfulTokens = [...tokenTerms].filter((t) => t.length >= 3);

  const matches = all.filter((y) => {
    const zonesNorm = y.zones.map(normalizeTerm);
    return zonesNorm.some((zone) => {
      // Phrase match (zone contains the term, or the term contains the zone)
      for (const term of phraseTerms) {
        if (zone.includes(term) || term.includes(zone)) return true;
      }
      // Token match — any meaningful token from our terms appearing in the zone
      const zoneTokens = new Set(tokenize(zone));
      for (const t of meaningfulTokens) {
        if (zoneTokens.has(t)) return true;
      }
      return false;
    });
  });

  // Strip zones from public output — the page only needs YachtCard fields.
  const publicCards: YachtCard[] = matches.map(({ zones: _zones, ...rest }) => rest);

  return {
    yachts: publicCards.slice(0, limit),
    totalMatches: publicCards.length,
  };
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
  const all = await loadEnrichedYachts();

  const phraseTerms: string[] = [normalizeTerm(region.name)];
  for (const location of region.locations) {
    phraseTerms.push(normalizeTerm(location.name));
    for (const spot of location.cruisingSpots) {
      phraseTerms.push(normalizeTerm(spot));
    }
  }
  const cleanedPhrases = phraseTerms.filter(Boolean);
  const tokenTerms = new Set(cleanedPhrases.flatMap((t) => tokenize(t)));
  const meaningfulTokens = [...tokenTerms].filter((t) => t.length >= 3);

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

// Re-export summaryToCard so callers don't need to dig into ankor/mappers.
export { summaryToCard };
