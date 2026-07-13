import { db } from '@white-shop/db';
import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import type { PartnerStore } from '@/features/stores/types';
import { normalizePartnerStoreCoordinates } from '@/features/stores/coordinates';

const FALLBACK_LOCALE = 'en';

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
    logo: row.logoUrl || '/stores/logos/sas.svg',
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

/**
 * Published partner stores for the public /stores page.
 */
export async function getPublishedPartnerStores(locale: string): Promise<PartnerStore[]> {
  if (!isDatabaseConnectionUrlConfigured()) {
    return [];
  }

  const stores = await db.partnerStore.findMany({
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
