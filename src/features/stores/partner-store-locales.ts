import { LANGUAGES } from '../../lib/language';

/** Locales supported for partner store translations in admin. */
export const PARTNER_STORE_LOCALES = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;

export type PartnerStoreLocale = (typeof PARTNER_STORE_LOCALES)[number];

export type PartnerStoreTranslationInput = {
  locale: PartnerStoreLocale;
  name: string;
  address: string;
  logoAlt?: string;
};
