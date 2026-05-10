export interface Location {
  slug: string;
  name: string;
  cruisingSpots: string[];
}

export interface Region {
  slug: string;
  name: string;
  ankorRegion: string;
  tagline: string;
  heroImage: string;
  heroCredit?: string;
  locations: Location[];
}
