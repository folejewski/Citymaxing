"use client";

import { useState } from "react";
import { SUPPORTED_LOCATIONS } from "@/lib/constants";
import { CATEGORY_OPTIONS, BUDGET_OPTIONS } from "@/lib/constants";
import { PlaceCategory } from "@/lib/places/types";

export interface FormValues {
  location: string;
  interests: PlaceCategory[];
  budget: string;
}

export function RecommendationForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
}) {
  const [location, setLocation] = useState<string>(SUPPORTED_LOCATIONS[0]);
  const [interests, setInterests] = useState<PlaceCategory[]>([]);
  const [budget, setBudget] = useState<string>("any");

  function toggleInterest(category: PlaceCategory) {
    setInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ location, interests, budget });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2"
        >
          {SUPPORTED_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Interests</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => toggleInterest(option.value)}
              aria-pressed={interests.includes(option.value)}
              className={`rounded-full px-3 py-1 text-sm border ${
                interests.includes(option.value)
                  ? "bg-foreground text-background border-foreground"
                  : "border-black/15 dark:border-white/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="budget" className="text-sm font-medium">
          Budget
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2"
        >
          {BUDGET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-foreground text-background px-4 py-2 font-medium disabled:opacity-50"
      >
        {isSubmitting ? "Finding places..." : "Get recommendations"}
      </button>
    </form>
  );
}
