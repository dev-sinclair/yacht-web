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
