import type { ProductLabel } from '../../components/ProductLabels';
import { formatPrice } from '../currency';
import type { CurrencyCode } from '../currency';
import type { HomeFeaturedProduct } from './featured-products-data';

export const HOME_FEATURED_PRODUCT_FALLBACK_IMAGE = '/figma/featured-product.webp';

export type ProductToFeaturedInput = {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  labels?: ProductLabel[];
  compareAtPrice?: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  brand?: { name: string } | null;
  categories?: Array<{ title: string }>;
};

function formatRatingValue(average: number): string {
  return average % 1 === 0 ? average.toFixed(1) : average.toFixed(1);
}

function resolveCategoryLabel(product: ProductToFeaturedInput): string {
  const categoryTitle = product.categories?.[0]?.title?.trim();
  if (categoryTitle) {
    return categoryTitle;
  }
  const brandName = product.brand?.name?.trim();
  return brandName ?? '';
}

function resolveCompareUsd(product: ProductToFeaturedInput): number | null {
  if (product.originalPrice != null && product.originalPrice > product.price) {
    return product.originalPrice;
  }
  if (
    product.compareAtPrice != null &&
    product.compareAtPrice > product.price
  ) {
    return product.compareAtPrice;
  }
  return null;
}

/**
 * Maps catalog / grid / related product data to the home featured card shape.
 */
export function mapToHomeFeaturedProduct(
  product: ProductToFeaturedInput,
  options?: {
    ratingAverage?: number;
    currency?: CurrencyCode;
  },
): HomeFeaturedProduct {
  const compareUsd = resolveCompareUsd(product);
  const discountPercent = product.discountPercent ?? null;
  const currency = options?.currency ?? 'AMD';
  const ratingAverage = options?.ratingAverage;

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: resolveCategoryLabel(product),
    price: product.price,
    comparePriceUsd: compareUsd,
    priceLabel: formatPrice(product.price, currency),
    comparePriceLabel:
      compareUsd != null ? formatPrice(compareUsd, currency) : null,
    discountLabel:
      discountPercent != null && discountPercent > 0
        ? `-${Math.round(discountPercent)}%`
        : null,
    rating:
      ratingAverage != null && ratingAverage > 0
        ? formatRatingValue(ratingAverage)
        : null,
    image: product.image ?? HOME_FEATURED_PRODUCT_FALLBACK_IMAGE,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId ?? null,
    labels: product.labels ?? [],
  };
}
