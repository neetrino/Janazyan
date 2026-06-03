import { PARTNER_STORE_LOCALES } from '../../../features/stores/partner-store-locales';
import { MAP_DEFAULT_CENTER } from '../../../features/stores/constants';
import type { AdminPartnerStore, PartnerStoreFormData } from './types';

export function createEmptyFormData(): PartnerStoreFormData {
  return {
    translations: PARTNER_STORE_LOCALES.map((locale) => ({
      locale,
      name: '',
      address: '',
      logoAlt: '',
    })),
    logoUrl: '',
    lat: String(MAP_DEFAULT_CENTER.lat),
    lng: String(MAP_DEFAULT_CENTER.lng),
    position: '0',
    published: 'published',
  };
}

export function formDataFromStore(store: AdminPartnerStore): PartnerStoreFormData {
  const byLocale = new Map(store.translations.map((t) => [t.locale, t]));

  return {
    translations: PARTNER_STORE_LOCALES.map((locale) => {
      const existing = byLocale.get(locale);
      return {
        locale,
        name: existing?.name ?? '',
        address: existing?.address ?? '',
        logoAlt: existing?.logoAlt ?? '',
      };
    }),
    logoUrl: store.logoUrl ?? '',
    lat: String(store.lat),
    lng: String(store.lng),
    position: String(store.position),
    published: store.published ? 'published' : 'draft',
  };
}

export function parseFormPayload(formData: PartnerStoreFormData) {
  const lat = Number.parseFloat(formData.lat);
  const lng = Number.parseFloat(formData.lng);
  const position = Number.parseInt(formData.position, 10);

  return {
    translations: formData.translations,
    logoUrl: formData.logoUrl.trim() || undefined,
    lat,
    lng,
    position: Number.isFinite(position) ? position : 0,
    published: formData.published === 'published',
  };
}
