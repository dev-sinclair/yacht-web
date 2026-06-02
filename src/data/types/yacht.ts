export interface YachtImage {
  url: string;
  alt: string;
}

export interface CabinByType {
  type: string;       // "master" | "double" | "twin" | "convertible"
  count: number;
}

export interface PricingInfo {
  effectiveDateStart: string;
  effectiveDateEnd: string;
  currency: string;
  total: number;      // in cents
  period: "day" | "week";
}

export interface CrewMember {
  name: string;
  role: string;
  description: string;
  photo: string;
}

export interface Yacht {
  uri: string;
  slug: string;
  blueprint: {
    name: string;
    length: number;
    beam: number;
    draft: number;
    sleeps: number;
    cruisingCapacity: number;
    buildYear: number;
    builder: string;
    architect: string;
    refitYear: number | null;
  };
  yachtType: string[];
  cabins: {
    total: number;
    byType: CabinByType[];
    bathrooms: number;
  };
  pricingInfo: PricingInfo[];
  dayPricingFrom: number | null;
  weekPricingFrom: number | null;
  currency: string;
  images: YachtImage[];
  toys: string[];
  amenities: string[];
  entertainment: string[];
  tenders: string[];
  crew: CrewMember[];
  hull: {
    type: string;
    construction: string;
  };
  performance: {
    topSpeed: number;
    cruisingSpeed: number;
  };
  geographicZones: string[];
  description: string;
}

export interface YachtCard {
  uri: string;
  slug: string;
  name: string;
  hero: string;
  length: number;
  sleeps: number;
  cabins: number;
  builtYear: number | null;
  builder: string;
  yachtType: string[];
  dayPricingFrom: number | null;
  weekPricingFrom: number | null;
  currency: string;
  // Season-year tags derived from pricing.pricingInfo[].effectiveDates at
  // sync time. Format: "summer-YYYY" / "winter-YYYY". A yacht qualifies for
  // a tag if any of its priced date ranges intersects that season window
  // (Summer = May 1–Oct 31, Winter = Nov 1–Apr 30 of the following year).
  // Optional for backward compat with snapshots predating this field.
  seasons?: string[];
}

export interface YachtFacets {
  yachtTypes: string[];
  lengthRange: { min: number; max: number };
  guestRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

export interface YachtFilters {
  yachtType?: string;
  lengthMin?: number;
  lengthMax?: number;
  guestsMin?: number;
  priceMax?: number;
}
