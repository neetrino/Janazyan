import { db } from "@white-shop/db";

const ADMIN_CATEGORY_TITLE_LOCALE = "en";

type CategoryTranslationRow = {
  locale: string;
  title: string;
};

/**
 * Admin UI prefers EN category titles; falls back to the first available translation.
 */
export function pickAdminCategoryTitle(
  translations: CategoryTranslationRow[] | undefined,
): string {
  if (!Array.isArray(translations) || translations.length === 0) {
    return "";
  }

  const preferred = translations.find((row) => row.locale === ADMIN_CATEGORY_TITLE_LOCALE);
  return (preferred ?? translations[0])?.title?.trim() ?? "";
}

/**
 * Batch-load category titles for admin product lists and summaries.
 */
export async function loadAdminCategoryTitleMap(
  categoryIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(categoryIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return new Map();
  }

  const categories = await db.category.findMany({
    where: {
      id: { in: uniqueIds },
      deletedAt: null,
    },
    include: {
      translations: true,
    },
  });

  const titleById = new Map<string, string>();
  for (const category of categories) {
    const title = pickAdminCategoryTitle(category.translations);
    if (title) {
      titleById.set(category.id, title);
    }
  }

  return titleById;
}
