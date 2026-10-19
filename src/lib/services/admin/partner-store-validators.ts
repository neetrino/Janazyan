import { pickLocalizedText } from '@/lib/i18n/localized-text';
import { writeInContentLocale } from '@/lib/i18n/locale-script';
import type { PartnerStoreTranslationInput } from '@/features/stores/partner-store-locales';

export function filledPartnerStoreTranslations(
  translations: PartnerStoreTranslationInput[],
): PartnerStoreTranslationInput[] {
  return translations
    .filter((row) => row.name.trim() && row.address.trim())
    .map((row) => ({
      ...row,
      name: writeInContentLocale(row.name, row.locale).trim(),
      address: writeInContentLocale(row.address, row.locale).trim(),
    }));
}

export function validatePartnerStoreTranslations(
  translations: PartnerStoreTranslationInput[],
): void {
  if (filledPartnerStoreTranslations(translations).length === 0) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Enter a name and address in at least one language',
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

export function getPartnerStoreGeocodeAddress(
  translations: PartnerStoreTranslationInput[],
): string {
  const filled = filledPartnerStoreTranslations(translations);
  return pickLocalizedText(filled, 'hy', (row) => row.address)?.address.trim() ?? '';
}
