export type PlacesProviderKind = "mock" | "google";

export const config = {
  placesProvider: (process.env.PLACES_PROVIDER ?? "mock") as PlacesProviderKind,
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY ?? "",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
};
