import type { Prisma } from "@white-shop/db";
import { db } from "@white-shop/db";
import { logger } from "../../utils/logger";
import { getPublishedProductRefCached } from "@/lib/products/published-product-ref.cache";
import { getCachedCategoryBySlug } from "@/lib/categories/category-by-slug.cache";
import { getCachedCategoryDescendantIds } from "@/lib/categories/category-descendant-ids.cache";
import {
  transformRelatedProductRows,
  type RelatedCardPayload,
  type RelatedProductRow,
} from "./product-related-transform";
import { getProductDiscountSettings } from "../products-discount-settings.cache";

const RELATED_CANDIDATE_LIMIT = 14;

const relatedProductSelect = {
  id: true,
  discountPercent: true,
  primaryCategoryId: true,
  brandId: true,
  media: true,
  translations: {
    select: { slug: true, title: true, locale: true },
    take: 10,
  },
  brand: {
    select: {
      id: true,
      translations: {
        select: { name: true, locale: true },
        take: 10,
      },
    },
  },
  variants: {
    where: { published: true },
    orderBy: { price: "asc" as const },
    take: 1,
    select: {
      id: true,
      price: true,
      compareAtPrice: true,
      stock: true,
    },
  },
  categories: {
    select: {
      id: true,
      translations: {
        select: { slug: true, title: true, locale: true },
        take: 6,
      },
    },
  },
} satisfies Prisma.ProductSelect;

async function categoryScopeWhere(
  categorySlug: string,
  lang: string
): Promise<Prisma.ProductWhereInput | null> {
  const categoryDoc = await getCachedCategoryBySlug(categorySlug, lang);
  if (!categoryDoc) {
    return null;
  }
  const childCategoryIds = await getCachedCategoryDescendantIds(categoryDoc.id);
  const allCategoryIds = [categoryDoc.id, ...childCategoryIds];
  const categoryConditions = allCategoryIds.flatMap((catId: string) => [
    { primaryCategoryId: catId },
    { categoryIds: { has: catId } },
  ]);
  return { OR: categoryConditions };
}

async function fetchRelatedRows(
  excludeProductId: string,
  lang: string,
  categorySlug: string | undefined
): Promise<RelatedCardPayload[]> {
  const baseWhere: Prisma.ProductWhereInput = {
    published: true,
    deletedAt: null,
    id: { not: excludeProductId },
    variants: { some: { published: true } },
  };

  let where: Prisma.ProductWhereInput = baseWhere;

  if (categorySlug) {
    const catWhere = await categoryScopeWhere(categorySlug, lang);
    if (!catWhere) {
      return [];
    }
    where = { ...baseWhere, AND: catWhere };
  }

  const [rows, discountSettings] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: RELATED_CANDIDATE_LIMIT,
      select: relatedProductSelect,
    }),
    getProductDiscountSettings(),
  ]);

  return transformRelatedProductRows(
    rows as RelatedProductRow[],
    lang,
    discountSettings,
  );
}

/**
 * Related products for PDP: one light Prisma query + card transform (no full catalog pipeline).
 */
export async function findRelatedByProductSlug(slug: string, lang: string) {
  try {
    const ref = await getPublishedProductRefCached(slug, lang);
    if (!ref) {
      return { data: [] as RelatedCardPayload[], meta: { total: 0 } };
    }

    const data = await fetchRelatedRows(
      ref.id,
      lang,
      ref.primaryCategorySlug ?? undefined,
    );
    const filtered = data
      .filter((item) => item.id !== ref.id && item.slug.length > 0)
      .slice(0, 10);
    return { data: filtered, meta: { total: filtered.length } };
  } catch (error: unknown) {
    logger.warn("findRelatedByProductSlug failed", {
      slug,
      lang,
      error: error instanceof Error ? error.message : String(error),
    });
    return { data: [], meta: { total: 0 } };
  }
}
