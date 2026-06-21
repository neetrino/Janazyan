import type { LanguageCode } from '@/lib/language';
import {
  fetchProductPageProduct,
  fetchProductPageReviewsBySlug,
} from '@/lib/products/product-page-cache';
import { getProductRelatedCached } from '@/lib/products/load-product-related-cached';
import { prepareProductPageClientPayload } from '@/lib/products/strip-product-rsc-media';
import { ProductPageClient } from './ProductPageClient';

type ProductPageServerProps = {
  slug: string;
  variantIdFromUrl: string | null;
  language: LanguageCode;
};

/**
 * Server PDP segment — product + reviews fetched on the server for initial HTML.
 */
export async function ProductPageServer({
  slug,
  variantIdFromUrl,
  language,
}: ProductPageServerProps) {
  const [product, relatedResult, reviews] = await Promise.all([
    fetchProductPageProduct(slug, language),
    getProductRelatedCached(slug, language),
    fetchProductPageReviewsBySlug(slug, language),
  ]);
  const clientPayload = prepareProductPageClientPayload(product);
  const initialRelated = relatedResult.data.filter(
    (item) => item.id !== product?.id && item.slug.length > 0,
  ).slice(0, 10);

  return (
    <ProductPageClient
      slug={slug}
      variantIdFromUrl={variantIdFromUrl}
      language={language}
      initialProduct={clientPayload.product}
      initialNotFound={!product}
      initialReviews={reviews}
      galleryHydrationRequired={clientPayload.galleryHydrationRequired}
      initialRelated={initialRelated}
    />
  );
}
