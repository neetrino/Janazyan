import { PARTNER_STORE_LOCALES } from '../../../features/stores/partner-store-locales';
import type { AdminPartnerStore, PartnerStoreFormData } from './types';

export function createEmptyFormData(regionId = '', areaId = ''): PartnerStoreFormData {
  return {
    regionId,
    areaId,
    translations: PARTNER_STORE_LOCALES.map((locale) => ({
      locale,
      name: '',
      address: '',
    })),
    logoUrl: '',
    published: 'published',
  };
}

export function formDataFromStore(store: AdminPartnerStore): PartnerStoreFormData {
  const byLocale = new Map(store.translations.map((t) => [t.locale, t]));

  return {
    regionId: store.regionId,
    areaId: store.areaId ?? '',
    translations: PARTNER_STORE_LOCALES.map((locale) => {
      const existing = byLocale.get(locale);
      return {
        locale,
        name: existing?.name ?? '',
        address: existing?.address ?? '',
      };
    }),
    logoUrl: store.logoUrl ?? '',
    published: store.published ? 'published' : 'draft',
  };
}

export function parseFormPayload(formData: PartnerStoreFormData) {
  return {
    regionId: formData.regionId,
    areaId: formData.areaId.trim() || null,
    translations: formData.translations.map((translation) => ({
      ...translation,
      logoAlt: translation.name.trim() || undefined,
    })),
    logoUrl: formData.logoUrl.trim() || undefined,
    published: formData.published === 'published',
  };
}
