import type { Product } from '../../app/products/[slug]/types';
import type { HomeFeaturedProduct } from '../home/featured-products-data';
import type { WishlistProductSnapshot } from './wishlist-types';

type CatalogProductInput = {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  brand?: { id: string; name: string } | null;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
};

function resolveProductImage(
  media: Product['media'] | undefined,
): string | null {
  if (!media || media.length === 0) {
    return null;
  }

  const first = media[0];
  if (typeof first === 'string') {
    return first;
  }

  return first.url ?? null;
}

function buildSnapshot(input: CatalogProductInput): WishlistProductSnapshot {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    price: input.price,
    originalPrice: input.originalPrice ?? null,
    compareAtPrice: input.compareAtPrice ?? null,
    discountPercent: input.discountPercent ?? null,
    image: input.image,
    inStock: input.inStock,
    defaultVariantId: input.defaultVariantId ?? null,
    brand: input.brand ?? null,
  };
}

/** Builds a snapshot from a catalog / product card shape. */
export function snapshotFromCatalogProduct(
  product: CatalogProductInput,
): WishlistProductSnapshot {
  return buildSnapshot(product);
}

/** Builds a snapshot from a home featured card. */
export function snapshotFromFeaturedProduct(
  product: HomeFeaturedProduct,
): WishlistProductSnapshot {
  return buildSnapshot({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    image: product.image,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId,
    originalPrice: product.comparePriceUsd,
    compareAtPrice: product.comparePriceUsd,
  });
}

type ProductPageSnapshotInput = {
  product: Product;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
  inStock: boolean;
  defaultVariantId: string | null;
};

/** Builds a snapshot from the product detail page state. */
export function snapshotFromProductPage(
  input: ProductPageSnapshotInput,
): WishlistProductSnapshot {
  return buildSnapshot({
    id: input.product.id,
    slug: input.product.slug,
    title: input.product.title,
    price: input.price,
    image: resolveProductImage(input.product.media),
    inStock: input.inStock,
    defaultVariantId: input.defaultVariantId,
    brand: input.product.brand
      ? { id: input.product.brand.id, name: input.product.brand.name }
      : null,
    originalPrice: input.originalPrice,
    compareAtPrice: input.compareAtPrice,
    discountPercent: input.discountPercent,
  });
}
