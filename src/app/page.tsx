import { RecommendationApp } from "@/components/RecommendationApp";

export default function Home() {
  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Citymaxing</h1>
        <p className="text-black/60 dark:text-white/60">
          Never run out of things to do in your own city — compare a rule-based
          recommendation engine against an LLM-based one, side by side.
        </p>
      </div>

      <RecommendationApp />
    </main>
  );
}
