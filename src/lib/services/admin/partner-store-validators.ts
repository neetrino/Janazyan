import type { PartnerStoreTranslationInput } from '@/features/stores/partner-store-locales';

export function validatePartnerStoreTranslations(
  translations: PartnerStoreTranslationInput[],
): void {
  if (!translations.length) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'At least one translation is required',
    };
  }

  const enTranslation = translations.find((t) => t.locale === 'en');
  if (!enTranslation?.name.trim() || !enTranslation.address.trim()) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'English name and address are required',
    };
  }
}

export function validatePartnerStoreCoordinates(lat: number, lng: number): void {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Latitude must be between -90 and 90',
    };
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Longitude must be between -180 and 180',
    };
  }
}

export function getPartnerStoreEnglishAddress(
  translations: PartnerStoreTranslationInput[],
): string {
  return translations.find((translation) => translation.locale === 'en')?.address.trim() ?? '';
}
