import {
  GEOCODE_TIMEOUT_MS,
  GEOCODE_USER_AGENT,
  withNominatimRateLimit,
} from './geocode-nominatim-queue';

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

export type ReverseGeocodeAddress = {
  city?: string;
  town?: string;
  municipality?: string;
  county?: string;
  state?: string;
  suburb?: string;
  city_district?: string;
  borough?: string;
  district?: string;
  neighbourhood?: string;
  quarter?: string;
  road?: string;
  house_number?: string;
  country_code?: string;
};

type NominatimReverseResponse = {
  display_name?: string;
  address?: ReverseGeocodeAddress;
};

export type PartnerStorePlaceCandidates = {
  regionCandidates: string[];
  /** Lower-priority region names (marz / province) used only if city/town did not match. */
  regionFallbackCandidates: string[];
  areaCandidates: string[];
  displayName: string | null;
  /** Street-level address per admin locale (from reverse geocode). */
  addresses: {
    en: string | null;
    hy: string | null;
    ru: string | null;
  };
};

function stripAdminSuffix(value: string): string {
  return value
    .replace(/\b(province|marz|region|district|municipality|oblast)\b/gi, ' ')
    .replace(/\b(մարզ|շրջան|քաղաք|համայնք)\b/giu, ' ')
    .replace(/\b(область|район|город|муниципалитет)\b/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pushUnique(target: string[], value: string | undefined): void {
  const trimmed = value?.trim();
  if (!trimmed) {
    return;
  }
  if (!target.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
    target.push(trimmed);
  }
  const stripped = stripAdminSuffix(trimmed);
  if (
    stripped &&
    stripped.toLowerCase() !== trimmed.toLowerCase() &&
    !target.some((item) => item.toLowerCase() === stripped.toLowerCase())
  ) {
    target.push(stripped);
  }
}

/**
 * Builds a short street address from Nominatim address parts.
 */
export function formatPartnerStoreStreetAddress(
  address: ReverseGeocodeAddress | undefined,
): string | null {
  if (!address) {
    return null;
  }

  const street = [address.house_number, address.road]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ');

  if (street) {
    return street;
  }

  const fallback = address.neighbourhood?.trim() || address.suburb?.trim();
  return fallback || null;
}

/**
 * Builds region/area name candidates from a Nominatim reverse address payload.
 */
export function extractPlaceCandidatesFromAddress(
  address: ReverseGeocodeAddress | undefined,
  displayName?: string | null,
): Omit<PartnerStorePlaceCandidates, 'addresses'> {
  const regionCandidates: string[] = [];
  const regionFallbackCandidates: string[] = [];
  const areaCandidates: string[] = [];

  pushUnique(regionCandidates, address?.city);
  pushUnique(regionCandidates, address?.town);
  pushUnique(regionCandidates, address?.municipality);
  pushUnique(regionFallbackCandidates, address?.county);
  pushUnique(regionFallbackCandidates, address?.state);

  pushUnique(areaCandidates, address?.suburb);
  pushUnique(areaCandidates, address?.city_district);
  pushUnique(areaCandidates, address?.borough);
  pushUnique(areaCandidates, address?.district);
  pushUnique(areaCandidates, address?.neighbourhood);
  pushUnique(areaCandidates, address?.quarter);

  // Outside Yerevan, the town often sits under a marz region as an "area".
  if (areaCandidates.length === 0) {
    pushUnique(areaCandidates, address?.town);
    pushUnique(areaCandidates, address?.municipality);
  }

  return {
    regionCandidates,
    regionFallbackCandidates,
    areaCandidates,
    displayName: displayName?.trim() || null,
  };
}

async function fetchNominatimReverse(
  lat: number,
  lng: number,
  language: string,
): Promise<NominatimReverseResponse | null> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
    addressdetails: '1',
    zoom: '18',
    'accept-language': language,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEOCODE_TIMEOUT_MS);
  try {
    const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
      headers: {
        'User-Agent': GEOCODE_USER_AGENT,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as NominatimReverseResponse;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const EMPTY_ADDRESSES = {
  en: null,
  hy: null,
  ru: null,
} as const;

/**
 * Reverse-geocodes coordinates to region/area candidates and localized street addresses.
 */
export async function reverseGeocodePartnerStorePlace(
  lat: number,
  lng: number,
): Promise<PartnerStorePlaceCandidates> {
  const enPayload = await withNominatimRateLimit(() =>
    fetchNominatimReverse(lat, lng, 'en'),
  );

  if (!enPayload?.address || enPayload.address.country_code?.toLowerCase() !== 'am') {
    return {
      regionCandidates: [],
      regionFallbackCandidates: [],
      areaCandidates: [],
      displayName: enPayload?.display_name?.trim() || null,
      addresses: { ...EMPTY_ADDRESSES },
    };
  }

  const place = extractPlaceCandidatesFromAddress(enPayload.address, enPayload.display_name);
  const enAddress = formatPartnerStoreStreetAddress(enPayload.address);

  const hyPayload = await withNominatimRateLimit(() =>
    fetchNominatimReverse(lat, lng, 'hy'),
  );
  const ruPayload = await withNominatimRateLimit(() =>
    fetchNominatimReverse(lat, lng, 'ru'),
  );

  const hyAddress = formatPartnerStoreStreetAddress(hyPayload?.address) ?? enAddress;
  const ruAddress = formatPartnerStoreStreetAddress(ruPayload?.address) ?? enAddress;

  return {
    ...place,
    addresses: {
      en: enAddress,
      hy: hyAddress,
      ru: ruAddress,
    },
  };
}
