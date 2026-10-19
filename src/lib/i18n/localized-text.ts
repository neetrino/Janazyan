import { LANGUAGES, type LanguageCode } from '@/lib/language';
import { toSlug } from '@/lib/utils/slug';

export const CONTENT_LOCALES = Object.keys(LANGUAGES) as LanguageCode[];

const LOCALE_SET = new Set<string>(CONTENT_LOCALES);
const FALLBACK_LOCALE_ORDER: LanguageCode[] = ['hy', 'en', 'ru'];

export interface LocalizedText {
  locale: LanguageCode;
  text: string;
}

export function isContentLocale(value: string | null | undefined): value is LanguageCode {
  return Boolean(value && LOCALE_SET.has(value));
}

export function emptyLocalizedTexts(): LocalizedText[] {
  return CONTENT_LOCALES.map((locale) => ({ locale, text: '' }));
}

export function mergeLocalizedTexts(
  rows: Array<{ locale?: string; text?: string | null }>,
): LocalizedText[] {
  const byLocale = new Map(rows.map((row) => [row.locale, row.text ?? '']));
  return CONTENT_LOCALES.map((locale) => ({
    locale,
    text: byLocale.get(locale) ?? '',
  }));
}

export function filledLocalizedTexts(texts: LocalizedText[]): LocalizedText[] {
  return texts.flatMap((row) => {
    const text = row.text.trim();
    return text ? [{ locale: row.locale, text }] : [];
  });
}

/**
 * One language's text changes. The slug stays Latin and shared.
 * It follows the title only until someone edits the slug by hand.
 */
export function applyLocalizedTextChange<T extends { texts: LocalizedText[]; slug: string }>(
  prev: T,
  locale: LanguageCode,
  patch: { text?: string; slug?: string },
): T {
  const edited = prev.texts.find((row) => row.locale === locale);
  const previousText = edited?.text ?? '';
  const slugFollowsText = !prev.slug.trim() || prev.slug === toSlug(previousText);
  const slug =
    patch.slug !== undefined
      ? toSlug(patch.slug)
      : patch.text !== undefined && slugFollowsText
        ? toSlug(patch.text)
        : prev.slug;

  const texts = prev.texts.map((row) =>
    row.locale === locale ? { ...row, text: patch.text ?? row.text } : row,
  );

  return { ...prev, texts, slug };
}

/**
 * Requested language when it has text, otherwise the first saved language.
 */
export function pickLocalizedText<T extends { locale: string }>(
  rows: T[],
  lang: string,
  read: (row: T) => string | null | undefined,
): T | null {
  if (rows.length === 0) {
    return null;
  }

  const filled = rows.filter((row) => Boolean(read(row)?.trim()));
  const pool = filled.length > 0 ? filled : rows;
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
