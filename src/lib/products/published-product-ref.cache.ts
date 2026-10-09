import 'server-only';

import { db } from '@white-shop/db';
import {
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  readJsonCache,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import {
  getBaseWhere,
  getBaseWhereAnyLocale,
} from '@/lib/services/products-slug/product-query-where';
import { decodeSlugParam, toSlug } from '@/lib/utils/slug';

export type PublishedProductRef = {
  id: string;
  primaryCategoryId: string | null;
  primaryCategorySlug: string | null;
};

const REF_SELECT = {
  id: true,
  primaryCategoryId: true,
  categories: {
    select: {
      id: true,
      translations: {
        select: { slug: true, locale: true },
        take: 2,
      },
    },
  },
} as const;

function pickCategorySlug(
  categories: Array<{
    id: string;
    translations: Array<{ slug: string; locale: string }>;
  }>,
  primaryCategoryId: string | null,
  lang: string,
): string | null {
  const primary =
    primaryCategoryId != null
      ? categories.find((category) => category.id === primaryCategoryId)
      : categories[0];
  if (!primary) {
    return null;
  }
  const match = primary.translations.find((tr) => tr.locale === lang);
  return match?.slug ?? primary.translations[0]?.slug ?? null;
}

async function findPublishedProductRefRow(slug: string, lang: string) {
  let row = await db.product.findFirst({
    where: getBaseWhere(slug, lang),
    select: REF_SELECT,
  });

  // Catalog may link an en-only slug while the storefront language is hy (or vice versa).
  if (!row) {
    row = await db.product.findFirst({
      where: getBaseWhereAnyLocale(slug),
      select: REF_SELECT,
    });
  }

  return row;
}

async function loadPublishedProductRefFromDb(
  rawSlug: string,
  lang: string,
): Promise<PublishedProductRef | null> {
  const slug = decodeSlugParam(rawSlug);
  let row = await findPublishedProductRefRow(slug, lang);

  // Old Armenian/Cyrillic URLs → Latin slug after migration / admin normalize.
  if (!row) {
    const latinSlug = toSlug(slug);
    if (latinSlug && latinSlug !== slug) {
      row = await findPublishedProductRefRow(latinSlug, lang);
    }
  }

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    primaryCategoryId: row.primaryCategoryId,
    primaryCategorySlug: pickCategorySlug(row.categories, row.primaryCategoryId, lang),
  };
}

async function persistPublishedProductRef(
  slug: string,
  lang: string,
  cacheKey: string,
): Promise<PublishedProductRef | null> {
  const cachedAfterLock = await readJsonCache<PublishedProductRef>(cacheKey);
  if (cachedAfterLock) {
    return cachedAfterLock;
  }

  const ref = await loadPublishedProductRefFromDb(slug, lang);
  if (ref) {
    await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.productRef, ref);
  }
  return ref;
}

/**
 * Lightweight slug → product ref (shared across PDP parallel loads via dedup + Redis).
 */
export async function getPublishedProductRefCached(
  rawSlug: string,
  lang: string,
): Promise<PublishedProductRef | null> {
  const slug = decodeSlugParam(rawSlug);
  const cacheKey = STOREFRONT_CACHE_KEYS.productRef(lang, slug);
  const cached = await readJsonCache<PublishedProductRef>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`product-ref:${cacheKey}`, () =>
    persistPublishedProductRef(slug, lang, cacheKey),
  );
}
