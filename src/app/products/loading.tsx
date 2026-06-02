import { ProductsCatalogSkeleton } from './ProductsCatalogSkeleton';

export default function ProductsLoading() {
  return (
    <div className="w-full max-w-full">
      <div className="border-b border-black/5 py-3 sm:py-4 md:py-6 w-full animate-pulse">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 w-20 shrink-0 rounded-full bg-neutral-200" />
          ))}
        </div>
      </div>
      <ProductsCatalogSkeleton />
    </div>
  );
}
