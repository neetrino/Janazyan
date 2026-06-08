const GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4';
const PAGE_CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

/**
 * Main column placeholder while product list streams in.
 */
export function ProductsCatalogMainSkeleton() {
  return (
    <div className="flex-1 min-w-0 w-full animate-pulse" aria-busy="true" aria-label="Loading products">
      <div className={`${PAGE_CONTAINER} py-4`}>
        <div className={GRID}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="aspect-square bg-neutral-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-4/5" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
                <div className="h-5 bg-neutral-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use ProductsCatalogMainSkeleton */
export const ProductsCatalogSkeleton = ProductsCatalogMainSkeleton;
