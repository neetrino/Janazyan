import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import type { LanguageCode } from '@/lib/language';
import type { ProductVisualPayload } from '@/lib/services/products-slug/product-visual.service';

async function requestProductVisual(
  slug: string,
  lang: LanguageCode,
): Promise<ProductVisualPayload | null> {
  const encoded = encodeURIComponent(slug.trim());
  const params = new URLSearchParams({ lang });
  const response = await fetch(`/api/v1/products/${encoded}/visual?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Product visual fetch failed (${response.status})`);
  }

  return response.json() as Promise<ProductVisualPayload>;
}

/** Client-side visual payload fetch with in-flight dedup per slug/lang. */
export function fetchProductVisualClient(
  slug: string,
  lang: LanguageCode,
): Promise<ProductVisualPayload | null> {
  const key = `product-visual:${lang}:${slug}`;
  return dedupeInFlight(key, () => requestProductVisual(slug, lang));
}
