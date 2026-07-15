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

async function loadPublishedProductRefFromDb(
  slug: string,
  lang: string,
): Promise<PublishedProductRef | null> {
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
  slug: string,
  lang: string,
): Promise<PublishedProductRef | null> {
  const cacheKey = STOREFRONT_CACHE_KEYS.productRef(lang, slug);
  const cached = await readJsonCache<PublishedProductRef>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`product-ref:${cacheKey}`, () =>
    persistPublishedProductRef(slug, lang, cacheKey),
  );
}
