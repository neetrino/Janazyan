'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { t } from '../../../lib/i18n';
import { useAuth } from '../../../lib/auth/AuthContext';
import type { LanguageCode } from '../../../lib/language';
import type { Review } from '../../../components/ProductReviews/utils';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductInfoAndActions } from './ProductInfoAndActions';
import { ProductPageShell } from './ProductPageShell';
import { useProductPage } from './useProductPage';
import { playCartFlyAnimation } from '../../../lib/cart-fly-animation';
import type { Product } from './types';
import type { RelatedCardPayload } from '@/lib/services/products-slug/product-related-transform';
import { primeProductPageSnapshot } from '@/lib/products/product-page-snapshot';
import { CART_KEY } from '../../cart/constants';
import { openCartDrawer } from '../../../lib/cart-drawer-events';
import { applyOptimisticAddToSnapshot } from '../../../lib/cart/cart-optimistic';
import { resolveCartCacheScope } from '../../../lib/cart/cart-snapshot-cache';
import { dispatchCartUpdated } from '../../../lib/cart/cart-events';
import { confirmCartMutation, scheduleCartRevalidate } from '../../../lib/cart/cart-revalidate';

const RelatedProducts = dynamic(
  () => import('../../../components/RelatedProducts').then((m) => ({ default: m.RelatedProducts })),
  {
    loading: () => (
      <section className="mt-24 w-full border-t border-gray-200 py-12" aria-hidden>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 h-9 w-64 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="grid w-full grid-cols-2 justify-items-center gap-x-1 gap-y-10 px-4 sm:gap-x-12 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4 xl:gap-x-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[238px] w-[164px] max-w-full animate-pulse rounded-lg bg-gray-200 sm:h-[347px] sm:w-[283px]"
            />
          ))}
        </div>
      </section>
    ),
  },
);

const ProductReviews = dynamic(
  () => import('../../../components/ProductReviews').then((m) => ({ default: m.ProductReviews })),
  {
    loading: () => (
      <div className="mx-auto max-w-7xl border-t border-gray-200 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 h-9 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
      </div>
    ),
  },
);

export interface ProductPageClientProps {
  slug: string;
  variantIdFromUrl: string | null;
  language: LanguageCode;
  initialProduct: Product | null;
  initialNotFound: boolean;
  initialReviews: Review[];
  galleryHydrationRequired: boolean;
  initialRelated?: RelatedCardPayload[];
}

