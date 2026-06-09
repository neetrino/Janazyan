import { Suspense } from 'react';
import { getHomeFeaturedProducts } from '../../lib/home/featured-products-data';
import { FeaturedProducts } from './FeaturedProducts';
import {
  HomeMobileFeaturedProducts,
  HomeMobileFeaturedSkeleton,
} from './HomeMobileFeaturedProducts';

const DESKTOP_FEATURED_SKELETON_HEIGHT_PX = 400;

function DesktopFeaturedSkeleton() {
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-[1470px] animate-pulse"
      style={{ minHeight: DESKTOP_FEATURED_SKELETON_HEIGHT_PX }}
    >
      <div className="mx-auto mt-16 h-10 w-72 max-w-full rounded bg-white/40" />
      <div className="mx-auto mt-16 flex max-w-[1220px] flex-wrap justify-center gap-[30px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[320px] w-[283px] rounded-[32px] bg-white/35"
          />
        ))}
      </div>
    </div>
  );
}

async function HomeMobileFeaturedContent() {
  const products = await getHomeFeaturedProducts();
  return <HomeMobileFeaturedProducts products={products} />;
}

async function DesktopFeaturedContent() {
  const products = await getHomeFeaturedProducts();
  return <FeaturedProducts products={products} />;
}

export function HomeMobileFeaturedAsync() {
  return (
    <Suspense fallback={<HomeMobileFeaturedSkeleton />}>
      <HomeMobileFeaturedContent />
    </Suspense>
  );
}

export function DesktopFeaturedAsync() {
  return (
    <Suspense fallback={<DesktopFeaturedSkeleton />}>
      <DesktopFeaturedContent />
    </Suspense>
  );
}
