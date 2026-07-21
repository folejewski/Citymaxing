import { Place, PlaceCategory, PriceLevel } from "@/lib/places/types";

export interface RecommendationQuery {
  location: string;
  interests: PlaceCategory[];
  budget: PriceLevel | "any";
}

export interface ScoreBreakdown {
  categoryScore: number;
  ratingScore: number;
  priceScore: number;
  distanceScore: number;
  openNowScore: number;
}

export interface RecommendedPlace {
  place: Place;
  reason: string;
  score?: number; // 0-100, rule-based engine only
  breakdown?: ScoreBreakdown; // rule-based engine only
}

export interface EngineResult {
  engineId: "rule-based" | "llm";
  engineLabel: string;
  recommendations: RecommendedPlace[];
  isMock?: boolean;
  error?: string;
}

export interface RecommendationEngine {
  id: "rule-based" | "llm";
  label: string;
  recommend(query: RecommendationQuery, candidates: Place[]): Promise<EngineResult>;
}
