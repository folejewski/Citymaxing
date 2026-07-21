"use client";

import { useState } from "react";
import { RecommendationForm, FormValues } from "@/components/RecommendationForm";
import { EngineResultsColumn } from "@/components/EngineResultsColumn";
import { EngineResult } from "@/lib/recommendations/types";

interface ApiResponse {
  results: EngineResult[];
}

export function RecommendationApp() {
  const [results, setResults] = useState<EngineResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with status ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <RecommendationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {error && (
        <div className="text-sm rounded-md bg-red-500/15 text-red-700 dark:text-red-400 px-3 py-2 max-w-xl">
          {error}
        </div>
      )}

      {results && (
        <div className="flex flex-col md:flex-row gap-8">
          {results.map((result) => (
            <EngineResultsColumn key={result.engineId} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
