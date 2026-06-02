'use client';

import { useState, useEffect } from 'react';
import { getStoredLanguage, type LanguageCode } from '../lib/language';
import { t } from '../lib/i18n';
import { useRelatedProducts } from './hooks/useRelatedProducts';
import { useCarousel } from './hooks/useCarousel';
import { useVisibleCards } from './hooks/useVisibleCards';
import { FeaturedProductCardSlot } from './home/FeaturedProductCardSlot';
import { mapToHomeFeaturedProduct } from '../lib/home/map-to-home-featured-product';
import { CarouselNavigation } from './RelatedProducts/CarouselNavigation';
import { CarouselDots } from './RelatedProducts/CarouselDots';

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
  /** PDP: use dedicated related endpoint + cache (server resolves category). */
  productSlug?: string;
}

/**
 * RelatedProducts component - displays products from the same category in a carousel
 * Shown at the bottom of the single product page
 */
export function RelatedProducts({ categorySlug, currentProductId, productSlug }: RelatedProductsProps) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const visibleCards = useVisibleCards();
  const { products, loading } = useRelatedProducts({
    categorySlug,
    currentProductId,
    language,
    productSlug,
  });

  const {
    currentIndex,
    isDragging,
    hasMoved,
    carouselRef,
    goToPrevious,
    goToNext,
    goToIndex,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  } = useCarousel({ itemCount: products.length, visibleItems: visibleCards });

  useEffect(() => {
    setLanguage(getStoredLanguage());

    const handleLanguageUpdate = () => {
      setLanguage(getStoredLanguage());
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);

  return (
    <section className="py-12 mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">{t(language, 'product.related_products_title')}</h2>

        {loading ? (
          <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[347px] w-[283px] max-w-full animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t(language, 'product.noRelatedProducts')}</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={carouselRef}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              <div
                className="flex items-start"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
                }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex shrink-0 justify-center overflow-visible px-2"
                    style={{ width: `${100 / visibleCards}%` }}
                    onClickCapture={(e) => {
                      if (hasMoved) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <FeaturedProductCardSlot
                      product={mapToHomeFeaturedProduct({
                        id: product.id,
                        slug: product.slug,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        inStock: product.inStock,
                        compareAtPrice: product.compareAtPrice,
                        originalPrice: product.originalPrice,
                        discountPercent: product.discountPercent,
                        brand: product.brand,
                        categories: product.categories,
                      })}
                      scale="carousel"
                    />
                  </div>
                ))}
              </div>
            </div>

            {products.length > visibleCards && (
              <CarouselNavigation onPrevious={goToPrevious} onNext={goToNext} />
            )}

            {products.length > visibleCards && (
              <CarouselDots
                totalItems={products.length}
                visibleItems={visibleCards}
                currentIndex={currentIndex}
                onDotClick={goToIndex}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
