/**
 * Shared storefront cache TTLs and Redis key builders — safe for client + server imports.
 */
export const STOREFRONT_CACHE_TTL = {
  categoriesTree: 300,
  categoryBySlug: 300,
  navigationPreviews: 180,
  currencyRates: 180,
  productsFilters: 120,
  productsCatalog: 600,
  categoriesNavStrip: 300,
  productVisual: 300,
  productRef: 300,
  productDetails: 300,
  productRelated: 180,
  productReviews: 180,
  blogPosts: 300,
  blogPostBySlug: 300,
  faqPublished: 300,
  partnerStores: 300,
} as const;

export const STOREFRONT_CACHE_KEYS = {
  categoriesTree: (lang: string) => `categories:tree:${lang}`,
  categoryBySlug: (lang: string, slug: string) => `categories:slug:${lang}:${slug}`,
  navigationPreviews: (lang: string) => `categories:navigation-previews:${lang}`,
  currencyRates: () => 'settings:currency-rates',
  productsFilters: (stableQuery: string) => `products:filters:${stableQuery}`,
  productsCatalog: (stableKey: string) => `products:catalog:${stableKey}`,
  categoriesNavStrip: (lang: string) => `categories:nav-strip:${lang}`,
  productVisual: (lang: string, slug: string) => `product:visual:${lang}:${slug}`,
  productRef: (lang: string, slug: string) => `product:ref:${lang}:${slug}`,
  productDetails: (lang: string, slug: string) => `product:details:${lang}:${slug}`,
  productRelated: (lang: string, slug: string) => `product:related:${lang}:${slug}`,
  productReviews: (lang: string, slug: string) => `product:reviews:${lang}:${slug}`,
  blogPosts: (locale: string) => `blog:posts:${locale}`,
  blogPostBySlug: (locale: string, slug: string) => `blog:post:${locale}:${slug}`,
  faqPublished: (locale: string) => `faq:published:${locale}`,
  partnerStores: (locale: string) => `partner-stores:v3:${locale}`,
} as const;

/** Deterministic cache key fragment from URL search params (sorted keys). */
export function stableSearchParamsKey(searchParams: URLSearchParams): string {
  const pairs = Array.from(searchParams.entries()).sort(([a], [b]) => a.localeCompare(b));
  return pairs.map(([k, v]) => `${k}=${v}`).join('&');
}
