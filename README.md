# Citymaxing
Never run out of things to do in your own city. Dissertation project comparing LLM vs. rule-based recommendation engines.

## Prototype

A Next.js app where a user submits a location/interests/budget query and sees results
from two recommendation engines side by side:

- **Rule-based** — pure weighted scoring over category match, rating, price match,
  distance, and open-now (`src/lib/recommendations/ruleBasedEngine.ts`).
- **LLM-based** — Gemini API, grounded in the same candidate places the rule-based
  engine sees (`src/lib/recommendations/llmEngine.ts`).

Both external integrations (Google Places, Gemini) are optional and run in mock mode
by default — `npm run dev` works with zero configuration.

### Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. To enable the real Gemini engine, copy
`.env.local.example` to `.env.local` and set `GEMINI_API_KEY` (free tier key from
https://aistudio.google.com/apikey). Without a key, the LLM column runs in a clearly
labeled mock/fallback mode.

Place data is currently mocked (`src/lib/places/mockData/`) for Krakow and Warsaw.
Swapping in the real Google Places API later means filling in
`src/lib/places/googleProvider.ts` and setting `PLACES_PROVIDER=google`.
