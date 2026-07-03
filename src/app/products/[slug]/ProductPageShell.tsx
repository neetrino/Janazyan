'use client';

import { ProductInfoColumnSkeleton } from './ProductInfoColumnSkeleton';
import {
  PDP_GALLERY_MAIN_IMAGE_INSET_CLASS,
  PDP_GALLERY_MAIN_PANEL_CLASS,
  PDP_GALLERY_MAIN_PADDING_CLASS,
  PDP_GALLERY_THUMB_WIDTH_CLASS,
} from './product-gallery.constants';
import {
  PDP_ACTION_ROW_CLASS,
  PDP_ADD_TO_CART_CLASS,
  PDP_GLASS_ICON_BUTTON_CLASS,
  PDP_QTY_GLASS_CAPSULE_CLASS,
  PDP_QTY_STEP_BUTTON_CLASS,
  PDP_QTY_VALUE_CLASS,
  PDP_REVIEWS_BUTTON_CLASS,
} from './product-action-bar.constants';
import { Heart } from 'lucide-react';
import type { ProductPageSnapshot } from '@/lib/products/product-page-snapshot';
import { formatPrice } from '@/lib/currency';
import { useCurrency } from '@/components/hooks/useCurrency';

type SnapshotRatingRowProps = {
  averageRating: number;
  reviewsCount: number;
};

function SnapshotRatingRow({ averageRating, reviewsCount }: SnapshotRatingRowProps) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <div className="relative h-7 w-7 shrink-0" aria-hidden>
        <svg className="absolute inset-0 h-7 w-7 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div className="absolute left-0 top-0 bottom-0 overflow-hidden" style={{ width: '100%' }}>
          <svg className="h-7 w-7 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-900 tabular-nums">{averageRating.toFixed(1)}</span>
      <div className={PDP_REVIEWS_BUTTON_CLASS}>
        {reviewsCount} reviews
      </div>
    </div>
  );
}

/**
 * Initial PDP skeleton before first visual payload (stable min-height to limit CLS).
 */
type ProductPageShellProps = {
  snapshot?: ProductPageSnapshot | null;
};

