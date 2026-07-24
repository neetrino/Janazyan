import type { PartnerStoreTranslationInput } from '../../../features/stores/partner-store-locales';

export type AdminPartnerStore = {
  id: string;
  slug: string;
  regionId: string;
  areaId: string | null;
  name: string;
  address: string;
  logoUrl: string | null;
  lat: number;
  lng: number;
  position: number;
  published: boolean;
  translations: Array<{
    locale: string;
    name: string;
    address: string;
    logoAlt: string;
  }>;
};

export type AdminPartnerStoreRegion = {
  id: string;
  slug: string;
  name: string;
  position: number;
  published: boolean;
  translations: Array<{ locale: string; name: string }>;
};

export type AdminPartnerStoreArea = {
  id: string;
  regionId: string;
  slug: string;
  name: string;
  position: number;
  published: boolean;
  translations: Array<{ locale: string; name: string }>;
};

/** How store map coordinates were set in the admin form. */
export type PartnerStoreCoordinatesSource = 'none' | 'existing' | 'map';

export type PartnerStoreFormData = {
  regionId: string;
  areaId: string;
  translations: PartnerStoreTranslationInput[];
  logoUrl: string;
  published: 'published' | 'draft';
  lat: number | null;
  lng: number | null;
  /** Only `'map'` is sent to the API so address geocode still runs when pin was not touched. */
  coordinatesSource: PartnerStoreCoordinatesSource;
};
