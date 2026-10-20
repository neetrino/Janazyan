import { isContentLocale, pickLocalizedText } from '@/lib/i18n/localized-text';
import type { LanguageCode } from '@/lib/language';
import type { DeliveryNameTranslation } from './delivery-settings.types';

const CANONICAL_LOCALE_ORDER: LanguageCode[] = ['en', 'hy', 'ru'];

function readNameRow(item: unknown): DeliveryNameTranslation | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const row = item as { locale?: unknown; text?: unknown };
  const locale = typeof row.locale === 'string' ? row.locale : undefined;
  if (!isContentLocale(locale)) {
    return null;
  }

  if (typeof row.text !== 'string' || !row.text.trim()) {
    return null;
  }

  return { locale, text: row.text.trim() };
}

function parseNameRows(raw: unknown): DeliveryNameTranslation[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const byLocale = new Map<LanguageCode, string>();
  for (const item of raw) {
    const row = readNameRow(item);
    if (row) {
      byLocale.set(row.locale, row.text);
    }
  }

  return CANONICAL_LOCALE_ORDER.flatMap((locale) => {
    const text = byLocale.get(locale);
    return text ? [{ locale, text }] : [];
  });
}

/** Keeps saved translations. A legacy single name is copied into every language. */
export function normalizeDeliveryNames(raw: unknown, fallback: string): DeliveryNameTranslation[] {
  const parsed = parseNameRows(raw);
  if (parsed.length > 0) {
    return parsed;
  }

  const text = fallback.trim();
  if (!text) {
    return [];
  }

  return CANONICAL_LOCALE_ORDER.map((locale) => ({ locale, text }));
}

/** Stable stored label. English wins so checkout values stay Latin. */
export function canonicalDeliveryName(
  names: ReadonlyArray<{ locale: string; text: string }>,
  fallback = '',
): string {
  const filled = names.filter((row) => row.text.trim());
  for (const locale of CANONICAL_LOCALE_ORDER) {
    const match = filled.find((row) => row.locale === locale);
    if (match) {
      return match.text.trim();
    }
  }

  return filled[0]?.text.trim() || fallback.trim();
}

export function deliveryNameForLocale(
  names: ReadonlyArray<{ locale: string; text: string }> | undefined,
  fallback: string,
  locale: string,
): string {
  const rows = names ?? [];
  const exact = rows.find((row) => row.locale === locale && row.text.trim());
  if (exact) {
    return exact.text.trim();
  }

  const picked = pickLocalizedText(
    rows.filter((row) => row.text.trim()),
    locale,
    (row) => row.text,
  );

  return picked?.text.trim() || fallback.trim();
}

export function deliveryLabelMatches(
  candidate: string,
  name: string,
  names: ReadonlyArray<{ text: string }> | undefined,
): boolean {
  const target = candidate.trim().toLowerCase();
  if (!target) {
    return false;
  }

  const labels = [name, ...(names ?? []).map((row) => row.text)];
  return labels.some((label) => label.trim().toLowerCase() === target);
}
