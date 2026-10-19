import { db } from '@white-shop/db';
import { presentCategoryTitle } from '@/lib/categories/present-category-title';
import { toSlug } from '@/lib/utils/slug';
import type { LanguageCode } from '@/lib/language';
import { isContentLocale } from '@/lib/i18n/localized-text';

export interface NamedLocaleRow {
  locale: LanguageCode;
  text: string;
}

const SLUG_ATTEMPT_LIMIT = 1000;

export function readNamedLocaleRows(
  translations: unknown,
  fallback?: { locale?: string; text?: string },
): NamedLocaleRow[] {
  const rows: NamedLocaleRow[] = [];
  if (Array.isArray(translations)) {
    for (const item of translations) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      const row = item as { locale?: unknown; title?: unknown; name?: unknown; label?: unknown; text?: unknown };
      if (typeof row.locale !== 'string' || !isContentLocale(row.locale)) {
        continue;
      }
      const raw = row.title ?? row.name ?? row.label ?? row.text;
      if (typeof raw !== 'string' || !raw.trim()) {
        continue;
      }
      rows.push({ locale: row.locale, text: raw.trim() });
    }
  }

  if (rows.length > 0) {
    return rows;
  }

  const text = fallback?.text?.trim() ?? '';
  if (!text) {
    return [];
  }
  const locale = isContentLocale(fallback?.locale) ? fallback.locale : 'en';
  return [{ locale, text }];
}

/** One Latin slug that is free in every locale being saved. */
export async function reserveSharedSlug(
  baseInput: string,
  locales: string[],
  excludeCategoryId?: string,
): Promise<string> {
  const baseSlug = toSlug(baseInput) || 'item';
  for (let attempt = 0; attempt < SLUG_ATTEMPT_LIMIT; attempt += 1) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    const clash = await db.categoryTranslation.findFirst({
      where: {
        slug: candidate,
        locale: { in: locales },
        ...(excludeCategoryId ? { categoryId: { not: excludeCategoryId } } : {}),
      },
      select: { id: true },
    });
    if (!clash) {
      return candidate;
    }
  }

  throw new Error(`Unable to reserve slug '${baseSlug}'`);
}

export async function saveCategoryLocaleRows(
  categoryId: string,
  rows: NamedLocaleRow[],
  slug: string,
): Promise<void> {
  for (const row of rows) {
    await db.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId, locale: row.locale } },
      update: { title: presentCategoryTitle(row.text, row.locale), slug, fullPath: slug },
      create: {
        categoryId,
        locale: row.locale,
        title: presentCategoryTitle(row.text, row.locale),
        slug,
        fullPath: slug,
      },
    });
  }

  await db.categoryTranslation.deleteMany({
    where: { categoryId, locale: { notIn: rows.map((row) => row.locale) } },
  });
}
