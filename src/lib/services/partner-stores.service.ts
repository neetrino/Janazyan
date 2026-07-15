import { db } from '@white-shop/db';
import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import { PARTNER_STORE_DEFAULT_LOGO } from '@/features/stores/constants';
import type { PartnerStore } from '@/features/stores/types';
import { normalizePartnerStoreCoordinates } from '@/features/stores/coordinates';
import { resolvePartnerStoreCoordinatesFromAddress } from '@/lib/partner-stores/geocode-partner-store-address';
import { logger } from '@/lib/utils/logger';

const FALLBACK_LOCALE = 'en';
const DUPLICATE_COORDINATE_PRECISION = 5;
const DUPLICATE_COORDINATE_CLUSTER_MIN = 2;
const COORDINATE_MOVE_EPSILON = 0.00015;

type StoreRow = {
  id: string;
  slug: string;
  regionId: string;
  areaId: string | null;
  position: number;
  logoUrl: string | null;
  lat: number;
  lng: number;
  translations: Array<{
    locale: string;
    name: string;
    address: string;
    logoAlt: string | null;
  }>;
  region: {
    position: number;
    translations: Array<{ locale: string; name: string }>;
  };
  area: {
    position: number;
    translations: Array<{ locale: string; name: string }>;
  } | null;
};

function pickLocalizedName(
  translations: Array<{ locale: string; name: string }>,
  locale: string,
): string {
  return (
    translations.find((t) => t.locale === locale)?.name ??
    translations.find((t) => t.locale === FALLBACK_LOCALE)?.name ??
    translations[0]?.name ??
    ''
  );
}

function pickGeocodeAddress(row: StoreRow, locale: string): string | null {
  return (
    row.translations.find((translation) => translation.locale === FALLBACK_LOCALE)?.address ??
    row.translations.find((translation) => translation.locale === locale)?.address ??
    row.translations[0]?.address ??
    null
  );
}

function pickGeocodePlaceName(
  translations: Array<{ locale: string; name: string }>,
): string | null {
  return (
    translations.find((translation) => translation.locale === FALLBACK_LOCALE)?.name ??
    translations[0]?.name ??
    null
  );
}

function mapStoreRow(row: StoreRow, locale: string): PartnerStore | null {
  const translations = row.translations;
  const match =
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === FALLBACK_LOCALE) ??
    translations[0];

  if (!match) {
    return null;
  }

  const coordinates = normalizePartnerStoreCoordinates(row.lat, row.lng);
  if (!coordinates) {
    return null;
  }

  return {
    id: row.id,
    name: match.name,
    address: match.address,
    logo: PARTNER_STORE_DEFAULT_LOGO,
    logoAlt: match.logoAlt ?? match.name,
    lat: coordinates.lat,
    lng: coordinates.lng,
    regionId: row.regionId,
    regionName: pickLocalizedName(row.region.translations, locale),
    regionPosition: row.region.position,
    areaId: row.areaId,
    areaName: row.area ? pickLocalizedName(row.area.translations, locale) : null,
    areaPosition: row.area?.position ?? null,
    position: row.position,
  };
}

function buildCoordinateKey(lat: number, lng: number): string {
  return `${lat.toFixed(DUPLICATE_COORDINATE_PRECISION)},${lng.toFixed(DUPLICATE_COORDINATE_PRECISION)}`;
}

function coordinatesMoved(
  previous: { lat: number; lng: number },
  next: { lat: number; lng: number },
): boolean {
  return (
    Math.abs(previous.lat - next.lat) > COORDINATE_MOVE_EPSILON ||
    Math.abs(previous.lng - next.lng) > COORDINATE_MOVE_EPSILON
  );
}

async function loadPublishedStoreRows(): Promise<StoreRow[]> {
  return db.partnerStore.findMany({
    where: {
      deletedAt: null,
      published: true,
      region: { deletedAt: null, published: true },
      OR: [{ areaId: null }, { area: { deletedAt: null, published: true } }],
    },
    include: {
      translations: true,
      region: { include: { translations: true } },
      area: { include: { translations: true } },
    },
    orderBy: [
      { region: { position: 'asc' } },
      { position: 'asc' },
      { createdAt: 'asc' },
    ],
  });
}

