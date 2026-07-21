import { RecommendationEngine } from "@/lib/recommendations/types";
import { ruleBasedEngine } from "@/lib/recommendations/ruleBasedEngine";
import { llmEngine } from "@/lib/recommendations/llmEngine";

export function getEngines(): RecommendationEngine[] {
  return [ruleBasedEngine, llmEngine];
}
