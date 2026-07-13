import type { LanguageCode } from '../../lib/language';
import { loadTranslation } from '../../lib/i18n';
import { normalizePartnerStoreCoordinates } from './coordinates';
import type { PartnerStore, StoresTranslation } from './types';
import { PARTNER_STORE_COORDINATES } from './partner-store-coordinates';

type LocaleStoreEntry = {
  id: string;
  name: string;
  address: string;
  logo: string;
  logoAlt: string;
};

type StoresLocaleData = StoresTranslation & {
  partnerStores?: LocaleStoreEntry[];
};

function buildStoresFromLocale(
  lang: LanguageCode,
  coordinates: Record<string, { lat: number; lng: number }>,
): PartnerStore[] {
  const storesData = loadTranslation(lang, 'stores') as StoresLocaleData;
  const list = storesData.partnerStores ?? [];

  return list
    .map((store): PartnerStore | null => {
      const coords = coordinates[store.id];
      if (!coords) {
        return null;
      }
      return {
        ...store,
        lat: coords.lat,
        lng: coords.lng,
        regionId: 'legacy-static',
        regionName: 'Stores',
        regionPosition: 0,
        areaId: null as string | null,
        areaName: null as string | null,
        areaPosition: null as number | null,
        position: 0,
      };
    })
    .filter((store): store is PartnerStore => store !== null);
}

type PartnerStoresApiResponse = {
  data: PartnerStore[];
};

/**
 * Loads partner stores from API; falls back to locale JSON when API is empty or unavailable.
 */
export async function fetchPartnerStores(locale: LanguageCode): Promise<PartnerStore[]> {
  try {
    const response = await fetch(`/api/v1/partner-stores?locale=${locale}`);
    if (response.ok) {
      const payload = (await response.json()) as PartnerStoresApiResponse;
      if (payload.data?.length > 0) {
        return payload.data
          .map((store) => {
            const coordinates = normalizePartnerStoreCoordinates(store.lat, store.lng);
            if (!coordinates) {
              return null;
            }
            return { ...store, lat: coordinates.lat, lng: coordinates.lng };
          })
          .filter((store): store is PartnerStore => store !== null);
      }
    }
  } catch {
    // fallback below
  }

  return buildPartnerStoresFromLocale(locale);
}

/** Legacy static fallback from translation files. */
export function buildPartnerStoresFromLocale(lang: LanguageCode): PartnerStore[] {
  return buildStoresFromLocale(lang, PARTNER_STORE_COORDINATES);
}