/**
 * Re-geocodes partner stores that share identical map coordinates (area centroids).
 * Persists street-level results so /stores markers stop stacking on district centers.
 */
export async function healClusteredPartnerStoreCoordinates(): Promise<{
  checked: number;
  updated: number;
  failed: number;
}> {
  if (!isDatabaseConnectionUrlConfigured()) {
    return { checked: 0, updated: 0, failed: 0 };
  }

  const stores = await loadPublishedStoreRows();
  const coordinateCounts = new Map<string, number>();

  for (const row of stores) {
    const coordinates = normalizePartnerStoreCoordinates(row.lat, row.lng);
    if (!coordinates) {
      continue;
    }
    const key = buildCoordinateKey(coordinates.lat, coordinates.lng);
    coordinateCounts.set(key, (coordinateCounts.get(key) ?? 0) + 1);
  }

  const clustered = stores.filter((row) => {
    const coordinates = normalizePartnerStoreCoordinates(row.lat, row.lng);
    if (!coordinates) {
      return false;
    }
    const key = buildCoordinateKey(coordinates.lat, coordinates.lng);
    return (coordinateCounts.get(key) ?? 0) >= DUPLICATE_COORDINATE_CLUSTER_MIN;
  });

  let updated = 0;
  let failed = 0;

  for (const row of clustered) {
    const address = pickGeocodeAddress(row, FALLBACK_LOCALE);
    if (!address) {
      failed += 1;
      continue;
    }

    const previous = normalizePartnerStoreCoordinates(row.lat, row.lng);
    if (!previous) {
      failed += 1;
      continue;
    }

    const geocoded = await resolvePartnerStoreCoordinatesFromAddress({
      address,
      areaName: row.area ? pickGeocodePlaceName(row.area.translations) : null,
      regionName: pickGeocodePlaceName(row.region.translations),
      anchor: previous,
      maxDistanceKm: 25,
    });

    if (!geocoded || !coordinatesMoved(previous, geocoded)) {
      failed += 1;
      continue;
    }

    await db.partnerStore.update({
      where: { id: row.id },
      data: { lat: geocoded.lat, lng: geocoded.lng },
    });
    updated += 1;
  }

  logger.info('Partner store coordinate heal finished', {
    checked: clustered.length,
    updated,
    failed,
  });

  return { checked: clustered.length, updated, failed };
}

/**
 * Published partner stores for the public /stores page.
 */
export async function getPublishedPartnerStores(locale: string): Promise<PartnerStore[]> {
  if (!isDatabaseConnectionUrlConfigured()) {
    return [];
  }

  const stores = await loadPublishedStoreRows();

  return stores
    .map((row) => mapStoreRow(row, locale))
    .filter((store): store is PartnerStore => store !== null)
    .sort((a, b) => {
      if (a.regionPosition !== b.regionPosition) {
        return a.regionPosition - b.regionPosition;
      }
      const areaA = a.areaPosition ?? -1;
      const areaB = b.areaPosition ?? -1;
      if (areaA !== areaB) {
        return areaA - areaB;
      }
      return a.position - b.position;
    });
}

/** Resolve a published partner store by id for checkout pickup validation. */
export async function getPublishedPartnerStoreById(
  storeId: string,
  locale: string,
): Promise<PartnerStore | null> {
  if (!isDatabaseConnectionUrlConfigured()) {
    return null;
  }

  const row = await db.partnerStore.findFirst({
    where: {
      id: storeId,
      deletedAt: null,
      published: true,
      region: { deletedAt: null, published: true },
      OR: [{ areaId: null }, { area: { deletedAt: null, published: true } }],
    },
    include: {
      translations: true,
      region: { include: { translations: true } },
      area: { include: { translations: true } },
    },
  });

  if (!row) {
    return null;
  }

  return mapStoreRow(row, locale);
}
