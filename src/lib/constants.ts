import { PlaceCategory } from "@/lib/places/types";

export const SUPPORTED_LOCATIONS = ["Krakow", "Warsaw"] as const;
export type SupportedLocation = (typeof SUPPORTED_LOCATIONS)[number];

export const CATEGORY_OPTIONS: { value: PlaceCategory; label: string }[] = [
  { value: "food", label: "Food & Drink" },
  { value: "outdoors", label: "Outdoors" },
  { value: "culture", label: "Culture" },
  { value: "nightlife", label: "Nightlife" },
  { value: "shopping", label: "Shopping" },
  { value: "wellness", label: "Wellness" },
];

export const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "any", label: "Any budget" },
  { value: "0", label: "Free" },
  { value: "1", label: "$" },
  { value: "2", label: "$$" },
  { value: "3", label: "$$$" },
];
