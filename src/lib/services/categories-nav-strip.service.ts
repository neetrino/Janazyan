import { db } from '@white-shop/db';
import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import {
  flattenCategoryTree,
  type CategoryTreeNode,
} from '../categories/category-tree';
import {
  getChildCategoryRows,
  getRootCategoryRows,
} from '../categories/category-sibling-order';

const MAX_STRIP_CATEGORIES = 9;

type CategoryRow = {
  id: string;
  parentId: string | null;
  position: number;
  translations: Array<{
    locale: string;
    slug: string;
    title: string;
    fullPath: string;
  }>;
};

function buildTreeFromRows(rows: CategoryRow[], lang: string): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>();

  for (const category of rows) {
    const translation =
      category.translations.find((tr) => tr.locale === lang) ?? category.translations[0];
    if (!translation) {
      continue;
    }

    categoryMap.set(category.id, {
      id: category.id,
      slug: translation.slug,
      title: translation.title,
      fullPath: translation.fullPath,
      children: [],
    });
  }

  const rootCategories = getRootCategoryRows(rows)
    .map((row) => categoryMap.get(row.id))
    .filter((node): node is CategoryTreeNode => Boolean(node));

  for (const category of rows) {
    if (!category.parentId) {
      continue;
    }

    const parent = categoryMap.get(category.parentId);
    if (!parent) {
      continue;
    }

    parent.children = getChildCategoryRows(rows, category.parentId)
      .map((row) => categoryMap.get(row.id))
      .filter((node): node is CategoryTreeNode => Boolean(node));
  }

  return rootCategories;
}

class CategoriesNavStripService {
  /**
   * Top category strip for /products — one flat DB query, no nested includes.
   */
  async getStrip(lang: string): Promise<CategoryTreeNode[]> {
    if (!isDatabaseConnectionUrlConfigured()) {
      return [];
    }

    const rows = await db.category.findMany({
      where: {
        published: true,
        deletedAt: null,
      },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        parentId: true,
        position: true,
        translations: {
          select: {
            locale: true,
            slug: true,
            title: true,
            fullPath: true,
          },
        },
      },
    });

    const tree = buildTreeFromRows(rows as CategoryRow[], lang);
    return flattenCategoryTree(tree).slice(0, MAX_STRIP_CATEGORIES);
  }
}

export const categoriesNavStripService = new CategoriesNavStripService();
