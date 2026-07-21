import { RecommendedPlace } from "@/lib/recommendations/types";

const PRICE_LABELS = ["Free", "$", "$$", "$$$"];

export function PlaceCard({ recommendation }: { recommendation: RecommendedPlace }) {
  const { place, reason, score } = recommendation;

  return (
    <li className="rounded-lg border border-black/10 dark:border-white/15 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{place.name}</h3>
        {score !== undefined && (
          <span className="shrink-0 text-xs font-mono rounded bg-black/5 dark:bg-white/10 px-2 py-1">
            {score}/100
          </span>
        )}
      </div>

      <p className="text-sm text-black/70 dark:text-white/70">{place.description}</p>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {place.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 capitalize"
          >
            {category}
          </span>
        ))}
        <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5">
          ★ {place.rating}
        </span>
        <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5">
          {PRICE_LABELS[place.priceLevel]}
        </span>
        <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5">
          {place.distanceFromCenterKm.toFixed(1)} km
        </span>
        <span
          className={`rounded-full px-2 py-0.5 ${
            place.openNow
              ? "bg-green-500/15 text-green-700 dark:text-green-400"
              : "bg-red-500/15 text-red-700 dark:text-red-400"
          }`}
        >
          {place.openNow ? "Open now" : "Closed"}
        </span>
      </div>

      <p className="text-sm italic text-black/60 dark:text-white/60">{reason}</p>
    </li>
  );
}
