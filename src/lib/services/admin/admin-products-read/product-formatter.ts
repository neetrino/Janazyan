import { pickAdminCategoryTitle } from "../admin-category-title";

function categoryTitleFromTranslations(
  translations: Array<{ locale?: string; title: string }> | undefined,
): string {
  if (!Array.isArray(translations) || translations.length === 0) {
    return "";
  }

  return pickAdminCategoryTitle(
    translations.map((row) => ({
      locale: row.locale ?? "en",
      title: row.title,
    })),
  );
}

function sortCategoryIds(
  categoryIds: string[],
  primaryCategoryId: string | null,
): string[] {
  return [...categoryIds].sort((a, b) => {
    if (primaryCategoryId) {
      if (a === primaryCategoryId && b !== primaryCategoryId) return -1;
      if (b === primaryCategoryId && a !== primaryCategoryId) return 1;
    }
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });
}

/**
 * Comma-separated category titles; primary category first when set.
 */
function formatCategorySummary(
  product: {
    primaryCategoryId: string | null;
    categoryIds?: string[];
    categories?: Array<{
      id: string;
      translations?: Array<{ locale?: string; title: string }>;
    }>;
  },
  categoryTitleById?: Map<string, string>,
): string {
  const relationCategories = product.categories ?? [];
  if (relationCategories.length > 0) {
    const primaryId = product.primaryCategoryId;
    const ordered = [...relationCategories].sort((a, b) => {
      if (primaryId) {
        if (a.id === primaryId && b.id !== primaryId) return -1;
        if (b.id === primaryId && a.id !== primaryId) return 1;
      }
      return categoryTitleFromTranslations(a.translations).localeCompare(
        categoryTitleFromTranslations(b.translations),
        undefined,
        { sensitivity: "base" },
      );
    });

    return ordered
      .map((category) => categoryTitleFromTranslations(category.translations))
      .filter(Boolean)
      .join(", ");
  }

  const categoryIds = product.categoryIds ?? [];
  if (categoryIds.length === 0 || !categoryTitleById) {
    return "";
  }

  return sortCategoryIds(categoryIds, product.primaryCategoryId)
    .map((id) => categoryTitleById.get(id) ?? "")
    .filter(Boolean)
    .join(", ");
}

/**
 * Format product for list response
 */
export function formatProductForList(
  product: {
    id: string;
    published: boolean;
    featured: boolean | null;
    discountPercent: number | null;
    createdAt: Date;
    primaryCategoryId: string | null;
    categoryIds?: string[];
    translations?: Array<{
      slug: string;
      title: string;
    }>;
    variants?: Array<{
      price: number;
      stock: number;
      compareAtPrice: number | null;
    }>;
    media?: unknown[];
    categories?: Array<{
      id: string;
      translations?: Array<{ locale?: string; title: string }>;
    }>;
  },
  categoryTitleById?: Map<string, string>,
) {
  const translation =
    Array.isArray(product.translations) && product.translations.length > 0
      ? product.translations[0]
      : null;

  const variant =
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants[0]
      : null;

  const image = extractImageFromMedia(product.media);

  return {
    id: product.id,
    slug: translation?.slug || "",
    title: translation?.title || "",
    published: product.published,
    featured: product.featured || false,
    price: variant?.price || 0,
    stock: variant?.stock || 0,
    discountPercent: product.discountPercent || 0,
    compareAtPrice: variant?.compareAtPrice || null,
    colorStocks: [],
    image,
    createdAt: product.createdAt.toISOString(),
    categorySummary: formatCategorySummary(product, categoryTitleById),
  };
}

/**
 * Extract image from media array
 */
function extractImageFromMedia(media: unknown[] | undefined): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const firstMedia = media[0];

  if (typeof firstMedia === "string") {
    return firstMedia;
  }

  if (firstMedia && typeof firstMedia === "object" && "url" in firstMedia) {
    const mediaObj = firstMedia as { url?: string };
    return mediaObj.url || null;
  }

  return null;
}

function collectProductCategoryIds(product: {
  primaryCategoryId: string | null;
  categoryIds?: string[];
}): string[] {
  const ids = new Set<string>();
  if (product.primaryCategoryId) {
    ids.add(product.primaryCategoryId);
  }
  for (const id of product.categoryIds ?? []) {
    ids.add(id);
  }
  return [...ids];
}

export { collectProductCategoryIds };
