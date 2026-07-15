export type GeocodeCoordinates = { lat: number; lng: number };

export type PartnerStoreGeocodeQuery = {
  address: string;
  areaName?: string | null;
  regionName?: string | null;
  /** Prefer results near this point (prevents matching same street name in another city). */
  anchor?: GeocodeCoordinates | null;
  maxDistanceKm?: number;
};

export const DEFAULT_MAX_DISTANCE_KM = 25;
export const EARTH_RADIUS_KM = 6371;

export function expandArmenianStreetAddress(address: string): string[] {
  const variants = [address];

  const replacements: Array<[RegExp, string]> = [
    [/\bՄաշտոց\b/u, 'Մեսրոպ Մաշտոցի պողոտա'],
    [/\bԲաղրամյան\b/u, 'Մարշալ Բաղրամյան պողոտա'],
    [/\bԿոմիտաս\b/u, 'Կոմիտասի պողոտա'],
    [/\bԱրշակունյաց\b/u, 'Արշակունյաց պողոտա'],
    [/\bՏիգրան Մեծ\b/u, 'Տիգրան Մեծի պողոտա'],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(address) && !address.includes(replacement)) {
      variants.push(address.replace(pattern, replacement));
    }
  }

  return variants;
}

export function buildSingleLineQueries(query: PartnerStoreGeocodeQuery): string[] {
  const { address, regionName } = query;
  const addressVariants = expandArmenianStreetAddress(address);
  const candidates: Array<string | null> = [];

  for (const variant of addressVariants) {
    candidates.push(regionName ? `${variant}, ${regionName}, Armenia` : null);
    candidates.push(`${variant}, Armenia`);
    candidates.push(variant);
  }

  const unique: string[] = [];
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (!unique.includes(candidate)) {
      unique.push(candidate);
    }
  }
  return unique;
}

export function distanceKm(a: GeocodeCoordinates, b: GeocodeCoordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(hav));
}

export function isWithinAnchor(
  coordinates: GeocodeCoordinates,
  query: PartnerStoreGeocodeQuery,
): boolean {
  if (!query.anchor) {
    return true;
  }
  const maxKm = query.maxDistanceKm ?? DEFAULT_MAX_DISTANCE_KM;
  return distanceKm(coordinates, query.anchor) <= maxKm;
}

export function parseCoordinates(lat: unknown, lng: unknown): GeocodeCoordinates | null {
  const parsedLat = typeof lat === 'number' ? lat : Number.parseFloat(String(lat));
  const parsedLng = typeof lng === 'number' ? lng : Number.parseFloat(String(lng));
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return null;
  }
  return { lat: parsedLat, lng: parsedLng };
}

export function pickFirstValidCoordinates(
  candidates: Array<GeocodeCoordinates | null>,
  query: PartnerStoreGeocodeQuery,
): GeocodeCoordinates | null {
  for (const coordinates of candidates) {
    if (coordinates && isWithinAnchor(coordinates, query)) {
      return coordinates;
    }
  }
  return null;
}

export function normalizeGeocodeQuery(
  input: string | PartnerStoreGeocodeQuery,
): PartnerStoreGeocodeQuery | null {
  if (typeof input === 'string') {
    const address = input.trim();
    return address ? { address } : null;
  }

  const address = input.address.trim();
  if (!address) {
    return null;
  }

  return {
    address,
    areaName: input.areaName?.trim() || null,
    regionName: input.regionName?.trim() || null,
    anchor: input.anchor ?? null,
    maxDistanceKm: input.maxDistanceKm ?? DEFAULT_MAX_DISTANCE_KM,
  };
}
