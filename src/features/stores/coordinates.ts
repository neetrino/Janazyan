/** Parses API/DB coordinate values (number or numeric string) into a finite number. */
export function parsePartnerStoreCoordinate(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

/** Returns normalized lat/lng when both values are valid map coordinates. */
export function normalizePartnerStoreCoordinates(
  lat: unknown,
  lng: unknown,
): { lat: number; lng: number } | null {
  const parsedLat = parsePartnerStoreCoordinate(lat);
  const parsedLng = parsePartnerStoreCoordinate(lng);

  if (parsedLat === null || parsedLng === null) {
    return null;
  }

  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    return null;
  }

  return { lat: parsedLat, lng: parsedLng };
}
