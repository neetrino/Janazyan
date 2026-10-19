import { db } from "@white-shop/db";

import { pickLocalizedText } from "@/lib/i18n/localized-text";

const ADMIN_CATEGORY_TITLE_LOCALE = "hy";

type CategoryTranslationRow = {
  locale: string;
  title: string;
};

/**
 * Admin lists show the Armenian title when it exists, otherwise another saved language.
 */
export function pickAdminCategoryTitle(
  translations: CategoryTranslationRow[] | undefined,
): string {
  if (!Array.isArray(translations) || translations.length === 0) {
    return "";
  }

  const picked = pickLocalizedText(translations, ADMIN_CATEGORY_TITLE_LOCALE, (row) => row.title);
  return picked?.title.trim() ?? "";
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
