import { db } from "@white-shop/db";
import { logger } from "@/lib/utils/logger";
import { resolveAdminImageReference } from "@/lib/r2/resolve-admin-image-reference";
import { R2_IMAGE_FOLDERS } from "@/lib/r2/r2-image-folders";
import { getRootCategoryRows } from "@/lib/categories/category-sibling-order";
import { pickAdminCategoryTitle } from "./admin-category-title";
import { readNamedLocaleRows, reserveSharedSlug, saveCategoryLocaleRows } from "./category-content";
import { pickLocalizedText } from "@/lib/i18n/localized-text";

type AdminCategoryRow = {
  id: string;
  parentId: string | null;
  position: number;
  requiresSizes: boolean | null;
  published: boolean | null;
  media: unknown[];
  translations?: Array<{ locale: string; title: string; slug: string }>;
};

class AdminCategoriesService {
  private extractImageUrl(media: unknown): string | null {
    if (!Array.isArray(media)) {
      return null;
    }

    const firstItem = media[0];
    if (!firstItem || typeof firstItem !== "object") {
      return null;
    }

    const url = (firstItem as { url?: unknown }).url;
    return typeof url === "string" ? url : null;
  }

  private mapAdminCategoryRow(category: AdminCategoryRow) {
    const translations = Array.isArray(category.translations) ? category.translations : [];
    const translation = pickLocalizedText(translations, "hy", (row) => row.title);

    return {
      id: category.id,
      title: pickAdminCategoryTitle(translations),
      slug: translation?.slug || "",
      translations: translations.map((row) => ({
        locale: row.locale,
        title: row.title,
      })),
      parentId: category.parentId,
      position: category.position,
      requiresSizes: category.requiresSizes || false,
      published: Boolean(category.published),
      imageUrl: this.extractImageUrl(category.media),
    };
  }

  private async getNextSiblingPosition(parentId: string | null): Promise<number> {
    const aggregate = await db.category.aggregate({
      where: {
        parentId,
        deletedAt: null,
      },
      _max: {
        position: true,
      },
    });

    return (aggregate._max.position ?? -1) + 1;
  }

  private async detachCategoryFromProducts(categoryId: string): Promise<void> {
    const linkedProducts = await db.product.findMany({
      where: {
        OR: [
          { primaryCategoryId: categoryId },
          { categoryIds: { has: categoryId } },
        ],
      },
      select: {
        id: true,
        categoryIds: true,
      },
    });

    if (linkedProducts.length === 0) {
      return;
    }

    await db.$transaction(async (tx) => {
      await tx.product.updateMany({
        where: { primaryCategoryId: categoryId },
        data: { primaryCategoryId: null },
      });

      for (const product of linkedProducts) {
        if (!product.categoryIds.includes(categoryId)) {
          continue;
        }

        const nextCategoryIds = product.categoryIds.filter((id) => id !== categoryId);
        await tx.product.update({
          where: { id: product.id },
          data: { categoryIds: nextCategoryIds },
        });
      }

      await tx.category.update({
        where: { id: categoryId },
        data: {
          products: {
            set: [],
          },
        },
      });
    });
  }

  /**
   * Get categories for admin
   */
  async getCategories() {
    const categories = await db.category.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        translations: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    const rows = categories as AdminCategoryRow[];
    const orderedRows = [
      ...getRootCategoryRows(rows),
      ...rows
        .filter((row) => row.parentId)
        .sort((left, right) => {
          if (left.parentId !== right.parentId) {
            return (left.parentId ?? "").localeCompare(right.parentId ?? "");
          }
          if (left.position !== right.position) {
            return left.position - right.position;
          }
          return left.id.localeCompare(right.id);
        }),
    ];

    return {
      data: orderedRows.map((category) => this.mapAdminCategoryRow(category)),
    };
  }

  /**
   * Create category
   */
  async createCategory(data: {
    title: string;
    slug?: string;
    locale?: string;
    translations?: unknown;
    parentId?: string;
    requiresSizes?: boolean;
    imageUrl?: string;
    published?: boolean;
  }) {
    
    // Validate parent category exists if parentId is provided
    if (data.parentId) {
      const parentCategory = await db.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parentCategory) {
        throw {
          status: 404,
          type: "https://api.shop.am/problems/not-found",
          title: "Parent category not found",
          detail: `Parent category with id '${data.parentId}' does not exist`,
        };
      }
    }
    
