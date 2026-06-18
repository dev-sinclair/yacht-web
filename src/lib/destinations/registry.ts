import regionsData from "../../data/destinations/regions.json";
import type { Region } from "../../data/types/destination";

const regions: Region[] = regionsData as Region[];

// Canonical nav-facing ordering: lead with the Med + Caribbean, then the
// rest in their registry order. Shared by the navbar dropdown, the
// /destinations grid, the homepage carousel, and the /yachts Location filter.
const LEAD_SLUGS = ["west-mediterranean", "east-mediterranean", "caribbean-and-bahamas"];

export function getAllRegions(): Region[] {
  return regions;
}

export function getOrderedRegions(): Region[] {
  const lead = LEAD_SLUGS
    .map((slug) => regions.find((r) => r.slug === slug))
    .filter((r): r is Region => Boolean(r));
  const rest = regions.filter((r) => !LEAD_SLUGS.includes(r.slug));
  return [...lead, ...rest];
}

export function regionBySlug(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}

export function getAllRegionPaths(): Array<{
  params: { region: string };
  props: { region: Region };
}> {
  return regions.map((region) => ({
    params: { region: region.slug },
    props: { region },
  }));
}
