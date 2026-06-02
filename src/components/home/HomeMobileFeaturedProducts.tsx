import Link from 'next/link';
import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { FeaturedProductCardSlot } from './FeaturedProductCardSlot';

type HomeMobileFeaturedProductsProps = {
  products: HomeFeaturedProduct[];
};

export function HomeMobileFeaturedProducts({
  products,
}: HomeMobileFeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-white">
        <h2 className="text-[16px] font-bold tracking-[-0.01em]">Հայտնի Ապրանքներ</h2>
        <Link
          href="/products?filter=featured"
          className="text-[13px] font-semibold uppercase"
        >
          Բոլորը
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1 justify-items-center">
        {products.slice(0, 4).map((product) => (
          <FeaturedProductCardSlot
            key={product.id}
            product={product}
            scale="mobile-grid"
          />
        ))}
      </div>
    </div>
  );
}

export function HomeMobileFeaturedSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-white/30" />
        <div className="h-4 w-16 rounded bg-white/30" />
      </div>
      <div className="grid grid-cols-2 gap-1 justify-items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative h-[220px] w-full max-w-[170px] overflow-hidden rounded-3xl bg-white/25"
          >
            <div className="absolute inset-x-3 top-3 h-24 rounded-2xl bg-white/30" />
            <div className="absolute inset-x-3 bottom-4 space-y-2">
              <div className="h-3 w-3/4 rounded bg-white/30" />
              <div className="h-3 w-1/2 rounded bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
