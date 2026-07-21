import { PlacesProvider } from "@/lib/places/provider";
import { Place } from "@/lib/places/types";
import { krakowPlaces } from "@/lib/places/mockData/krakow";
import { warsawPlaces } from "@/lib/places/mockData/warsaw";

const ALL_MOCK_PLACES: Place[] = [...krakowPlaces, ...warsawPlaces];

export class MockPlacesProvider implements PlacesProvider {
  async getPlaces(city: string): Promise<Place[]> {
    return ALL_MOCK_PLACES.filter((place) => place.city === city);
  }
}
