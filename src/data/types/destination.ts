export interface LocationSection {
  heading: string;
  body: string | string[];
}

export interface Location {
  slug: string;
  name: string;
  cruisingSpots: string[];
  tagline?: string;
  image?: string;
  description?: string[];
  sections?: LocationSection[];
  footer?: string;
  whyCharter?: string[];
}

export interface SeasonConditions {
  charterSeason?: string;
  peakPeriod?: string;
  shoulderSeason?: string;
  hurricaneSeason?: string;
  waterTemperature?: string;
  charterBases?: string;
}

export interface Region {
  slug: string;
  name: string;
  ankorRegion: string;
  tagline: string;
  heroImage: string;
  heroCredit?: string;
  locations: Location[];
  intro?: string[];
  idealFor?: string[];
  seasonConditions?: SeasonConditions;
}
