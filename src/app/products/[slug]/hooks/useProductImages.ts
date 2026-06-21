import { useMemo } from 'react';
import {
  processImageUrl,
  smartSplitUrls,
  normalizeUrlForComparison,
  cleanImageUrls,
} from '../../../../lib/utils/image-utils';
import type { Product } from '../types';

function buildImagesFromProduct(product: Product): string[] {
  const mainImages = Array.isArray(product.media) ? product.media : [];
  const cleanedMain = cleanImageUrls(mainImages);
  const variantImages: string[] = [];

  if (product.variants && Array.isArray(product.variants)) {
    const sortedVariants = [...product.variants].sort((a, b) => {
      const aPos = 'position' in a && typeof a.position === 'number' ? a.position : 0;
      const bPos = 'position' in b && typeof b.position === 'number' ? b.position : 0;
      return aPos - bPos;
    });

    sortedVariants.forEach((variant) => {
      if (variant.imageUrl) {
        const urls = smartSplitUrls(variant.imageUrl);
        variantImages.push(...urls);
      }
    });
  }

  const cleanedVariantImages = cleanImageUrls(variantImages);
  const allImages: string[] = [];
  const seenNormalized = new Set<string>();

  cleanedMain.forEach((img) => {
    const processed = processImageUrl(img) || img;
    const normalized = normalizeUrlForComparison(processed);
    if (!seenNormalized.has(normalized)) {
      allImages.push(img);
      seenNormalized.add(normalized);
    }
  });

  cleanedVariantImages.forEach((img) => {
    const processed = processImageUrl(img) || img;
    const normalized = normalizeUrlForComparison(processed);
    if (!seenNormalized.has(normalized)) {
      allImages.push(img);
      seenNormalized.add(normalized);
    }
  });

  return allImages;
}

/**
 * Process and combine product images from media and variants.
 * Optional hydrated gallery overrides deferred RSC media blobs.
 */
export function useProductImages(
  product: Product | null,
  hydratedGalleryUrls?: string[] | null,
): string[] {
  return useMemo(() => {
    if (hydratedGalleryUrls && hydratedGalleryUrls.length > 0) {
      return hydratedGalleryUrls;
    }

    if (hydratedGalleryUrls !== null && hydratedGalleryUrls !== undefined) {
      return hydratedGalleryUrls;
    }

    if (!product) return [];
    return buildImagesFromProduct(product);
  }, [product, hydratedGalleryUrls]);
}
