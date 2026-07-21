export type PlaceCategory =
  | "food"
  | "outdoors"
  | "culture"
  | "nightlife"
  | "shopping"
  | "wellness";

export const PLACE_CATEGORIES: PlaceCategory[] = [
  "food",
  "outdoors",
  "culture",
  "nightlife",
  "shopping",
  "wellness",
];

/** 0 = free, 1 = $, 2 = $$, 3 = $$$ */
export type PriceLevel = 0 | 1 | 2 | 3;

export interface Place {
  id: string;
  name: string;
  categories: PlaceCategory[];
  description: string;
  rating: number; // 0-5
  priceLevel: PriceLevel;
  city: string;
  /** Proxy for distance from the user — actually distance from a fixed city-center
   * reference point, since there's no real geocoding yet. Both engines use this same
   * proxy so the comparison stays fair. */
  distanceFromCenterKm: number;
  openNow: boolean;
  tags?: string[];
}
