import { config } from "@/lib/config";
import { Place } from "@/lib/places/types";
import { MockPlacesProvider } from "@/lib/places/mockProvider";
import { GooglePlacesProvider } from "@/lib/places/googleProvider";

export interface PlacesProvider {
  /** Returns all candidate places for a given supported location/city. */
  getPlaces(city: string): Promise<Place[]>;
}

let cachedProvider: PlacesProvider | null = null;

export function getPlacesProvider(): PlacesProvider {
  if (cachedProvider) return cachedProvider;

  cachedProvider =
    config.placesProvider === "google"
      ? new GooglePlacesProvider()
      : new MockPlacesProvider();

  return cachedProvider;
}
