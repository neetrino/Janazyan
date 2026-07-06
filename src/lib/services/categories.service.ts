import { db } from "@white-shop/db";
import { isDatabaseConnectionUrlConfigured } from "@white-shop/db/env";
import {
  getChildCategoryRows,
  getRootCategoryRows,
} from "@/lib/categories/category-sibling-order";

class CategoriesService {
  /**
   * Get category tree
   */
  async getTree(lang: string = "en") {
    if (!isDatabaseConnectionUrlConfigured()) {
      return { data: [] };
    }

    const categories = await db.category.findMany({
      where: {
        published: true,
        deletedAt: null,
      },
      include: {
        translations: true,
        children: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    const categoryRows = categories as Array<{
      id: string;
      parentId: string | null;
      position: number;
      translations: Array<{ locale: string; slug: string; title: string; fullPath: string }>;
    }>;

    const categoryMap = new Map<
      string,
      {
        id: string;
        slug: string;
        title: string;
        fullPath: string;
        children: Array<{
          id: string;
          slug: string;
          title: string;
          fullPath: string;
          children: unknown[];
        }>;
      }
    >();
    const rootCategories: Array<{
      id: string;
      slug: string;
      title: string;
      fullPath: string;
      children: Array<{
        id: string;
        slug: string;
        title: string;
        fullPath: string;
        children: unknown[];
      }>;
    }> = [];

    categoryRows.forEach((category) => {
      const translation =
        category.translations.find((row) => row.locale === lang) ||
        category.translations[0];
      if (!translation) {
        return;
      }

      categoryMap.set(category.id, {
        id: category.id,
        slug: translation.slug,
        title: translation.title,
        fullPath: translation.fullPath,
        children: [],
      });
    });

    getRootCategoryRows(categoryRows).forEach((category) => {
      const categoryData = categoryMap.get(category.id);
      if (categoryData) {
        rootCategories.push(categoryData);
      }
    });

    const parentIds = new Set(
      categoryRows
        .map((row) => row.parentId)
        .filter((parentId): parentId is string => Boolean(parentId)),
    );

    parentIds.forEach((parentId) => {
      const parent = categoryMap.get(parentId);
      if (!parent) {
        return;
      }

      parent.children = getChildCategoryRows(categoryRows, parentId)
        .map((row) => categoryMap.get(row.id))
        .filter((node): node is NonNullable<typeof node> => Boolean(node));
    });

    return {
      data: rootCategories,
    };
  }

  /**
   * Get category by slug
   */
  async findBySlug(slug: string, lang: string = "en") {
    const category = await db.category.findFirst({
      where: {
        translations: {
          some: {
            slug,
            locale: lang,
          },
        },
        published: true,
        deletedAt: null,
      },
      include: {
        translations: true,
        parent: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!category) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Category not found",
        detail: `Category with slug '${slug}' does not exist or is not published`,
      };
    }

    const translation =
      category.translations.find((t: { locale: string }) => t.locale === lang) ||
      category.translations[0];
    const parentTranslation = category.parent
      ? category.parent.translations.find((t: { locale: string }) => t.locale === lang) ||
        category.parent.translations[0]
      : null;

    return {
      id: category.id,
      slug: translation?.slug || "",
      title: translation?.title || "",
      description: translation?.description || null,
      fullPath: translation?.fullPath || "",
      seo: {
        title: translation?.seoTitle || translation?.title,
        description: translation?.seoDescription || null,
      },
      parent: category.parent
        ? {
            id: category.parent.id,
            slug: parentTranslation?.slug || "",
            title: parentTranslation?.title || "",
          }
        : null,
    };
  }
}

export const categoriesService = new CategoriesService();

