'use client';



import { useState, useEffect } from 'react';

import { getStoredLanguage, type LanguageCode } from '../lib/language';

import { t } from '../lib/i18n';

import { useRelatedProducts } from './hooks/useRelatedProducts';

import { useCarousel } from './hooks/useCarousel';

import { useVisibleCards } from './hooks/useVisibleCards';

import { FeaturedProductCardSlot } from './home/FeaturedProductCardSlot';

import { mapToHomeFeaturedProduct } from '../lib/home/map-to-home-featured-product';

import { CarouselDots } from './RelatedProducts/CarouselDots';

import type { RelatedCardPayload } from '@/lib/services/products-slug/product-related-transform';



interface RelatedProductsProps {

  categorySlug?: string;

  currentProductId: string;

  productSlug?: string;

  language?: LanguageCode;

  /** SSR-fetched related cards — skips client API waterfall when language matches. */

  initialRelated?: RelatedCardPayload[];

}



/**

 * RelatedProducts component - displays products from the same category in a carousel

 * Shown at the bottom of the single product page

 */

export function RelatedProducts({

  categorySlug,

  currentProductId,

  productSlug,

  language: serverLanguage,

  initialRelated,

}: RelatedProductsProps) {

  const [language, setLanguage] = useState<LanguageCode>(serverLanguage ?? getStoredLanguage());



  const visibleCards = useVisibleCards();

  const { products, loading } = useRelatedProducts({

    categorySlug,

    currentProductId,

    language,

    productSlug,

    initialRelated,

    initialLanguage: serverLanguage,

  });



  const {

    currentIndex,

    isDragging,

    hasMoved,

    carouselRef,

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

    if (serverLanguage) {

      setLanguage(serverLanguage);

    }

  }, [serverLanguage]);



  useEffect(() => {

    const handleLanguageUpdate = () => {

      setLanguage(getStoredLanguage());

    };



    window.addEventListener('language-updated', handleLanguageUpdate);

    return () => {

      window.removeEventListener('language-updated', handleLanguageUpdate);

    };

  }, []);



  return (

    <section className="mt-24 w-full border-t border-gray-200 py-12">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <h2 className="mb-10 whitespace-nowrap text-2xl font-bold text-gray-900 sm:text-3xl">

          {t(language, 'product.related_products_title')}

        </h2>

      </div>



      {loading ? (
        <div className="grid w-full grid-cols-2 justify-items-center gap-x-1 gap-y-10 px-4 sm:gap-x-12 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4 xl:gap-x-10">
          {[1, 2, 3, 4].map((i) => (
            <div

              key={i}

              className="h-[238px] w-[164px] max-w-full animate-pulse rounded-lg bg-gray-200 sm:h-[347px] sm:w-[283px]"

            />

          ))}

        </div>

      ) : products.length === 0 ? (

        <div className="py-12 text-center">

          <p className="text-lg text-gray-500">{t(language, 'product.noRelatedProducts')}</p>

        </div>

      ) : (

        <div className="relative mt-10 w-full">

          <div

            ref={carouselRef}

            className="relative w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"

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

              className="flex w-full items-start"

              style={{

                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,

                transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',

              }}

            >

              {products.map((product) => (

                <div

                  key={product.id}

                  className="flex shrink-0 justify-center overflow-visible"

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

            <CarouselDots

              totalItems={products.length}

              visibleItems={visibleCards}

              currentIndex={currentIndex}

              onDotClick={goToIndex}

            />

          )}

        </div>

      )}

    </section>

  );

}


