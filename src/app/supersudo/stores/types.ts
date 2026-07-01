import type { PartnerStoreTranslationInput } from '../../../features/stores/partner-store-locales';

export type AdminPartnerStore = {
  id: string;
  slug: string;
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

export type PartnerStoreFormData = {
  translations: PartnerStoreTranslationInput[];
  logoUrl: string;
  published: 'published' | 'draft';
};
