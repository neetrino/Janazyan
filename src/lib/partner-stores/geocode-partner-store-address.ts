import {
  normalizeGeocodeQuery,
  type GeocodeCoordinates,
  type PartnerStoreGeocodeQuery,
} from './geocode-query';
import {
  resolveWithArcGis,
  resolveWithNominatim,
  resolveWithPhoton,
} from './geocode-providers';

export type { PartnerStoreGeocodeQuery } from './geocode-query';

/**
 * Resolves street-level map coordinates for a partner store address.
 * Prefers ArcGIS (reliable for Armenian streets), then Nominatim / Photon.
 * Returns null when lookup fails or only a city/district centroid is found.
 */
export async function resolvePartnerStoreCoordinatesFromAddress(
  input: string | PartnerStoreGeocodeQuery,
): Promise<GeocodeCoordinates | null> {
  const query = normalizeGeocodeQuery(input);
  if (!query) {
    return null;
  }

  const arcgisCoordinates = await resolveWithArcGis(query);
  if (arcgisCoordinates) {
    return arcgisCoordinates;
  }

  const nominatimCoordinates = await resolveWithNominatim(query);
  if (nominatimCoordinates) {
    return nominatimCoordinates;
  }

  return resolveWithPhoton(query);
}
