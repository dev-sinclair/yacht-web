export interface Location {
  slug: string;
  name: string;
  cruisingSpots: string[];
  tagline?: string;
  image?: string;
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
