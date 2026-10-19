import { PARTNER_STORE_LOCALES } from '../../../features/stores/partner-store-locales';
import { writeInContentLocale } from '@/lib/i18n/locale-script';
import { toSlug } from '@/lib/utils/slug';
import type { LanguageCode } from '@/lib/language';
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
    slug: '',
    logoUrl: '',
    published: 'published',
    lat: null,
    lng: null,
    coordinatesSource: 'none',
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
        name: existing ? writeInContentLocale(existing.name, locale) : '',
        address: existing ? writeInContentLocale(existing.address, locale) : '',
      };
    }),
    slug: store.slug,
    logoUrl: store.logoUrl ?? '',
    published: store.published ? 'published' : 'draft',
    lat: store.lat,
    lng: store.lng,
    coordinatesSource: 'existing',
  };
}

export function parseFormPayload(formData: PartnerStoreFormData) {
  const payload: {
    regionId: string;
    areaId: string | null;
    translations: PartnerStoreFormData['translations'];
    slug: string;
    logoUrl: string | undefined;
    published: boolean;
    lat?: number;
    lng?: number;
  } = {
    regionId: formData.regionId,
    areaId: formData.areaId.trim() || null,
    translations: formData.translations.map((translation) => ({
      ...translation,
      logoAlt: translation.name.trim() || undefined,
    })),
    slug: formData.slug,
    logoUrl: formData.logoUrl.trim() || undefined,
    published: formData.published === 'published',
  };

  if (
    formData.coordinatesSource === 'map' &&
    formData.lat !== null &&
    formData.lng !== null
  ) {
    payload.lat = formData.lat;
    payload.lng = formData.lng;
  }

  return payload;
}

export function updateStoreFormTranslation(
  form: PartnerStoreFormData,
  locale: LanguageCode,
  patch: { name?: string; address?: string; slug?: string },
): PartnerStoreFormData {
  const edited = form.translations.find((row) => row.locale === locale);
  const previousName = edited?.name ?? '';
  const name = patch.name !== undefined ? writeInContentLocale(patch.name, locale) : undefined;
  const address = patch.address !== undefined ? writeInContentLocale(patch.address, locale) : undefined;
  const slugFollowsName = !form.slug.trim() || form.slug === toSlug(previousName);
  const slug =
    patch.slug !== undefined
      ? toSlug(patch.slug)
      : name !== undefined && slugFollowsName
        ? toSlug(name)
        : form.slug;

  return {
    ...form,
    slug,
    translations: form.translations.map((row) =>
      row.locale === locale
        ? {
            ...row,
            name: name ?? row.name,
            address: address ?? row.address,
          }
        : row,
    ),
  };
}
