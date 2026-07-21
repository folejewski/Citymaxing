import { PlacesProvider } from "@/lib/places/provider";
import { Place } from "@/lib/places/types";

export class NotImplementedError extends Error {}

/**
 * Not implemented yet — requires a Google Places API key (config.googlePlacesApiKey).
 * Wire this up once a key is available; keep the same PlacesProvider shape so the
 * rest of the app doesn't need to change.
 */
export class GooglePlacesProvider implements PlacesProvider {
  async getPlaces(): Promise<Place[]> {
    throw new NotImplementedError(
      "GooglePlacesProvider is not implemented yet. Set PLACES_PROVIDER=mock (the default) until this is built."
    );
  }
}
