import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCATIONS } from "@/lib/constants";
import { PlaceCategory, PLACE_CATEGORIES, PriceLevel } from "@/lib/places/types";
import { getPlacesProvider } from "@/lib/places/provider";
import { getEngines } from "@/lib/recommendations/engine";
import { EngineResult, RecommendationQuery } from "@/lib/recommendations/types";

interface RequestBody {
  location?: string;
  interests?: string[];
  budget?: string;
}

function parseQuery(body: RequestBody): RecommendationQuery | { error: string } {
  const location = body.location;
  if (!location || !SUPPORTED_LOCATIONS.includes(location as (typeof SUPPORTED_LOCATIONS)[number])) {
    return { error: `location must be one of: ${SUPPORTED_LOCATIONS.join(", ")}` };
  }

  const interestsInput = Array.isArray(body.interests) ? body.interests : [];
  const interests = interestsInput.filter((i): i is PlaceCategory =>
    (PLACE_CATEGORIES as string[]).includes(i)
  );

  const budgetInput = body.budget ?? "any";
  let budget: PriceLevel | "any" = "any";
  if (budgetInput !== "any") {
    const parsed = Number(budgetInput);
    if (![0, 1, 2, 3].includes(parsed)) {
      return { error: "budget must be 'any' or one of: 0, 1, 2, 3" };
    }
    budget = parsed as PriceLevel;
  }

  return { location, interests, budget };
}

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseQuery(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const query = parsed;

  const placesProvider = getPlacesProvider();
  const candidates = await placesProvider.getPlaces(query.location);

  const engines = getEngines();
  const settled = await Promise.allSettled(
    engines.map((engine) => engine.recommend(query, candidates))
  );

  const results: EngineResult[] = settled.map((outcome, index) => {
    const engine = engines[index];
    if (outcome.status === "fulfilled") return outcome.value;
    return {
      engineId: engine.id,
      engineLabel: engine.label,
      recommendations: [],
      error: outcome.reason instanceof Error ? outcome.reason.message : "Unknown engine error",
    };
  });

  return NextResponse.json({
    query,
    candidateCount: candidates.length,
    results,
  });
}
