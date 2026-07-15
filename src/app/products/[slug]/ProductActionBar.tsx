'use client';

import type { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import {
  PDP_ACTION_ROW_CLASS,
  PDP_ACTION_STACK_CLASS,
  PDP_ADD_TO_CART_CLASS,
  PDP_GLASS_ICON_BUTTON_CLASS,
  PDP_MOBILE_ADD_TO_CART_CLASS,
  PDP_MOBILE_CART_ROW_CLASS,
  PDP_MOBILE_CONTROLS_ROW_CLASS,
  PDP_SKY_PILL_BUTTON_CLASS,
  PDP_WISHLIST_HEART_ACTIVE_CLASS,
  PDP_QTY_GLASS_CAPSULE_CLASS,
  PDP_QTY_STEP_BUTTON_CLASS,
  PDP_QTY_VALUE_CLASS,
} from './product-action-bar.constants';

type ProductActionBarProps = {
  language: LanguageCode;
  quantity: number;
  maxQuantity: number;
  canAddToCart: boolean;
  isAddingToCart: boolean;
  isOutOfStock: boolean;
  isVariationRequired: boolean;
  hasUnavailableAttributes: boolean;
  isInWishlist: boolean;
  onQuantityAdjust: (delta: number) => void;
  onAddToCart: () => Promise<void>;
  onAddToWishlist: (e: MouseEvent) => void;
  getRequiredAttributesMessage: () => string;
};

type WishlistButtonProps = Pick<
  ProductActionBarProps,
  'language' | 'isInWishlist' | 'onAddToWishlist'
>;

type QuantityControlsProps = Pick<
  ProductActionBarProps,
  'language' | 'quantity' | 'maxQuantity' | 'onQuantityAdjust'
>;

type AddToCartButtonProps = {
  label: string;
  canAddToCart: boolean;
  isAddingToCart: boolean;
  onAddToCart: () => Promise<void>;
  className: string;
};

function WishlistButton({
  language,
  isInWishlist,
  onAddToWishlist,
}: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onAddToWishlist}
      className={`${PDP_GLASS_ICON_BUTTON_CLASS} shrink-0`}
      aria-label={t(language, isInWishlist ? 'common.ariaLabels.removeFromWishlist' : 'common.ariaLabels.addToWishlist')}
    >
      <Heart
        className={isInWishlist ? PDP_WISHLIST_HEART_ACTIVE_CLASS : 'text-white'}
        fill={isInWishlist ? 'currentColor' : 'none'}
      />
    </button>
  );
}

function QuantityControls({
  language,
  quantity,
  maxQuantity,
  onQuantityAdjust,
}: QuantityControlsProps) {
  return (
    <div className={PDP_QTY_GLASS_CAPSULE_CLASS}>
      <button
        type="button"
        onClick={() => onQuantityAdjust(-1)}
        disabled={quantity <= 1}
        className={PDP_QTY_STEP_BUTTON_CLASS}
        aria-label={t(language, 'common.ariaLabels.decreaseQuantity')}
      >
        −
      </button>
      <span className={PDP_QTY_VALUE_CLASS}>{quantity}</span>
      <button
        type="button"
        onClick={() => onQuantityAdjust(1)}
        disabled={quantity >= maxQuantity}
        className={PDP_QTY_STEP_BUTTON_CLASS}
        aria-label={t(language, 'common.ariaLabels.increaseQuantity')}
      >
        +
      </button>
    </div>
  );
}

function AddToCartButton({
  label,
  canAddToCart,
  isAddingToCart,
  onAddToCart,
  className,
}: AddToCartButtonProps) {
  return (
    <button
      type="button"
      disabled={!canAddToCart || isAddingToCart}
      className={className}
      onClick={onAddToCart}
    >
      {label}
    </button>
  );
}

function resolveAddToCartLabel({
  language,
  isAddingToCart,
  isOutOfStock,
  isVariationRequired,
  hasUnavailableAttributes,
  getRequiredAttributesMessage,
}: Pick<
  ProductActionBarProps,
  | 'language'
  | 'isAddingToCart'
  | 'isOutOfStock'
  | 'isVariationRequired'
  | 'hasUnavailableAttributes'
  | 'getRequiredAttributesMessage'
>): string {
  if (isAddingToCart) return t(language, 'product.adding');
  if (isOutOfStock) return t(language, 'product.outOfStock');
  if (isVariationRequired) return getRequiredAttributesMessage();
  if (hasUnavailableAttributes) return t(language, 'product.outOfStock');
  return t(language, 'product.addToCart');
}

/**
 * PDP actions — desktop one row; mobile: cart + wishlist on top, qty below.
 */
export function ProductActionBar({
  language,
  quantity,
  maxQuantity,
  canAddToCart,
  isAddingToCart,
  isOutOfStock,
  isVariationRequired,
  hasUnavailableAttributes,
  isInWishlist,
  onQuantityAdjust,
  onAddToCart,
  onAddToWishlist,
  getRequiredAttributesMessage,
}: ProductActionBarProps) {
  const addToCartLabel = resolveAddToCartLabel({
    language,
    isAddingToCart,
    isOutOfStock,
    isVariationRequired,
    hasUnavailableAttributes,
    getRequiredAttributesMessage,
  });

  return (
    <div className={PDP_ACTION_STACK_CLASS}>
      <div className={PDP_ACTION_ROW_CLASS}>
        <QuantityControls
          language={language}
          quantity={quantity}
          maxQuantity={maxQuantity}
          onQuantityAdjust={onQuantityAdjust}
        />
        <AddToCartButton
          label={addToCartLabel}
          canAddToCart={canAddToCart}
          isAddingToCart={isAddingToCart}
          onAddToCart={onAddToCart}
          className={PDP_ADD_TO_CART_CLASS}
        />
        <WishlistButton
          language={language}
          isInWishlist={isInWishlist}
          onAddToWishlist={onAddToWishlist}
        />
      </div>

      <div className={PDP_MOBILE_CART_ROW_CLASS}>
        <AddToCartButton
          label={addToCartLabel}
          canAddToCart={canAddToCart}
          isAddingToCart={isAddingToCart}
          onAddToCart={onAddToCart}
          className={`${PDP_MOBILE_ADD_TO_CART_CLASS} ${PDP_SKY_PILL_BUTTON_CLASS}`}
        />
        <WishlistButton
          language={language}
          isInWishlist={isInWishlist}
          onAddToWishlist={onAddToWishlist}
        />
      </div>
      <div className={PDP_MOBILE_CONTROLS_ROW_CLASS}>
        <QuantityControls
          language={language}
          quantity={quantity}
          maxQuantity={maxQuantity}
          onQuantityAdjust={onQuantityAdjust}
        />
      </div>
    </div>
  );
}
