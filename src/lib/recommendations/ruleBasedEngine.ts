import { Place } from "@/lib/places/types";
import {
  RecommendationEngine,
  RecommendationQuery,
  RecommendedPlace,
  ScoreBreakdown,
} from "@/lib/recommendations/types";

const WEIGHTS = {
  categoryMatch: 0.35,
  rating: 0.25,
  priceMatch: 0.2,
  distance: 0.15,
  openNow: 0.05,
} as const; // sums to 1.0

const MAX_DISTANCE_KM = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface ScoredPlace {
  place: Place;
  score: number; // 0-100
  breakdown: ScoreBreakdown;
}

export function scorePlace(place: Place, query: RecommendationQuery): ScoredPlace {
  const ratingScore = place.rating / 5;

  const distanceScore = clamp(1 - place.distanceFromCenterKm / MAX_DISTANCE_KM, 0, 1);

  const priceScore =
    query.budget === "any"
      ? 1
      : Math.max(0, 1 - Math.abs(place.priceLevel - query.budget) * 0.5);

  const categoryScore =
    query.interests.length === 0
      ? 1
      : Math.min(
          1,
          place.categories.filter((c) => query.interests.includes(c)).length /
            query.interests.length
        );

  const openNowScore = place.openNow ? 1 : 0;

  const breakdown: ScoreBreakdown = {
    categoryScore,
    ratingScore,
    priceScore,
    distanceScore,
    openNowScore,
  };

  const total =
    WEIGHTS.categoryMatch * categoryScore +
    WEIGHTS.rating * ratingScore +
    WEIGHTS.priceMatch * priceScore +
    WEIGHTS.distance * distanceScore +
    WEIGHTS.openNow * openNowScore;

  return {
    place,
    score: Math.round(total * 1000) / 10, // 0-100 scale, 1 decimal
    breakdown,
  };
}

export function rankPlaces(
  places: Place[],
  query: RecommendationQuery,
  topN = 5
): ScoredPlace[] {
  return places
    .map((place) => scorePlace(place, query))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

function describeScore(scored: ScoredPlace): string {
  const { breakdown } = scored;
  const strengths: string[] = [];
  if (breakdown.categoryScore >= 0.99) strengths.push("matches your interests");
  if (breakdown.ratingScore >= 0.9) strengths.push(`highly rated (${scored.place.rating}/5)`);
  if (breakdown.priceScore >= 0.99) strengths.push("fits your budget");
  if (breakdown.distanceScore >= 0.8) strengths.push("close by");
  if (breakdown.openNowScore === 1) strengths.push("open now");

  if (strengths.length === 0) {
    return `Best available match for this location (score ${scored.score}/100).`;
  }
  return `Scored ${scored.score}/100 — ${strengths.join(", ")}.`;
}

export const ruleBasedEngine: RecommendationEngine = {
  id: "rule-based",
  label: "Rule-based",
  async recommend(query, candidates) {
    const ranked = rankPlaces(candidates, query, 5);
    const recommendations: RecommendedPlace[] = ranked.map((scored) => ({
      place: scored.place,
      reason: describeScore(scored),
      score: scored.score,
      breakdown: scored.breakdown,
    }));

    return {
      engineId: "rule-based",
      engineLabel: "Rule-based",
      recommendations,
    };
  },
};
