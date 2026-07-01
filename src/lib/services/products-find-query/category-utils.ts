import { db } from "@white-shop/db";
import {
  isShopCategorySlug,
  titleMatchesShopCategorySlug,
  type ShopCategorySlug,
} from "@/lib/categories/shop-category-slug-keywords";
import { logger } from "../../utils/logger";

/**
 * Get all child category IDs recursively
 */
export async function getAllChildCategoryIds(parentId: string): Promise<string[]> {
  const children = await db.category.findMany({
    where: {
      parentId: parentId,
      published: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  let allChildIds = children.map((c: { id: string }) => c.id);

  for (const child of children) {
    const grandChildren = await getAllChildCategoryIds(child.id);
    allChildIds = [...allChildIds, ...grandChildren];
  }

  return allChildIds;
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
      translations: {
        select: {
          locale: true,
          title: true,
        },
      },
    },
  });

  const matchedIds: string[] = [];

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

  return matchedIds;
}

/**
 * Resolve all category IDs for a storefront filter slug (includes descendants).
 */
export async function findCategoryIdsBySlug(
  categorySlug: string,
  lang: string,
): Promise<string[]> {
  const slugMatch = await findCategoryDocByTranslationSlug(categorySlug, lang);
  if (slugMatch) {
    const childCategoryIds = await getAllChildCategoryIds(slugMatch.id);
    return [slugMatch.id, ...childCategoryIds];
  }

  if (!isShopCategorySlug(categorySlug)) {
    return [];
  }

  const titleMatches = await findAllCategoryIdsByShopSlugTitle(categorySlug, lang);
  if (titleMatches.length === 0) {
    return [];
  }

  const allIds = new Set<string>();
  for (const categoryId of titleMatches) {
    allIds.add(categoryId);
    const childCategoryIds = await getAllChildCategoryIds(categoryId);
    for (const childId of childCategoryIds) {
      allIds.add(childId);
    }
  }

  return [...allIds];
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