export function ProductPageShell({ snapshot = null }: ProductPageShellProps) {
  const currency = useCurrency();
  const hasSnapshotImage = Boolean(snapshot?.image);
  const snapshotThumbs = (
    snapshot?.previewImages?.filter((image): image is string => Boolean(image)) ??
    []
  ).slice(0, 3);
  const fallbackThumbs = snapshot?.image ? [snapshot.image] : [];
  const thumbsToRender = snapshotThumbs.length > 0 ? snapshotThumbs : fallbackThumbs;
  const snapshotRating = Math.max(0, Math.min(5, snapshot?.averageRating ?? 5));
  const snapshotReviewsCount = Math.max(0, snapshot?.reviewsCount ?? 0);
  const snapshotDescription = snapshot?.descriptionPreview?.trim() ?? '';
  const shouldReserveVariantSpace = snapshot?.hasVariantSelectors !== false;
  const hasSnapshotPricing =
    Boolean(snapshot?.originalPrice && snapshot.originalPrice > snapshot.price) ||
    Boolean(snapshot?.compareAtPrice && snapshot.compareAtPrice > snapshot.price);
  const snapshotOldPrice =
    snapshot?.originalPrice && snapshot.originalPrice > snapshot.price
      ? snapshot.originalPrice
      : snapshot?.compareAtPrice ?? null;
  return (
    <div
      className="w-full"
      aria-busy="true"
      aria-label="Product loading"
    >
      <div className="max-w-7xl mx-auto py-4 lg:px-8 lg:py-12 min-h-[min(100dvh,720px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-start">
          <div className="flex items-start gap-5 lg:gap-6">
            <div className={`flex shrink-0 flex-col gap-3 ${PDP_GALLERY_THUMB_WIDTH_CLASS}`} aria-hidden>
              {thumbsToRender.map((thumbSrc, index) => (
                <div
                  key={`${thumbSrc}-${index}`}
                  className="aspect-square w-full overflow-hidden rounded-[20px] border border-sky-mist/80 bg-white"
                >
                  <img
                    src={thumbSrc}
                    alt=""
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`${PDP_GALLERY_MAIN_PANEL_CLASS} ${PDP_GALLERY_MAIN_PADDING_CLASS} w-full max-w-[560px] mx-auto lg:mx-0`}
                aria-hidden
              >
                <div className={PDP_GALLERY_MAIN_IMAGE_INSET_CLASS}>
                  {hasSnapshotImage ? (
                    <img
                      src={snapshot?.image ?? ''}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 ${
                      hasSnapshotImage ? 'bg-white/5' : 'animate-pulse bg-sky-mist/60'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            {snapshot ? (
              <div
                className="flex h-full flex-col pt-0 lg:min-h-[526px]"
                aria-busy="true"
                aria-label="Product snapshot loading"
              >
                <div className="flex-1">
                  <p className="mb-2 line-clamp-2 text-4xl font-bold text-gray-900">
                    {snapshot.title}
                  </p>
                  <SnapshotRatingRow averageRating={snapshotRating} reviewsCount={snapshotReviewsCount} />
                  <div className="mb-6 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-gray-900">
                        {formatPrice(snapshot.price, currency)}
                      </p>
                      {snapshot.discountPercent && snapshot.discountPercent > 0 ? (
                        <span className="text-lg font-semibold text-blue-600">
                          -{snapshot.discountPercent}%
                        </span>
                      ) : null}
                    </div>
                    {hasSnapshotPricing && snapshotOldPrice ? (
                      <p className="text-xl text-gray-500 line-through decoration-gray-400">
                        {formatPrice(snapshotOldPrice, currency)}
                      </p>
                    ) : null}
                  </div>
                  {snapshotDescription ? (
                    <p className="mb-8 min-h-[72px] line-clamp-3 text-sm text-gray-600">
                      {snapshotDescription}
                    </p>
                  ) : (
                    <div className="mb-8 min-h-[72px] rounded-lg bg-sky-mist/45" aria-hidden />
                  )}
                  {shouldReserveVariantSpace ? (
                    <div className="mb-8 lg:min-h-[188px]" aria-hidden />
                  ) : null}
                </div>
                <div className="pt-0 lg:-translate-y-[6px]">
                  <div className="flex flex-col gap-4 lg:gap-0">
                    <div className={PDP_ACTION_ROW_CLASS}>
                      <div className={PDP_QTY_GLASS_CAPSULE_CLASS}>
                        <button type="button" className={PDP_QTY_STEP_BUTTON_CLASS} disabled>
                          −
                        </button>
                        <span className={PDP_QTY_VALUE_CLASS}>1</span>
                        <button type="button" className={PDP_QTY_STEP_BUTTON_CLASS} disabled>
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={`${PDP_ADD_TO_CART_CLASS} cursor-default pointer-events-none !bg-primary !text-white`}
                        aria-disabled="true"
                      >
                        Add To Cart
                      </button>
                      <div className="flex shrink-0 items-center">
                        <button type="button" className={PDP_GLASS_ICON_BUTTON_CLASS} disabled aria-label="Wishlist">
                          <Heart />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ProductInfoColumnSkeleton />
            )}
          </div>
        </div>
      </div>
      <section className="mt-24 w-full border-t border-gray-200 py-12" aria-hidden>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 h-9 w-64 animate-pulse rounded-lg bg-sky-mist/60" />
        </div>
        <div className="grid w-full grid-cols-2 justify-items-center gap-x-1 gap-y-10 px-4 sm:gap-x-12 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4 xl:gap-x-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[238px] w-[164px] max-w-full animate-pulse rounded-lg bg-sky-mist/60 sm:h-[347px] sm:w-[283px]"
            />
          ))}
        </div>
      </section>
      <div className="mx-auto max-w-7xl border-t border-gray-200 px-4 py-12 sm:px-6 lg:px-8" aria-hidden>
        <div className="mb-6 h-9 w-48 animate-pulse rounded-lg bg-sky-mist/60" />
        <div className="h-24 animate-pulse rounded-lg bg-sky-mist/45" />
      </div>
    </div>
  );
}
