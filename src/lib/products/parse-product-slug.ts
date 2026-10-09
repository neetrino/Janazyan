import { decodeSlugParam } from '@/lib/utils/slug';

export interface ParsedProductSlug {
  slug: string;
  variantIdFromUrl: string | null;
}

/** Split `/products/foo` or `/products/foo:variantId` route param. */
export function parseProductSlugParam(rawSlug: string): ParsedProductSlug {
  const decoded = decodeSlugParam(rawSlug);
  const slugParts = decoded.includes(':') ? decoded.split(':') : [decoded];
  return {
    slug: slugParts[0] ?? '',
    variantIdFromUrl: slugParts.length > 1 ? (slugParts[1] ?? null) : null,
  };
}
