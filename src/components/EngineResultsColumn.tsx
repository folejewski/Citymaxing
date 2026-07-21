import { EngineResult } from "@/lib/recommendations/types";
import { PlaceCard } from "@/components/PlaceCard";
import { MockModeBanner } from "@/components/MockModeBanner";

export function EngineResultsColumn({ result }: { result: EngineResult }) {
  return (
    <section className="flex-1 min-w-0 flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{result.engineLabel}</h2>

      {result.isMock && <MockModeBanner error={result.error} />}

      {!result.isMock && result.error && (
        <div className="text-xs rounded-md bg-red-500/15 text-red-700 dark:text-red-400 px-3 py-2">
          Engine error: {result.error}
        </div>
      )}

      {result.recommendations.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No recommendations.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {result.recommendations.map((recommendation) => (
            <PlaceCard key={recommendation.place.id} recommendation={recommendation} />
          ))}
        </ul>
      )}
    </section>
  );
}
