'use client';

import { ProductInfoColumnSkeleton } from './ProductInfoColumnSkeleton';
import {
  PDP_GALLERY_MAIN_PANEL_CLASS,
  PDP_GALLERY_THUMB_WIDTH_CLASS,
} from './product-gallery.constants';

/**
 * Initial PDP skeleton before first visual payload (stable min-height to limit CLS).
 */
export function ProductPageShell() {
  return (
    <div className="max-w-7xl mx-auto py-4 lg:px-8 lg:py-12 min-h-[min(100dvh,720px)]"
      aria-busy="true"
      aria-label="Product loading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-start">
        <div className="flex items-start gap-5 lg:gap-6">
          <div className={`flex shrink-0 flex-col gap-3 ${PDP_GALLERY_THUMB_WIDTH_CLASS}`} aria-hidden>
            <div className="aspect-square w-full rounded-[20px] bg-sky-mist/50" />
            <div className="aspect-square w-full rounded-[20px] bg-sky-mist/50" />
            <div className="aspect-square w-full rounded-[20px] bg-sky-mist/50" />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`${PDP_GALLERY_MAIN_PANEL_CLASS} w-full max-w-[560px] mx-auto lg:mx-0`} aria-hidden>
              <div className="absolute inset-0 animate-pulse bg-sky-mist/60" />
            </div>
          </div>
        </div>
        <ProductInfoColumnSkeleton />
      </div>
    </div>
  );
}
