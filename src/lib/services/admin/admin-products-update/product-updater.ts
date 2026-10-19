import { Prisma } from "@white-shop/db";
import { logger } from "../../../utils/logger";
import { cleanImageUrls, separateMainAndVariantImages, smartSplitUrls } from "../../../utils/image-utils";
import { resolveProductContentRows } from "@/lib/products/product-translations";
import { saveProductContentTranslations } from "../save-product-translations";
import type { UpdateProductData } from "./types";

/**
 * Collect variant images from data or existing variants
 */
export async function collectVariantImages(
  variants: UpdateProductData['variants'],
  productId: string,
  tx: Prisma.TransactionClient
): Promise<string[]> {
  const allVariantImages: string[] = [];
  
  if (variants !== undefined) {
    variants.forEach((variant) => {
      if (variant.imageUrl) {
        const urls = smartSplitUrls(variant.imageUrl);
        allVariantImages.push(...urls);
      }
    });
  } else {
    // If variants not being updated, get existing variant images
    const existingVariants = await tx.productVariant.findMany({
      where: { productId },
      select: { imageUrl: true },
    });
    existingVariants.forEach((variant) => {
      if (variant.imageUrl) {
        const urls = smartSplitUrls(variant.imageUrl);
        allVariantImages.push(...urls);
      }
    });
  }
  
  return allVariantImages;
}

/**
 * Build product update data
 */
export function buildProductUpdateData(
  data: UpdateProductData,
  allVariantImages: string[],
  existing: { publishedAt: Date | null }
): {
  primaryCategoryId?: string | null;
  categoryIds?: string[];
  categories?: Prisma.ProductUpdateInput["categories"];
  media?: string[];
  published?: boolean;
  publishedAt?: Date;
  featured?: boolean;
} {
  const updateData: {
    primaryCategoryId?: string | null;
    categoryIds?: string[];
    categories?: Prisma.ProductUpdateInput["categories"];
    media?: string[];
    published?: boolean;
    publishedAt?: Date;
    featured?: boolean;
  } = {};
  
  if (data.primaryCategoryId !== undefined) updateData.primaryCategoryId = data.primaryCategoryId || null;
  if (data.categoryIds !== undefined) {
    const nextCategoryIds = data.categoryIds || [];
    updateData.categoryIds = nextCategoryIds;
    updateData.categories = {
      set: nextCategoryIds.map((id) => ({ id })),
    };
  }
  
  if (data.media !== undefined) {
    // Separate main images from variant images and clean them
    const { main } = separateMainAndVariantImages(
      data.media as Array<string | { url?: string; src?: string; value?: string }>,
      allVariantImages
    );
    updateData.media = cleanImageUrls(main);
    logger.debug('Updated main media', { count: updateData.media.length, variantImagesExcluded: allVariantImages.length });
  }
  
  if (data.published !== undefined) {
    updateData.published = data.published;
    if (data.published && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  
  if (data.featured !== undefined) updateData.featured = data.featured;
  
  return updateData;
}

/**
 * Save one language or the full hy/en/ru set.
 * Blank languages are removed. Description is not copied across locales.
 */
export async function updateProductTranslation(
  productId: string,
  data: UpdateProductData,
  tx: Prisma.TransactionClient
) {
  const rows = resolveProductContentRows(data);
  if (rows.length === 0) {
    return;
  }
  await saveProductContentTranslations(tx, productId, rows);
}

/**
 * Update product labels
 */
export async function updateProductLabels(
  productId: string,
  labels: UpdateProductData['labels'],
  tx: Prisma.TransactionClient
) {
  if (labels !== undefined) {
    await tx.productLabel.deleteMany({ where: { productId } });
    if (labels.length > 0) {
      await tx.productLabel.createMany({
        data: labels.map((label) => ({
          productId,
          type: label.type,
          value: label.value,
          position: label.position,
          color: label.color || undefined,
        })),
      });
    }
  }
}

/**
 * Update product attributes
 */
export async function updateProductAttributes(
  productId: string,
  attributeIds: UpdateProductData['attributeIds'],
  tx: Prisma.TransactionClient
) {
  if (attributeIds !== undefined) {
    await tx.productAttribute.deleteMany({ where: { productId } });
    if (attributeIds.length > 0) {
      await tx.productAttribute.createMany({
        data: attributeIds.map((attributeId) => ({
          productId,
          attributeId,
        })),
        skipDuplicates: true,
      });
      logger.info('Updated ProductAttribute relations', { attributeIds });
    }
  }
}

