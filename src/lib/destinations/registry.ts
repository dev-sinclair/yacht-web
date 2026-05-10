import regionsData from "../../data/destinations/regions.json";
import type { Region, Location } from "../../data/types/destination";

const regions: Region[] = regionsData as Region[];

export function getAllRegions(): Region[] {
  return regions;
}

export function regionBySlug(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}

export function locationBySlug(
  regionSlug: string,
  locationSlug: string,
): { region: Region; location: Location } | undefined {
  const region = regionBySlug(regionSlug);
  if (!region) return undefined;
  const location = region.locations.find((l) => l.slug === locationSlug);
  if (!location) return undefined;
  return { region, location };
}

export function getAllLocationPaths(): Array<{
  params: { region: string; location: string };
  props: { region: Region; location: Location };
}> {
  const paths: Array<{
    params: { region: string; location: string };
    props: { region: Region; location: Location };
  }> = [];
  for (const region of regions) {
    for (const location of region.locations) {
      paths.push({
        params: { region: region.slug, location: location.slug },
        props: { region, location },
      });
    }
  }
  return paths;
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
