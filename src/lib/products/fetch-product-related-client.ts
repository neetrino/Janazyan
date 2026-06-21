import { apiClient } from '@/lib/api-client';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import type { LanguageCode } from '@/lib/language';
import type { RelatedCardPayload } from '@/lib/services/products-slug/product-related-transform';

export type RelatedProductCard = RelatedCardPayload;

type RelatedResponse = {
  data: RelatedProductCard[];
  meta: { total: number };
};

export function fetchProductRelatedClient(
  productSlug: string,
  language: LanguageCode,
): Promise<RelatedResponse> {
  const encoded = encodeURIComponent(productSlug.trim());
  const url = `/api/v1/products/${encoded}/related?lang=${language}`;
  return dedupeInFlight(`product-related-client:${url}`, () =>
    apiClient.get<RelatedResponse>(url),
  );
}
