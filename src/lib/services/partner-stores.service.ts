import { db } from '@white-shop/db';
import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import type { PartnerStore } from '@/features/stores/types';
import { normalizePartnerStoreCoordinates } from '@/features/stores/coordinates';

const FALLBACK_LOCALE = 'en';

type StoreRow = {
  id: string;
  slug: string;
  logoUrl: string | null;
  lat: number;
  lng: number;
  translations: Array<{
    locale: string;
    name: string;
    address: string;
    logoAlt: string | null;
  }>;
};

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
    },
    include: {
      translations: true,
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  return stores
    .map((row) => mapStoreRow(row, locale))
    .filter((store): store is PartnerStore => store !== null);
}
