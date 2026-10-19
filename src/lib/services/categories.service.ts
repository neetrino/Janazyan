import { db } from "@white-shop/db";
import { isDatabaseConnectionUrlConfigured } from "@white-shop/db/env";
import {
  getChildCategoryRows,
  getRootCategoryRows,
} from "@/lib/categories/category-sibling-order";
import { DEFAULT_LANGUAGE } from '../language';
import { presentCategoryTitle } from '@/lib/categories/present-category-title';
import { pickLocalizedText } from '@/lib/i18n/localized-text';

class CategoriesService {
  /**
   * Get category tree
   */
  async getTree(lang: string = DEFAULT_LANGUAGE) {
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
      const translation = pickLocalizedText(category.translations, lang, (row) => row.title);
      if (!translation) {
        return;
      }

      categoryMap.set(category.id, {
        id: category.id,
        slug: translation.slug,
        title: presentCategoryTitle(translation.title, lang),
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
  async findBySlug(slug: string, lang: string = DEFAULT_LANGUAGE) {
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
      const anyLocale = await db.category.findFirst({
        where: {
          translations: { some: { slug } },
          published: true,
          deletedAt: null,
        },
        include: {
          translations: true,
          parent: { include: { translations: true } },
        },
      });
      if (!anyLocale) {
        throw {
          status: 404,
          type: "https://api.shop.am/problems/not-found",
          title: "Category not found",
          detail: `Category with slug '${slug}' does not exist or is not published`,
        };
      }
      return this.mapCategoryDetail(anyLocale, lang);
    }

    return this.mapCategoryDetail(category, lang);
  }

  private mapCategoryDetail(
    category: {
      id: string;
      translations: Array<{ locale: string; slug: string; title: string; fullPath: string; description: string | null; seoTitle: string | null; seoDescription: string | null }>;
      parent: {
        id: string;
        translations: Array<{ locale: string; slug: string; title: string }>;
      } | null;
    },
    lang: string,
  ) {
    const translation = pickLocalizedText(category.translations, lang, (row) => row.title);
    const parentTranslation = category.parent
      ? pickLocalizedText(category.parent.translations, lang, (row) => row.title)
      : null;

    return {
      id: category.id,
      slug: translation?.slug || "",
      title: presentCategoryTitle(translation?.title || "", lang),
      description: translation?.description || null,
      fullPath: translation?.fullPath || "",
      seo: {
        title: presentCategoryTitle(translation?.seoTitle || translation?.title || "", lang),
        description: translation?.seoDescription || null,
      },
      parent: category.parent
        ? {
            id: category.parent.id,
            slug: parentTranslation?.slug || "",
            title: presentCategoryTitle(parentTranslation?.title || "", lang),
          }
        : null,
    };
  }
}

export const categoriesService = new CategoriesService();

