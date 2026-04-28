export type ImageVariant =
  | "blur"
  | "108w" | "320w" | "640w" | "960w" | "1280w" | "2560w"
  | "160x" | "320x" | "640x" | "720x" | "960x" | "1280x" | "2560x"
  | "x160" | "x320" | "x640" | "x720" | "x960" | "x1280" | "x2560";

export type YachtTypeEnum =
  | "Gulet" | "Sailing" | "Catamaran" | "Motor"
  | "Power Catamaran" | "Classic" | "Expedition" | "Sport fishing";

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires: number;
}

export interface VesselSummary {
  uri: string;
  hero?: string | null;
  name: string;
  length?: string | number | null;
  cabins?: string | number | null;
  sleeps?: string | number | null;
  builtYear?: string | number | null;
  make?: string | null;
  yachtType?: string[] | string | null;
  weekPricingFrom?: number | null;
  dayPricingFrom?: number | null;
  currency?: string | null;
}

export interface DiscoveryResponse {
  estHits?: number;
  hits: VesselSummary[];
}

export interface AnkorKVPair {
  label?: string;
  value?: string;
}

export interface AnkorAmenity {
  label?: string;
  quantity?: number;
}

export interface AnkorToy {
  label?: string;
  quantity?: number;
}

export interface AnkorCabinLayout {
  label?: string;
  quantity?: string | number;
}

export interface AnkorCrewMember {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string[];
}

export interface AnkorPricingLineItem {
  item?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
}

export interface AnkorPricingInfo {
  name?: string;
  effectiveDates?: { from: string; to: string }[];
  pricing?: {
    currency?: string;
    unit?: "WEEK" | "DAY" | "HOUR";
    charterFee?: number;
    total?: number;
    note?: string;
    lineItems?: AnkorPricingLineItem[];
  };
  inclusionZones?: { label?: string; category?: string[] }[];
  exclusionZones?: { label?: string; category?: string[] }[];
  petsAllowed?: boolean;
}

export interface AnkorPricing {
  currency?: string;
  dayPricingFrom?: { currency?: string; price?: number; unit?: string } | null;
  dayPricingTo?: { currency?: string; price?: number; unit?: string } | null;
  weekPricingFrom?: { currency?: string; price?: number; unit?: string } | null;
  weekPricingTo?: { currency?: string; price?: number; unit?: string } | null;
  pricingInfo?: AnkorPricingInfo[];
}

export interface AnkorBlueprint {
  name: string;
  hero?: string;
  images?: string[];
  length?: number;
  beam?: number;
  draft?: number;
  flag?: string;
  basePort?: { name?: string; country?: string } | null;
  cabins?: number;
  sleeps?: number;
  cruisingCapacity?: number;
  staticCapacity?: number;
  make?: string;
  model?: string;
  bathrooms?: number;
  builtYear?: number;
  decks?: number;
  architect?: string;
  interiorDesigner?: string;
  maxCrew?: number;
  hullType?: string;
  hullConstruction?: string;
  superStructure?: string[];
  tonnage?: number;
  engines?: string;
  fuelCapacity?: number;
  topSpeed?: number;
  cruiseSpeed?: number;
  refitYear?: number | null;
  cabinLayout?: AnkorCabinLayout[];
  amenities?: AnkorAmenity[];
  entertainment?: string[];
  toys?: AnkorToy[];
  tenders?: string[];
}

export interface VesselEntity {
  uri: string;
  yachtType?: string[];
  description?: string;
  blueprint: AnkorBlueprint;
  crew?: AnkorCrewMember[];
  pricing?: AnkorPricing;
}
