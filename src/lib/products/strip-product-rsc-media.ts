import type { Product, ProductVariant } from '@/app/products/[slug]/types';

const DATA_URI_PREFIX = 'data:image/';

function isDataUri(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith(DATA_URI_PREFIX));
}

function stripMediaEntry(entry: unknown): unknown {
  if (typeof entry === 'string') {
    return isDataUri(entry) ? null : entry;
  }

  if (entry && typeof entry === 'object') {
    const record = entry as { url?: string; src?: string; value?: string };
    const url = record.url ?? record.src ?? record.value;
    if (typeof url === 'string' && isDataUri(url)) {
      return null;
    }
  }

  return entry;
}

function stripVariantImageUrl(variant: ProductVariant): ProductVariant {
  if (!variant.imageUrl || !isDataUri(variant.imageUrl)) {
    return variant;
  }

  return { ...variant, imageUrl: undefined };
}

export function productPayloadHasDataUriMedia(product: Product): boolean {
  const media = Array.isArray(product.media) ? product.media : [];
  for (const entry of media) {
    if (typeof entry === 'string' && isDataUri(entry)) {
      return true;
    }
    if (entry && typeof entry === 'object') {
      const record = entry as { url?: string; src?: string; value?: string };
      const url = record.url ?? record.src ?? record.value;
      if (typeof url === 'string' && isDataUri(url)) {
        return true;
      }
    }
  }

  return product.variants.some((variant) => isDataUri(variant.imageUrl));
}

export type ProductPageClientPayload = {
  product: Product | null;
  galleryHydrationRequired: boolean;
};

/**
 * Removes embedded data-URI blobs from the RSC payload while preserving UI fields.
 */
export function prepareProductPageClientPayload(product: Product | null): ProductPageClientPayload {
  if (!product) {
    return { product: null, galleryHydrationRequired: false };
  }

  const galleryHydrationRequired = productPayloadHasDataUriMedia(product);
  if (!galleryHydrationRequired) {
    return { product, galleryHydrationRequired: false };
  }

  const media = Array.isArray(product.media)
    ? product.media.map(stripMediaEntry).filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    : [];

  return {
    product: {
      ...product,
      media,
      variants: product.variants.map(stripVariantImageUrl),
    },
    galleryHydrationRequired: true,
  };
}
