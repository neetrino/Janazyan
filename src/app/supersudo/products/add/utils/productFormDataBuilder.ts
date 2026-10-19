/**
 * Utilities for building product form data
 */

import type { ProductData, Variant, ProductLabel } from '../types';
import type { LanguageCode } from '@/lib/language';
import {
  mergeProductContentTranslations,
  pickProductTranslation,
  type ProductContentTranslation,
} from '@/lib/products/product-translations';

interface FormData {
  title: string;
  slug: string;
  descriptionHtml: string;
  primaryCategoryId: string;
  categoryIds: string[];
  published: boolean;
  featured: boolean;
  imageUrls: string[];
  featuredImageIndex: number;
  mainProductImage: string;
  variants: Variant[];
  labels: ProductLabel[];
  skuSourceLocale: LanguageCode;
  translations: ProductContentTranslation[];
}

/**
 * Builds form data from product data
 */
export function buildFormData(
  product: ProductData,
  normalizedMedia: string[],
  featuredIndexFromApi: number,
  mainProductImage: string,
  mergedVariant: Variant
): FormData {
  const translations = mergeProductContentTranslations(
    product.translations && product.translations.length > 0
      ? product.translations
      : [
          {
            locale: 'en',
            title: product.title,
            slug: product.slug,
            descriptionHtml: product.descriptionHtml,
          },
        ],
  );
  const source = pickProductTranslation(translations, 'hy');
  const skuSourceLocale: LanguageCode =
    source?.title.trim() && source.locale ? source.locale : 'hy';

  return {
    title: source?.title || '',
    slug: source?.slug || '',
    descriptionHtml: source?.descriptionHtml || '',
    skuSourceLocale,
    translations,
    primaryCategoryId: product.primaryCategoryId || '',
    categoryIds: product.categoryIds || [],
    published: product.published || false,
    featured: product.featured || false,
    imageUrls: normalizedMedia,
    featuredImageIndex:
      featuredIndexFromApi >= 0 && featuredIndexFromApi < normalizedMedia.length
        ? featuredIndexFromApi
        : 0,
    mainProductImage:
      normalizedMedia.length > 0 &&
      normalizedMedia[featuredIndexFromApi >= 0 && featuredIndexFromApi < normalizedMedia.length ? featuredIndexFromApi : 0]
        ? normalizedMedia[featuredIndexFromApi >= 0 && featuredIndexFromApi < normalizedMedia.length ? featuredIndexFromApi : 0]
        : mainProductImage || '',
    variants: [mergedVariant],
    labels: (product.labels || []).map((label: any) => ({
      id: label.id || '',
      type: label.type || 'text',
      value: label.value || '',
      position: label.position || 'top-left',
      color: label.color || null,
    })),
  };
}

