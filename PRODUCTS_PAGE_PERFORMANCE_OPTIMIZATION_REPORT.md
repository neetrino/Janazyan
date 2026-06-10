# Products Page Performance Optimization Report

## What Was Slow Before

- `/products` already used SSR, `Suspense`, Redis-backed catalog caching, `fastCatalog`, and a lightweight DB select.
- The first-load cost was still high because catalog product cards were under a client component boundary.
- Every card hydrated hooks for auth, wishlist, cart, currency, translation, and router behavior.
- Grid mode rendered two full product card trees per product (`lg:hidden` and `lg:flex`) to switch mobile/desktop scale.
- The first 8 product images were marked as priority/eager, which can overload initial network work, especially on mobile.

## Files Changed

- `src/components/ProductsGrid.tsx`
- `src/components/ProductsGridViewMode.client.tsx`
- `src/components/ProductCard.tsx`
- `src/components/home/FeaturedProductCard.tsx`
- `src/components/home/FeaturedProductCardActions.client.tsx`
- `src/components/home/FeaturedProductCardPrice.client.tsx`
- `src/components/home/FeaturedProductCardSlot.tsx`
- `src/app/globals.css`
- `src/lib/cache/products-catalog-redis-cache.ts`
- `shared/db/prisma/schema.prisma`
- `PRODUCTS_PAGE_PERFORMANCE_OPTIMIZATION_REPORT.md`

## What Was Optimized

- Converted the catalog product card visual shell back to server-renderable components.
- Kept only the interactive card pieces as client islands:
  - wishlist button
  - add-to-cart button
  - client currency price display
- Moved view-mode localStorage/event handling into one small grid-level client wrapper instead of hydrating the full grid/card tree.
- Removed duplicated mobile/desktop card DOM in grid mode by using one responsive card slot.
- Reduced catalog image priority count from 8 to 2, matching the likely mobile first row and avoiding unnecessary eager image fetches.
- Added development-only cache hit/miss logging with safe metadata only: provider type, page, limit, language, and whether search/category filters are present.
- Added targeted Prisma indexes for the catalog cold-miss query shape:
  - product publication/deletion/order path
  - published cheapest variant lookup per product

## Why These Changes Help

- Server-rendered card markup reduces JavaScript hydration work on first load.
- Client hooks now hydrate only where interaction is needed, instead of the whole visual card.
- Removing duplicate card trees cuts HTML size, React work, and image/component instances per product.
- Lower image priority keeps bandwidth focused on the likely LCP product image row.
- Cache hit/miss logs make it easier to confirm whether Redis is active or the app is falling back to memory cache.
- The new indexes align with `/products` cold miss behavior: published, non-deleted products ordered by creation date, plus one published lowest-price variant per product.

## Intentionally Not Changed

- No catalog architecture rewrite.
- No changes to product filtering, sorting semantics, wishlist behavior, cart behavior, or auth behavior.
- No new libraries.
- No cache TTL changes; TTL values are product/business freshness decisions and should be adjusted separately if needed.
- No category child-ID cache was added in this phase. It is a good second-phase candidate only if category filtering is confirmed hot.

## Cache Behavior Findings

- `products-catalog-redis-cache.ts` caches catalog responses for 600 seconds through `STOREFRONT_CACHE_TTL.productsCatalog`.
- `products-catalog-cache.ts` also wraps catalog fetches with Next `unstable_cache` at 120 seconds.
- `cache.service.ts` supports Upstash REST Redis, TCP Redis, and memory fallback.
- If Redis env/config is missing or Redis connection fails, the app falls back to in-memory cache. That is useful in a long-lived Node process, but it should not be treated as durable production caching in serverless or frequently recycled runtimes.
- New debug logs do not expose env values or cache keys with user-entered search text.

## DB Cold Miss Findings

- Existing schema already had useful indexes on:
  - `Category.parentId`
  - `Category.published`
  - `Category.deletedAt`
  - `CategoryTranslation.slug, locale`
  - `Product.brandId`
  - `Product.published, publishedAt`
  - `Product.featured`
  - `Product.deletedAt`
  - `ProductTranslation.slug, locale`
  - `ProductVariant.productId`
- Added indexes for the observed catalog query path:
  - `Product.published, deletedAt, createdAt`
  - `Product.primaryCategoryId`
  - `ProductVariant.productId, published, price`
- This repo currently has only Prisma migration metadata in `shared/db/prisma/migrations`; generate/apply the actual migration using the project's Prisma migration workflow.

## Validation Results

- `corepack pnpm lint`: passed.
- `corepack pnpm exec tsc --noEmit`: passed.
- `corepack pnpm run build`: passed.
- Build warning: Turbopack could not find font override values for `Special Gothic Expanded One`; this is unrelated to the `/products` optimization.
- `corepack pnpm test`: passed, 2 files / 15 tests.

## Recommended Second Phase

- Confirm Redis provider in the production-like environment using the new debug logging or an internal health route/admin check.
- Measure `/products` with Lighthouse/WebPageTest before changing TTLs.
- If category-filter traffic is common, cache slug-to-category-tree resolution with clear invalidation through existing category cache invalidation.
- Consider server-rendering the initial AMD price and progressively enhancing to selected currency to reduce even the small price island cost.
