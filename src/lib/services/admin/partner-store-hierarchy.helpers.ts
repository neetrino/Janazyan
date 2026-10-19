import { pickLocalizedText } from '@/lib/i18n/localized-text';
import { writeInContentLocale } from '@/lib/i18n/locale-script';
import type { PartnerStoreLocale } from '@/features/stores/partner-store-locales';
import { PARTNER_STORE_LOCALES } from '@/features/stores/partner-store-locales';
import { toSlug } from '@/lib/utils/slug';

export type LocaleNameInput = {
  locale: PartnerStoreLocale | string;
  name: string;
};

export function validationError(detail: string) {
  return {
    status: 400,
    type: 'https://api.shop.am/problems/validation-error',
    title: 'Validation Error',
    detail,
  };
}

export function notFoundError(detail: string) {
  return {
    status: 404,
    type: 'https://api.shop.am/problems/not-found',
    title: 'Not Found',
    detail,
  };
}

export function pickTranslationName(
  translations: Array<{ locale: string; name: string }>,
  displayLocale = 'hy',
): string {
  return pickLocalizedText(translations, displayLocale, (row) => row.name)?.name ?? '';
}

export function mapNameTranslations(
  translations: Array<{ locale: string; name: string }>,
): Array<{ locale: string; name: string }> {
  return translations.map((t) => ({ locale: t.locale, name: t.name }));
}

export function normalizeNameTranslations(translations: LocaleNameInput[]): Array<{
  locale: string;
  name: string;
}> {
  const cleaned = translations
    .map((t) => ({ locale: t.locale, name: writeInContentLocale(t.name, t.locale).trim() }))
    .filter((t) => t.name.length > 0);

  if (!cleaned.length) {
    throw validationError('Enter a name in at least one language');
  }

  return cleaned;
}

export async function generateUniqueSlug(
  exists: (slug: string) => Promise<boolean>,
  baseName: string,
  fallback: string,
): Promise<string> {
  const baseSlug = toSlug(baseName) || fallback;
  let slug = baseSlug;
  let counter = 1;

  while (await exists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
    if (counter > 1000) {
      throw {
        status: 500,
        type: 'https://api.shop.am/problems/internal-error',
        title: 'Unable to generate unique slug',
        detail: `Could not generate a unique ${fallback} slug`,
      };
    }
  }

  return slug;
}

/** Builds default locale name rows from a display name. */
export function buildLocaleNamesFromLabel(name: string): LocaleNameInput[] {
  const trimmed = name.trim();
  return PARTNER_STORE_LOCALES.map((locale) => ({ locale, name: trimmed }));
}
