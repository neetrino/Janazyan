"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Maximize2 } from "lucide-react";
import { ProductLabels } from "../../../components/ProductLabels";
import { ProductImagePlaceholder } from "../../../components/ProductImagePlaceholder";
import { t } from "../../../lib/i18n";
import type { LanguageCode } from "../../../lib/language";
import type { Product } from "./types";
import {
  PDP_GALLERY_MAIN_IMAGE_INSET_CLASS,
  PDP_GALLERY_MAIN_PANEL_CLASS,
  PDP_GALLERY_MAIN_PADDING_CLASS,
  PDP_GALLERY_ZOOM_BUTTON_CLASS,
} from "./product-gallery.constants";

const PDP_MAIN_IMAGE_SIZES = "(max-width: 1024px) 100vw, 55vw";

interface ProductImageGalleryProps {
  images: string[];
  product: Product;
  discountPercent: number | null;
  language: LanguageCode;
  currentImageIndex: number;
  onImageIndexChange: (index: number) => void;
  thumbnailStartIndex: number;
  onThumbnailStartIndexChange: (index: number) => void;
  /** LCP: prioritize only the first above-the-fold hero image. */
  mainImagePriority?: boolean;
}

const THUMBNAILS_PER_VIEW = 7;

export function ProductImageGallery({
  images,
  product,
  discountPercent,
  language,
  currentImageIndex,
  onImageIndexChange,
  thumbnailStartIndex,
  onThumbnailStartIndexChange,
  mainImagePriority = false,
}: ProductImageGalleryProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const markFailed = (index: number) => {
    setFailedIndices((prev) => new Set(prev).add(index));
  };

  const mainImageFailed = failedIndices.has(currentImageIndex);
  const currentSrc = images[currentImageIndex];

  // Auto-scroll thumbnails to show selected image
  useEffect(() => {
    if (images.length > THUMBNAILS_PER_VIEW) {
      if (currentImageIndex < thumbnailStartIndex) {
        // Selected image is above visible range - scroll up
        onThumbnailStartIndexChange(currentImageIndex);
      } else if (currentImageIndex >= thumbnailStartIndex + THUMBNAILS_PER_VIEW) {
        // Selected image is below visible range - scroll down
        onThumbnailStartIndexChange(currentImageIndex - THUMBNAILS_PER_VIEW + 1);
      }
    }
  }, [currentImageIndex, images.length, thumbnailStartIndex, onThumbnailStartIndexChange]);

  // Show only 3 thumbnails at a time, scrollable with navigation arrows
  const visibleThumbnails = images.slice(thumbnailStartIndex, thumbnailStartIndex + THUMBNAILS_PER_VIEW);

  return (
    <>
      <div className="space-y-4">
        <div className="min-w-0">
          <div
            data-product-fly-origin
            className={`group overflow-visible ${PDP_GALLERY_MAIN_PANEL_CLASS} ${PDP_GALLERY_MAIN_PADDING_CLASS}`}
          >
          <div className={PDP_GALLERY_MAIN_IMAGE_INSET_CLASS}>
          {images.length > 0 && !mainImageFailed && currentSrc ? (
            <Image
              src={currentSrc}
              alt={product.title}
              fill
              className="object-contain object-[center_42%] -translate-y-10 transition-transform duration-500 group-hover:scale-[1.03] sm:-translate-y-16"
              sizes={PDP_MAIN_IMAGE_SIZES}
              priority={mainImagePriority}
              unoptimized
              onError={() => markFailed(currentImageIndex)}
            />
          ) : (
            <ProductImagePlaceholder
              className="h-full w-full"
              aria-label={t(language, "common.messages.noImage")}
            />
          )}
          </div>
          
          {/* Discount Badge on Image - Blue circle in top-right */}
          {discountPercent && (
            <div className="absolute right-5 top-5 z-10 flex size-14 items-center justify-center rounded-full bg-sky-deep text-sm font-bold text-white shadow-[0_4px_14px_rgba(147,182,227,0.45)]">
              -{discountPercent}%
            </div>
          )}

          {product.labels && <ProductLabels labels={product.labels} variant="pdp" />}
          
          {/* Control Buttons - Bottom left */}
          <div className="absolute bottom-20 left-5 z-10 flex flex-col gap-3 sm:bottom-24">
            {/* Fullscreen Button */}
            <button 
              onClick={() => setShowZoom(true)} 
              className={PDP_GALLERY_ZOOM_BUTTON_CLASS}
              aria-label={t(language, 'common.ariaLabels.fullscreenImage')}
            >
              <Maximize2 className="size-5" strokeWidth={2.25} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-3 z-20 px-3 sm:bottom-4 sm:px-5">
            <div className="flex items-center gap-2 sm:gap-3">
              {images.length > THUMBNAILS_PER_VIEW && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newStart = Math.max(0, thumbnailStartIndex - 1);
                    onThumbnailStartIndexChange(newStart);
                    if (currentImageIndex > newStart + THUMBNAILS_PER_VIEW - 1) {
                      onImageIndexChange(newStart + THUMBNAILS_PER_VIEW - 1);
                    } else if (currentImageIndex < newStart) {
                      onImageIndexChange(newStart);
                    }
                  }}
                  disabled={thumbnailStartIndex <= 0}
                  className="flex size-8 shrink-0 items-center justify-center text-ink-700 transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 sm:size-9"
                  aria-label={t(language, 'common.ariaLabels.previousThumbnail')}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
              )}

              <div className="grid flex-1 grid-cols-7 gap-2 sm:gap-3">
                {visibleThumbnails.map((image, index) => {
                  const actualIndex = thumbnailStartIndex + index;
                  const isActive = actualIndex === currentImageIndex;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => onImageIndexChange(actualIndex)}
                      className="relative flex h-14 items-center justify-center overflow-hidden rounded-lg bg-transparent sm:h-16"
                      aria-pressed={isActive}
                    >
                      {failedIndices.has(actualIndex) ? (
                        <ProductImagePlaceholder className="h-full w-full" aria-label="" />
                      ) : (
                        <img
                          src={image}
                          alt=""
                          className={`h-full w-auto max-w-full object-contain transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                          }`}
                          loading="lazy"
                          decoding="async"
                          onError={() => markFailed(actualIndex)}
                        />
                      )}
                      <span
                        className={`absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-ink-700 transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {images.length > THUMBNAILS_PER_VIEW && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newStart = Math.min(images.length - THUMBNAILS_PER_VIEW, thumbnailStartIndex + 1);
                    onThumbnailStartIndexChange(newStart);
                    if (currentImageIndex < newStart) {
                      onImageIndexChange(newStart);
                    } else if (currentImageIndex > newStart + THUMBNAILS_PER_VIEW - 1) {
                      onImageIndexChange(newStart + THUMBNAILS_PER_VIEW - 1);
                    }
                  }}
                  disabled={thumbnailStartIndex >= images.length - THUMBNAILS_PER_VIEW}
                  className="flex size-8 shrink-0 items-center justify-center text-ink-700 transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 sm:size-9"
                  aria-label={t(language, 'common.ariaLabels.nextThumbnail')}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && images.length > 0 && !failedIndices.has(currentImageIndex) && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setShowZoom(false)}>
          <img src={currentSrc} alt="" className="max-w-full max-h-full object-contain" />
          <button 
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label={t(language, 'common.buttons.close')}
            onClick={(e) => {
              e.stopPropagation();
              setShowZoom(false);
            }}
          >
            {t(language, 'common.buttons.close')}
          </button>
        </div>
      )}
    </>
  );
}
