import { db } from "@white-shop/db";
import { isCategoryIdFilterParam } from "@/lib/categories/category-filter-param";
import {
  isShopCategorySlug,
  titleMatchesShopCategorySlug,
  type ShopCategorySlug,
} from "@/lib/categories/shop-category-slug-keywords";
import { logger } from "../../utils/logger";

type PublishedCategoryNode = {
  id: string;
  parentId: string | null;
};

function buildChildrenMap(rows: readonly PublishedCategoryNode[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const row of rows) {
    if (!row.parentId) {
      continue;
    }
    const siblings = map.get(row.parentId);
    if (siblings) {
      siblings.push(row.id);
      continue;
    }
    map.set(row.parentId, [row.id]);
  }
  return map;
}

function collectDescendantCategoryIds(
  parentId: string,
  childrenMap: ReadonlyMap<string, readonly string[]>,
): string[] {
  const descendants: string[] = [];
  const queue = [...(childrenMap.get(parentId) ?? [])];
  let cursor = 0;

  while (cursor < queue.length) {
    const currentId = queue[cursor];
    cursor += 1;
    if (!currentId) {
      continue;
    }
    descendants.push(currentId);
    const children = childrenMap.get(currentId);
    if (children) {
      queue.push(...children);
    }
  }

  return descendants;
}

/** Get all descendant category IDs for a parent category. */
export async function getAllChildCategoryIds(parentId: string): Promise<string[]> {
  const rows = await db.category.findMany({
    where: {
      published: true,
      deletedAt: null,
    },
    select: { id: true, parentId: true },
  });
  return collectDescendantCategoryIds(parentId, buildChildrenMap(rows));
}

async function findCategoryDocByTranslationSlug(
  categorySlug: string,
  lang: string,
): Promise<{ id: string } | null> {
  let categoryDoc = await db.category.findFirst({
    where: {
      translations: {
        some: {
          slug: categorySlug,
          locale: lang,
        },
      },
      published: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!categoryDoc) {
    categoryDoc = await db.category.findFirst({
      where: {
        translations: {
          some: {
            slug: categorySlug,
          },
        },
        published: true,
        deletedAt: null,
      },
      select: { id: true },
    });
  }

  return categoryDoc;
}

async function findAllCategoryIdsByShopSlugTitle(
  shopSlug: ShopCategorySlug,
  lang: string,
): Promise<string[]> {
  const rows = await db.category.findMany({
    where: {
      published: true,
      deletedAt: null,
    },
    select: {
      id: true,
      parentId: true,
      translations: {
        select: {
          locale: true,
          title: true,
        },
      },
    },
  });

  const matchedIds: string[] = [];
  const childrenMap = buildChildrenMap(rows);

  for (const row of rows) {
    const translation =
      row.translations.find((tr) => tr.locale === lang) ?? row.translations[0];
    if (!translation) {
      continue;
    }
    if (titleMatchesShopCategorySlug(translation.title, shopSlug)) {
      matchedIds.push(row.id);
    }
  }

  if (matchedIds.length === 0) {
    return [];
  }

  const allIds = new Set<string>();
  for (const categoryId of matchedIds) {
    allIds.add(categoryId);
    const descendants = collectDescendantCategoryIds(categoryId, childrenMap);
    for (const descendantId of descendants) {
      allIds.add(descendantId);
    }
  }

  return [...allIds];
}

async function findCategoryIdsByCategoryId(categoryId: string): Promise<string[]> {
  const categoryDoc = await db.category.findFirst({
    where: {
      id: categoryId,
      published: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!categoryDoc) {
    return [];
  }

  const childCategoryIds = await getAllChildCategoryIds(categoryDoc.id);
  return [categoryDoc.id, ...childCategoryIds];
}

/**
 * Resolve all category IDs for a storefront filter slug (includes descendants).
 */
export async function findCategoryIdsBySlug(
  categorySlug: string,
  lang: string,
): Promise<string[]> {
  const normalizedSlug = categorySlug.trim();
  if (!normalizedSlug) {
    return [];
  }

  if (isCategoryIdFilterParam(normalizedSlug)) {
    return findCategoryIdsByCategoryId(normalizedSlug);
  }

  const slugMatch = await findCategoryDocByTranslationSlug(normalizedSlug, lang);
  if (slugMatch) {
    const childCategoryIds = await getAllChildCategoryIds(slugMatch.id);
    return [slugMatch.id, ...childCategoryIds];
  }

  if (!isShopCategorySlug(normalizedSlug)) {
    return [];
  }

  const titleMatches = await findAllCategoryIdsByShopSlugTitle(normalizedSlug, lang);
  if (titleMatches.length === 0) {
    return [];
  }
  return titleMatches;
}

/**
 * Find category by slug with fallback to other languages and shop title match.
 */
export async function findCategoryBySlug(
  categorySlug: string,
  lang: string,
): Promise<{ id: string } | null> {
  logger.debug('Looking for category', { category: categorySlug, lang });

  const categoryIds = await findCategoryIdsBySlug(categorySlug, lang);
  if (categoryIds.length === 0) {
    logger.warn('Category not found in any language', { category: categorySlug, lang });
    return null;
  }

  logger.info('Category found', { id: categoryIds[0], slug: categorySlug, count: categoryIds.length });
  return { id: categoryIds[0] };
}
