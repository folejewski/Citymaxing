import { GoogleGenAI, Type } from "@google/genai";
import { config } from "@/lib/config";
import { Place, PlaceCategory } from "@/lib/places/types";
import {
  EngineResult,
  RecommendationEngine,
  RecommendationQuery,
  RecommendedPlace,
} from "@/lib/recommendations/types";

// Alias, not a pinned version — Google periodically retires specific model
// versions for new API keys, so pin-by-version broke here already. The
// "-latest" alias always resolves to Google's current recommended flash model.
const MODEL = "gemini-flash-latest";
const RESULT_COUNT = 5;

interface LlmSelection {
  placeId: string;
  reason: string;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    selections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          placeId: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["placeId", "reason"],
      },
    },
  },
  required: ["selections"],
};

function buildPrompt(query: RecommendationQuery, candidates: Place[]): string {
  const candidateJson = JSON.stringify(
    candidates.map((c) => ({
      id: c.id,
      name: c.name,
      categories: c.categories,
      rating: c.rating,
      priceLevel: c.priceLevel,
      distanceFromCenterKm: c.distanceFromCenterKm,
      openNow: c.openNow,
      description: c.description,
    }))
  );

  const budgetText = query.budget === "any" ? "any budget" : `price level ${query.budget} (0=free, 3=$$$)`;
  const interestsText = query.interests.length > 0 ? query.interests.join(", ") : "no specific interests";

  return [
    "You are a local activity recommendation assistant.",
    "You must choose only from the CANDIDATE PLACES list below — never invent a place or use a placeId that is not in the list.",
    "",
    `User is in ${query.location}, interested in: ${interestsText}. Budget preference: ${budgetText}.`,
    "",
    `CANDIDATE PLACES (JSON): ${candidateJson}`,
    "",
    `Select the best ${RESULT_COUNT} places for this user, ranked best-first. For each, give a one-sentence reason tied to their stated interests/budget.`,
  ].join("\n");
}

function generateMockLlmResponse(
  query: RecommendationQuery,
  candidates: Place[],
  errorMessage?: string
): EngineResult {
  const matching = candidates.filter(
    (p) =>
      query.interests.length === 0 ||
      p.categories.some((c) => query.interests.includes(c))
  );
  const pool = matching.length > 0 ? matching : candidates;

  const top = [...pool].sort((a, b) => b.rating - a.rating).slice(0, RESULT_COUNT);

  const recommendations: RecommendedPlace[] = top.map((place) => {
    const matchedCategory = place.categories.find((c) =>
      query.interests.includes(c)
    ) as PlaceCategory | undefined;
    const reason = matchedCategory
      ? `Mock response (no GEMINI_API_KEY set) — selected for its ${place.rating}/5 rating and match with your interest in ${matchedCategory}.`
      : `Mock response (no GEMINI_API_KEY set) — selected for its ${place.rating}/5 rating.`;
    return { place, reason };
  });

  return {
    engineId: "llm",
    engineLabel: "LLM-based",
    recommendations,
    isMock: true,
    ...(errorMessage ? { error: errorMessage } : {}),
  };
}

async function callGemini(
  query: RecommendationQuery,
  candidates: Place[]
): Promise<RecommendedPlace[]> {
  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildPrompt(query, candidates),
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty response");

  const parsed = JSON.parse(text) as { selections: LlmSelection[] };
  if (!Array.isArray(parsed.selections)) {
    throw new Error("Gemini response missing 'selections' array");
  }

  const candidateById = new Map(candidates.map((c) => [c.id, c]));
  const recommendations: RecommendedPlace[] = [];

  for (const selection of parsed.selections) {
    const place = candidateById.get(selection.placeId);
    if (!place) {
      // Hallucination guard: skip any placeId not in the candidate set.
      continue;
    }
    recommendations.push({ place, reason: selection.reason });
  }

  if (recommendations.length === 0) {
    throw new Error("Gemini response contained no valid placeIds from the candidate set");
  }

  return recommendations.slice(0, RESULT_COUNT);
}

export const llmEngine: RecommendationEngine = {
  id: "llm",
  label: "LLM-based",
  async recommend(query, candidates) {
    if (!config.geminiApiKey) {
      return generateMockLlmResponse(query, candidates);
    }

    try {
      const recommendations = await callGemini(query, candidates);
      return {
        engineId: "llm",
        engineLabel: "LLM-based",
        recommendations,
        isMock: false,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error calling Gemini";
      return generateMockLlmResponse(query, candidates, message);
    }
  },
};
