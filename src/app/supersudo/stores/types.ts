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

export type PartnerStoreFormData = {
  regionId: string;
  areaId: string;
  translations: PartnerStoreTranslationInput[];
  logoUrl: string;
  published: 'published' | 'draft';
};
