import { LANGUAGES, type LanguageCode } from '@/lib/language';
import { toSlug } from '@/lib/utils/slug';

export const PRODUCT_CONTENT_LOCALES = Object.keys(LANGUAGES) as LanguageCode[];

const LOCALE_SET = new Set<string>(PRODUCT_CONTENT_LOCALES);

/** Prefer the requested language, then the store default, then any saved translation. */
const FALLBACK_LOCALE_ORDER: LanguageCode[] = ['hy', 'en', 'ru'];

export interface ProductContentTranslation {
  locale: LanguageCode;
  title: string;
  slug: string;
  descriptionHtml: string;
}

export interface ProductContentWriteRow {
  locale: LanguageCode;
  title: string;
  slug: string;
  descriptionHtml: string;
}

export function isProductContentLocale(value: string | null | undefined): value is LanguageCode {
  return Boolean(value && LOCALE_SET.has(value));
}

export function emptyProductContentTranslations(): ProductContentTranslation[] {
  return PRODUCT_CONTENT_LOCALES.map((locale) => ({
    locale,
    title: '',
    slug: '',
    descriptionHtml: '',
  }));
}

function hasTitle(row: { title?: string | null }): boolean {
  return Boolean(row.title?.trim());
}

/**
 * Storefront copy for one product.
 * Uses the requested locale when that translation has a title.
 * Otherwise uses the first saved language (hy, then en, then ru).
 */
export function pickProductTranslation<T extends { locale: string; title?: string | null }>(
  translations: T[],
  lang: string,
): T | null {
  if (translations.length === 0) {
    return null;
  }

  const filled = translations.filter((row) => hasTitle(row));
  const pool = filled.length > 0 ? filled : translations;
  const requested = pool.find((row) => row.locale === lang);
  if (requested) {
    return requested;
  }

  for (const locale of FALLBACK_LOCALE_ORDER) {
    const match = pool.find((row) => row.locale === locale);
    if (match) {
      return match;
    }
  }

  return pool[0] ?? null;
}

/**
 * Description follows the visible translation.
 * If that language has no description, use the first saved description.
 */
export function pickProductDescriptionHtml(
  translations: Array<{ locale: string; title?: string | null; descriptionHtml?: string | null }>,
  lang: string,
): string | null {
  const selected = pickProductTranslation(translations, lang);
  const own = selected?.descriptionHtml?.trim();
  if (own) {
    return own;
  }

  const order = [lang, ...FALLBACK_LOCALE_ORDER];
  for (const locale of order) {
    const html = translations.find((row) => row.locale === locale)?.descriptionHtml?.trim();
    if (html) {
      return html;
    }
  }

  return null;
}

export function mergeProductContentTranslations(
  rows: Array<{
    locale?: string;
    title?: string | null;
    slug?: string | null;
    descriptionHtml?: string | null;
  }>,
): ProductContentTranslation[] {
  const byLocale = new Map(rows.map((row) => [row.locale, row]));
  return PRODUCT_CONTENT_LOCALES.map((locale) => {
    const row = byLocale.get(locale);
    return {
      locale,
      title: row?.title ?? '',
      slug: row?.slug ?? '',
      descriptionHtml: row?.descriptionHtml ?? '',
    };
  });
}

export function filledProductContentTranslations(
  rows: ProductContentTranslation[],
  sharedSlug?: string,
): ProductContentWriteRow[] {
  const forcedSlug = sharedSlug ? toSlug(sharedSlug) : '';
  return rows.flatMap((row) => {
    const title = row.title.trim();
    if (!title) {
      return [];
    }
    const slug = forcedSlug || toSlug(row.slug || title) || toSlug(title);
    return [
      {
        locale: row.locale,
        title,
        slug,
        descriptionHtml: row.descriptionHtml,
      },
    ];
  });
}

function readTranslationRow(value: unknown): ProductContentWriteRow | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const row = value as {
    locale?: unknown;
    title?: unknown;
    slug?: unknown;
    descriptionHtml?: unknown;
  };
  if (typeof row.locale !== 'string' || !isProductContentLocale(row.locale)) {
    return null;
  }
  if (typeof row.title !== 'string' || !row.title.trim()) {
    return null;
  }
  const title = row.title.trim();
  const slugSource = typeof row.slug === 'string' && row.slug.trim() ? row.slug : title;
  return {
    locale: row.locale,
    title,
    slug: toSlug(slugSource) || toSlug(title),
    descriptionHtml: typeof row.descriptionHtml === 'string' ? row.descriptionHtml : '',
  };
}

/** Admin payload: explicit translation list, or the legacy single title/slug/locale fields. */
export function resolveProductContentRows(data: {
  title?: string;
  slug?: string;
  descriptionHtml?: string | null;
  locale?: string;
  translations?: unknown;
}): ProductContentWriteRow[] {
  if (Array.isArray(data.translations)) {
    const rows = data.translations
      .map((row) => readTranslationRow(row))
      .filter((row): row is ProductContentWriteRow => row !== null);
    if (rows.length > 0) {
      const sharedSlug = data.slug?.trim() ? toSlug(data.slug) : '';
      return sharedSlug ? rows.map((row) => ({ ...row, slug: sharedSlug })) : rows;
    }
  }

  const title = data.title?.trim() ?? '';
  const slug = data.slug?.trim() ?? '';
  if (!title || !slug) {
    return [];
  }

  const locale = isProductContentLocale(data.locale) ? data.locale : 'en';
  return [
    {
      locale,
      title,
      slug: toSlug(slug) || toSlug(title),
      descriptionHtml: data.descriptionHtml ?? '',
    },
  ];
}
