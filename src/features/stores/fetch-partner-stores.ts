import type { LanguageCode } from '../../lib/language';
import { loadTranslation } from '../../lib/i18n';
import type { PartnerStore, StoresTranslation } from './types';
import { PARTNER_STORE_COORDINATES } from './partner-store-coordinates';

type PartnerStoresApiResponse = {
  data: PartnerStore[];
};

/**
 * Loads partner stores from API; falls back to locale JSON when API is empty or unavailable.
 */
export async function fetchPartnerStores(locale: LanguageCode): Promise<PartnerStore[]> {
  try {
    const response = await fetch(`/api/v1/partner-stores?locale=${locale}`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const payload = (await response.json()) as PartnerStoresApiResponse;
      if (payload.data?.length > 0) {
        return payload.data;
      }
    }
  } catch {
    // fallback below
  }

  return buildPartnerStoresFromLocale(locale);
}

/** Legacy static fallback from translation files. */
export function buildPartnerStoresFromLocale(lang: LanguageCode): PartnerStore[] {
  const storesData = loadTranslation(lang, 'stores') as StoresTranslation & {
    partnerStores?: Array<{
      id: string;
      name: string;
      address: string;
      logo: string;
      logoAlt: string;
    }>;
  };

  const list = storesData.partnerStores ?? [];
  return list
    .map((store) => {
      const coordinates = PARTNER_STORE_COORDINATES[store.id as keyof typeof PARTNER_STORE_COORDINATES];
      if (!coordinates) {
        return null;
      }
      return {
        ...store,
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
    })
    .filter((store): store is PartnerStore => store !== null);
}
