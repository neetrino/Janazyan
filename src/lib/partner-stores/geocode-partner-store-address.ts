import { MAP_DEFAULT_CENTER } from '@/features/stores/constants';

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const GEOCODE_USER_AGENT = 'JanazyanPartnerStores/1.0';
const GEOCODE_TIMEOUT_MS = 8000;

type NominatimSearchResult = {
  lat: string;
  lon: string;
};

/**
 * Resolves map coordinates from a store address via OpenStreetMap Nominatim.
 * Falls back to the default Yerevan center when lookup fails.
 */
export async function resolvePartnerStoreCoordinatesFromAddress(
  address: string,
): Promise<{ lat: number; lng: number }> {
  const trimmed = address.trim();
  if (!trimmed) {
    return { ...MAP_DEFAULT_CENTER };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEOCODE_TIMEOUT_MS);

  try {
    const query = new URLSearchParams({
      q: `${trimmed}, Armenia`,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${NOMINATIM_SEARCH_URL}?${query}`, {
      headers: {
        'User-Agent': GEOCODE_USER_AGENT,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ...MAP_DEFAULT_CENTER };
    }

    const results = (await response.json()) as NominatimSearchResult[];
    const match = results[0];
    if (!match) {
      return { ...MAP_DEFAULT_CENTER };
    }

    const lat = Number.parseFloat(match.lat);
    const lng = Number.parseFloat(match.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { ...MAP_DEFAULT_CENTER };
    }

    return { lat, lng };
  } catch {
    return { ...MAP_DEFAULT_CENTER };
  } finally {
    clearTimeout(timeout);
  }
}
