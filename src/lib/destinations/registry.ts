import regionsData from "../../data/destinations/regions.json";
import type { Region } from "../../data/types/destination";

const regions: Region[] = regionsData as Region[];

export function getAllRegions(): Region[] {
  return regions;
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
