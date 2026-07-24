import {
  buildSingleLineQueries,
  parseCoordinates,
  pickFirstValidCoordinates,
  type GeocodeCoordinates,
  type PartnerStoreGeocodeQuery,
} from './geocode-query';
import {
  GEOCODE_TIMEOUT_MS,
  GEOCODE_USER_AGENT,
  withNominatimRateLimit,
} from './geocode-nominatim-queue';

const ARCGIS_GEOCODE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const PHOTON_SEARCH_URL = 'https://photon.komoot.io/api';
const ARCGIS_MIN_SCORE = 80;
const ARCGIS_FALLBACK_MIN_SCORE = 70;

const STREET_LEVEL_ADDR_TYPES = new Set([
  'PointAddress',
  'StreetAddress',
  'StreetAddressExt',
  'StreetName',
  'Subaddress',
]);

const FALLBACK_ADDR_TYPES = new Set(['POI']);

type ArcGisCandidate = {
  score?: number;
  location?: { x?: number; y?: number };
  attributes?: { Addr_type?: string };
};

type ArcGisResponse = { candidates?: ArcGisCandidate[] };

type NominatimSearchResult = {
  lat: string;
  lon: string;
  class?: string;
  type?: string;
  addresstype?: string;
};

type PhotonResponse = {
  features?: Array<{
    geometry?: { coordinates?: [number, number] };
    properties?: { type?: string; osm_key?: string };
  }>;
};

async function fetchWithTimeout(input: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEOCODE_TIMEOUT_MS);
  try {
    return await fetch(input, {
      headers: {
        'User-Agent': GEOCODE_USER_AGENT,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function pickArcGisCandidates(
  candidates: ArcGisCandidate[],
  query: PartnerStoreGeocodeQuery,
  addrTypes: Set<string>,
  minScore: number,
): GeocodeCoordinates | null {
  return pickFirstValidCoordinates(
    candidates
      .filter((candidate) => (candidate.score ?? 0) >= minScore)
      .filter((candidate) => addrTypes.has(candidate.attributes?.Addr_type ?? ''))
      .map((candidate) => parseCoordinates(candidate.location?.y, candidate.location?.x)),
    query,
  );
}

export async function resolveWithArcGis(
  query: PartnerStoreGeocodeQuery,
): Promise<GeocodeCoordinates | null> {
  const city = query.regionName?.trim() || undefined;

  for (const singleLine of buildSingleLineQueries(query)) {
    const params = new URLSearchParams({
      f: 'json',
      singleLine,
      maxLocations: '8',
      outFields: 'Addr_type,Match_addr,City,Country',
      forStorage: 'false',
    });
    if (city) {
      params.set('city', city);
      params.set('countryCode', 'ARM');
    }

    const response = await fetchWithTimeout(`${ARCGIS_GEOCODE_URL}?${params}`);
    if (!response?.ok) {
      continue;
    }

    const payload = (await response.json()) as ArcGisResponse;
    const list = payload.candidates ?? [];
    const streetLevel = pickArcGisCandidates(list, query, STREET_LEVEL_ADDR_TYPES, ARCGIS_MIN_SCORE);
    if (streetLevel) {
      return streetLevel;
    }

    const fallback = pickArcGisCandidates(
      list,
      query,
      FALLBACK_ADDR_TYPES,
      ARCGIS_FALLBACK_MIN_SCORE,
    );
    if (fallback) {
      return fallback;
    }
  }

  return null;
}

function isStreetLevelNominatimResult(result: NominatimSearchResult): boolean {
  const kind = `${result.class ?? ''}:${result.type ?? ''}:${result.addresstype ?? ''}`.toLowerCase();
  return !(
    kind.includes('administrative') ||
    kind.includes('boundary') ||
    kind.includes('city') ||
    kind.includes('suburb') ||
    kind.includes('neighbourhood') ||
    kind.includes('county') ||
    kind.includes('state') ||
    kind.includes('town') ||
    kind.includes('village')
  );
}

export async function resolveWithNominatim(
  query: PartnerStoreGeocodeQuery,
): Promise<GeocodeCoordinates | null> {
  for (const q of buildSingleLineQueries(query)) {
    const params = new URLSearchParams({
      q,
      format: 'json',
      limit: '3',
      countrycodes: 'am',
      addressdetails: '1',
    });

    const results = await withNominatimRateLimit(async () => {
      const response = await fetchWithTimeout(`${NOMINATIM_SEARCH_URL}?${params}`);
      if (!response?.ok) {
        return [] as NominatimSearchResult[];
      }
      return (await response.json()) as NominatimSearchResult[];
    });

    for (const match of results) {
      if (!isStreetLevelNominatimResult(match)) {
        continue;
      }
      const coordinates = parseCoordinates(match.lat, match.lon);
      if (coordinates && pickFirstValidCoordinates([coordinates], query)) {
        return coordinates;
      }
    }
  }

  return null;
}

export async function resolveWithPhoton(
  query: PartnerStoreGeocodeQuery,
): Promise<GeocodeCoordinates | null> {
  for (const q of buildSingleLineQueries(query)) {
    const params = new URLSearchParams({ q, limit: '3', lang: 'en' });
    const response = await fetchWithTimeout(`${PHOTON_SEARCH_URL}?${params}`);
    if (!response?.ok) {
      continue;
    }

    const payload = (await response.json()) as PhotonResponse;
    for (const feature of payload.features ?? []) {
      const osmKey = feature.properties?.osm_key?.toLowerCase() ?? '';
      const type = feature.properties?.type?.toLowerCase() ?? '';
      if (osmKey === 'boundary' || osmKey === 'place') {
        if (type !== 'house' && type !== 'housenumber') {
          continue;
        }
      }
      const coordinates = feature.geometry?.coordinates;
      if (!coordinates) {
        continue;
      }
      const parsed = parseCoordinates(coordinates[1], coordinates[0]);
      if (parsed && pickFirstValidCoordinates([parsed], query)) {
        return parsed;
      }
    }
  }

  return null;
}
