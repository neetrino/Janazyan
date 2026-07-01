import type { LanguageCode } from '../../lib/language';

/** Locales supported for partner store translations in admin (en, hy, ru). */
export const PARTNER_STORE_LOCALES = ['en', 'hy', 'ru'] as const satisfies readonly LanguageCode[];

export type PartnerStoreLocale = (typeof PARTNER_STORE_LOCALES)[number];

export type PartnerStoreTranslationInput = {
  locale: PartnerStoreLocale;
  name: string;
  address: string;
  logoAlt?: string;
};