    const rows = readNamedLocaleRows(data.translations, { locale: data.locale, text: data.title });
    if (rows.length === 0) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation Error",
        detail: "Enter a title in at least one language",
      };
    }
    const slug = await reserveSharedSlug(data.slug || rows[0].text, rows.map((row) => row.locale));
    const position = await this.getNextSiblingPosition(data.parentId ?? null);
    const imageUrl = await resolveAdminImageReference(data.imageUrl, R2_IMAGE_FOLDERS.categories);

    const category = await db.category.create({
      data: {
        parentId: data.parentId || undefined,
        position,
        requiresSizes: data.requiresSizes || false,
        published: data.published ?? true,
        media: imageUrl
          ? [{ type: "image", url: imageUrl }]
          : [],
        translations: {
          create: rows.map((row) => ({
            locale: row.locale,
            title: row.text,
            slug,
            fullPath: slug,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    // Безопасное получение translation с проверкой на существование массива
    const categoryTranslations = Array.isArray(category.translations) ? category.translations : [];
    const translation = pickLocalizedText(categoryTranslations, rows[0].locale, (row) => row.title);

    return {
      data: {
        id: category.id,
        title: translation?.title || "",
        slug: translation?.slug || "",
        translations: categoryTranslations.map((row) => ({
          locale: row.locale,
          title: row.title,
        })),
        parentId: category.parentId,
        requiresSizes: category.requiresSizes || false,
        imageUrl: this.extractImageUrl(category.media),
        published: Boolean(category.published),
      },
    };
  }

  /**
   * Get category by ID with children
   */
  async getCategoryById(categoryId: string) {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        translations: true,
        children: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    const translations = Array.isArray(category.translations) ? category.translations : [];
    const translation = pickLocalizedText(translations, "hy", (row) => row.title);

    return {
      id: category.id,
      title: translation?.title || "",
      slug: translation?.slug || "",
      translations: translations.map((row) => ({
        locale: row.locale,
        title: row.title,
      })),
      parentId: category.parentId,
      requiresSizes: category.requiresSizes || false,
      published: Boolean(category.published),
      imageUrl: this.extractImageUrl(category.media),
      children: category.children.map((child: { id: string; parentId: string | null; requiresSizes: boolean | null; translations?: Array<{ title: string; slug: string }> }) => {
        const childTranslations = Array.isArray(child.translations) ? child.translations : [];
        const childTranslation = childTranslations[0] || null;
        return {
          id: child.id,
          title: childTranslation?.title || "",
          slug: childTranslation?.slug || "",
          parentId: child.parentId,
          requiresSizes: child.requiresSizes || false,
        };
      }),
    };
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, data: {
    title?: string;
    slug?: string;
    locale?: string;
    translations?: unknown;
    parentId?: string | null;
    requiresSizes?: boolean;
    subcategoryIds?: string[];
    imageUrl?: string | null;
    published?: boolean;
  }) {
    const locale = data.locale || "en";
    const contentRows = readNamedLocaleRows(data.translations, {
      locale,
      text: data.title,
    });
    
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        translations: true,
      },
    });

    if (!category) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Category not found",
        detail: `Category with id '${categoryId}' does not exist`,
      };
    }

    // Prevent circular reference (category cannot be its own parent)
    if (data.parentId === categoryId) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Invalid parent",
        detail: "Category cannot be its own parent",
      };
    }

    // Prevent setting parent to a child category (would create circular reference)
    if (data.parentId) {
      const potentialParent = await db.category.findUnique({
        where: { id: data.parentId },
        include: {
          children: {
            where: {
              deletedAt: null,
            },
          },
        },
      });

      if (!potentialParent) {
        throw {
          status: 404,
          type: "https://api.shop.am/problems/not-found",
          title: "Parent category not found",
          detail: `Parent category with id '${data.parentId}' does not exist`,
        };
      }

      // Check if the category to update is in the children of the potential parent
      const isChild = await this.isCategoryDescendant(categoryId, potentialParent.id);
      if (isChild) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/bad-request",
          title: "Circular reference",
          detail: "Cannot set parent to a category that is a descendant of this category",
        };
      }
    }

    // Update subcategories if provided
    if (data.subcategoryIds !== undefined) {
      const validSubcategoryIds = data.subcategoryIds.filter(id => id !== categoryId);

      // An ancestor of this category cannot become its subcategory
      for (const subId of validSubcategoryIds) {
        const isAncestor = await this.isCategoryDescendant(subId, categoryId);
        if (isAncestor) {
          throw {
            status: 400,
            type: "https://api.shop.am/problems/bad-request",
            title: "Circular reference",
            detail: "Cannot set an ancestor category as subcategory",
          };
        }
      }

      await db.category.updateMany({
        where: { parentId: categoryId },
        data: { parentId: null },
      });

      if (validSubcategoryIds.length > 0) {
        await db.category.updateMany({
          where: {
            id: { in: validSubcategoryIds },
          },
          data: { parentId: categoryId },
        });
      }
    }

    const updateData: any = {};
    
    if (data.parentId !== undefined) {
      updateData.parentId = data.parentId || null;
    }
    
    if (data.requiresSizes !== undefined) {
      updateData.requiresSizes = data.requiresSizes;
    }

    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    if (data.imageUrl !== undefined) {
      const imageUrl = await resolveAdminImageReference(data.imageUrl, R2_IMAGE_FOLDERS.categories);
      updateData.media = imageUrl
        ? [{ type: "image", url: imageUrl }]
        : [];
    }

    if (contentRows.length > 0) {
      const existingSlug = category.translations[0]?.slug;
      const slug = await reserveSharedSlug(
        data.slug || existingSlug || contentRows[0].text,
        contentRows.map((row) => row.locale),
        categoryId,
      );
      await saveCategoryLocaleRows(categoryId, contentRows, slug);
    }

    // Update category base data
    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        translations: true,
      },
    });

    const categoryTranslations = Array.isArray(updatedCategory.translations) ? updatedCategory.translations : [];
    const translation = pickLocalizedText(categoryTranslations, "hy", (row) => row.title);

    return {
      data: {
        id: updatedCategory.id,
        title: translation?.title || "",
        slug: translation?.slug || "",
        translations: categoryTranslations.map((row) => ({
          locale: row.locale,
          title: row.title,
        })),
        parentId: updatedCategory.parentId,
        requiresSizes: updatedCategory.requiresSizes || false,
        published: Boolean(updatedCategory.published),
        imageUrl: this.extractImageUrl(updatedCategory.media),
      },
    };
  }

  /**
   * Reorder sibling categories (same parentId) — drives /products category strip order.
   */
  async reorderCategories(data: { parentId: string | null; orderedIds: string[] }) {
    const siblings = await db.category.findMany({
      where: {
        parentId: data.parentId,
        deletedAt: null,
      },
      select: { id: true },
      orderBy: { position: "asc" },
    });

    const siblingIds = siblings.map((row) => row.id);
    const orderedSet = new Set(data.orderedIds);
    const hasValidIds =
      data.orderedIds.length === siblingIds.length &&
      siblingIds.every((id) => orderedSet.has(id));

    if (!hasValidIds) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Invalid reorder payload",
        detail: "orderedIds must include every sibling category exactly once",
      };
    }

    await db.$transaction(
      data.orderedIds.map((id, index) =>
        db.category.update({
          where: { id },
          data: { position: index },
        }),
      ),
    );

    logger.info("Category sibling order updated", {
      parentId: data.parentId,
      count: data.orderedIds.length,
    });

    return { success: true };
  }

  /**
   * Helper function to check if a category is a descendant of another category
   */
  private async isCategoryDescendant(ancestorId: string, descendantId: string, visited: Set<string> = new Set()): Promise<boolean> {
    if (visited.has(descendantId)) {
      // Circular reference detected
      return false;
    }
    visited.add(descendantId);

    const category = await db.category.findUnique({
      where: { id: descendantId },
      include: {
        parent: true,
      },
    });

    if (!category || !category.parent) {
      return false;
    }

    if (category.parent.id === ancestorId) {
      return true;
    }

    return this.isCategoryDescendant(ancestorId, category.parent.id, visited);
  }

  /**
   * Delete category (soft delete)
   */
  async deleteCategory(categoryId: string) {
    logger.debug('🗑️ [ADMIN SERVICE] deleteCategory called:', categoryId);
    
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!category) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Category not found",
        detail: `Category with id '${categoryId}' does not exist`,
      };
    }

    // Check if category has children
    const childrenCount = category.children ? category.children.length : 0;
    if (childrenCount > 0) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/bad-request",
        title: "Cannot delete category",
        detail: `This category has ${childrenCount} child categor${childrenCount > 1 ? 'ies' : 'y'}. Please delete or move child categories first.`,
        childrenCount,
      };
    }

    await this.detachCategoryFromProducts(categoryId);

    await db.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
        published: false,
      },
    });

    logger.debug('✅ [ADMIN SERVICE] Category deleted:', categoryId);
    return { success: true };
  }
}

export const adminCategoriesService = new AdminCategoriesService();