export function ProductPageClient({
  slug,
  variantIdFromUrl,
  language: serverLanguage,
  initialProduct,
  initialNotFound,
  initialReviews,
  galleryHydrationRequired,
  initialRelated = [],
}: ProductPageClientProps) {
  const { isLoggedIn, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const {
    product,
    loading,
    notFound,
    images,
    currentImageIndex,
    setCurrentImageIndex,
    thumbnailStartIndex,
    setThumbnailStartIndex,
    currency,
    language,
    selectedColor,
    selectedSize,
    selectedAttributeValues,
    isAddingToCart,
    setIsAddingToCart,
    showMessage,
    setShowMessage,
    isInWishlist,
    quantity,
    averageRating,
    attributeGroups,
    colorGroups,
    sizeGroups,
    currentVariant,
    price,
    originalPrice,
    compareAtPrice,
    discountPercent,
    maxQuantity,
    isOutOfStock,
    isVariationRequired,
    hasUnavailableAttributes,
    unavailableAttributes,
    canAddToCart,
    scrollToReviews,
    getOptionValue,
    adjustQuantity,
    handleColorSelect,
    handleSizeSelect,
    handleAttributeValueSelect,
    handleAddToWishlist,
    getRequiredAttributesMessage,
  } = useProductPage({
    slug,
    variantIdFromUrl,
    serverLanguage,
    initialProduct,
    initialNotFound,
    galleryHydrationRequired,
    reviews,
  });

  useEffect(() => {
    if (!product) return;
    primeProductPageSnapshot({
      slug: product.slug,
      title: product.title,
      image: images[0] ?? null,
      previewImages: images.slice(0, 3),
      descriptionPreview: product.description ?? null,
      price,
      originalPrice,
      compareAtPrice,
      discountPercent,
      averageRating,
      reviewsCount: reviews.length,
      hasVariantSelectors:
        attributeGroups.size > 0 || colorGroups.length > 0 || sizeGroups.length > 0,
    });
  }, [
    product,
    images,
    price,
    originalPrice,
    compareAtPrice,
    discountPercent,
    averageRating,
    reviews.length,
    attributeGroups.size,
    colorGroups.length,
    sizeGroups.length,
  ]);

  const handleAddToCart = async () => {
    if (!canAddToCart || !product || !currentVariant) return;
    const flyOrigin = document.querySelector('[data-product-fly-origin]');
    const imageUrl = images[currentImageIndex] ?? images[0] ?? null;
    playCartFlyAnimation({
      fromElement: flyOrigin,
      imageUrl,
    });
    setIsAddingToCart(true);
    try {
      if (!isLoggedIn) {
        const stored = localStorage.getItem(CART_KEY);
        const cart = stored ? JSON.parse(stored) : [];
        const existing = cart.find(
          (i: unknown): i is { variantId: string; quantity: number; productId?: string; productSlug?: string } =>
            typeof i === 'object' && i !== null && 'variantId' in i && i.variantId === currentVariant.id,
        );
        if (existing) existing.quantity += quantity;
        else cart.push({ productId: product.id, productSlug: product.slug, variantId: currentVariant.id, quantity });
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
      } else {
        await apiClient.post('/api/v1/cart/items', { productId: product.id, variantId: currentVariant.id, quantity });
      }

      const scope = resolveCartCacheScope(isLoggedIn, user?.id ?? null);
      if (scope) {
        const imageForLine = images[currentImageIndex] ?? images[0] ?? null;
        const optimisticCart = applyOptimisticAddToSnapshot(
          scope,
          {
            productId: product.id,
            productSlug: product.slug,
            variantId: currentVariant.id,
            quantityToAdd: quantity,
            price: currentVariant.price,
            productTitle: product.title,
            productImage: imageForLine,
          },
          isLoggedIn ? `user-cart-${user?.id ?? 'pending'}` : 'guest-cart',
        );
        dispatchCartUpdated({ itemsCount: optimisticCart.itemsCount, fromMutation: true });
      }

      const revalidateT = (key: string) => t(language, key);
      if (isLoggedIn) {
        confirmCartMutation(true, user?.id ?? null, revalidateT);
      } else {
        scheduleCartRevalidate(false, null, revalidateT, { force: true });
      }

      setShowMessage(`${t(language, 'product.addedToCart')} ${quantity} ${t(language, 'product.pcs')}`);
      openCartDrawer();
    } catch {
      setShowMessage(t(language, 'product.errorAddingToCart'));
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setShowMessage(null), 2000);
    }
  };

  if (loading && !product) {
    return <ProductPageShell />;
  }

  if (notFound && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-lg text-neutral-600">{t(language, 'common.messages.noProductsFound')}</p>
        <Link href="/products" className="inline-block text-blue-600 font-medium hover:underline">
          {t(language, 'common.navigation.products')}
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-lg text-neutral-600">{t(language, 'common.messages.invalidProduct')}</p>
        <Link href="/products" className="inline-block text-blue-600 font-medium hover:underline">
          {t(language, 'common.navigation.products')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto py-4 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-start">
          <ProductImageGallery
            images={images}
            product={product}
            discountPercent={discountPercent}
            language={language}
            currentImageIndex={currentImageIndex}
            onImageIndexChange={setCurrentImageIndex}
            thumbnailStartIndex={thumbnailStartIndex}
            onThumbnailStartIndexChange={setThumbnailStartIndex}
            mainImagePriority={currentImageIndex === 0}
          />

          <ProductInfoAndActions
            product={product}
            price={price}
            originalPrice={originalPrice}
            compareAtPrice={compareAtPrice}
            discountPercent={discountPercent}
            currency={currency}
            language={language}
            averageRating={averageRating}
            reviewsCount={reviews.length}
            quantity={quantity}
            maxQuantity={maxQuantity}
            isOutOfStock={isOutOfStock}
            isVariationRequired={isVariationRequired}
            hasUnavailableAttributes={hasUnavailableAttributes}
            unavailableAttributes={unavailableAttributes}
            canAddToCart={canAddToCart}
            isAddingToCart={isAddingToCart}
            isInWishlist={isInWishlist}
            showMessage={showMessage}
            isLoggedIn={isLoggedIn}
            currentVariant={currentVariant}
            attributeGroups={attributeGroups}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedAttributeValues={selectedAttributeValues}
            colorGroups={colorGroups}
            sizeGroups={sizeGroups}
            onQuantityAdjust={adjustQuantity}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onScrollToReviews={scrollToReviews}
            onColorSelect={handleColorSelect}
            onSizeSelect={handleSizeSelect}
            onAttributeValueSelect={handleAttributeValueSelect}
            getOptionValue={getOptionValue}
            getRequiredAttributesMessage={getRequiredAttributesMessage}
          />
        </div>
      </div>

      <RelatedProducts
        productSlug={slug}
        categorySlug={product.categories?.[0]?.slug}
        currentProductId={product.id}
        language={language}
        initialRelated={initialRelated}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div id="product-reviews" className="mt-16 scroll-mt-24">
          <ProductReviews
            productSlug={slug}
            productId={product.id}
            initialReviews={initialReviews}
            onReviewsChange={setReviews}
          />
        </div>
      </div>
    </>
  );
}
