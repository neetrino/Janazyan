'use client';

import type { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { CompareIcon } from '../../../components/icons/CompareIcon';
import { t } from '../../../lib/i18n';
import type { LanguageCode } from '../../../lib/language';
import {
  PDP_ACTION_ROW_CLASS,
  PDP_ACTION_STACK_CLASS,
  PDP_ADD_TO_CART_CLASS,
  PDP_GLASS_ICON_BUTTON_ACTIVE_CLASS,
  PDP_GLASS_ICON_BUTTON_CLASS,
  PDP_QTY_GLASS_CAPSULE_CLASS,
  PDP_QTY_STEP_BUTTON_CLASS,
  PDP_QTY_VALUE_CLASS,
  PDP_DESKTOP_ICON_ACTIONS_CLASS,
  PDP_SECONDARY_ACTION_ROW_CLASS,
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
  isInCompare: boolean;
  onQuantityAdjust: (delta: number) => void;
  onAddToCart: () => Promise<void>;
  onAddToWishlist: (e: MouseEvent) => void;
  onCompareToggle: (e: MouseEvent) => void;
  getRequiredAttributesMessage: () => string;
};

type CompareWishlistButtonsProps = Pick<
  ProductActionBarProps,
  'language' | 'isInCompare' | 'isInWishlist' | 'onCompareToggle' | 'onAddToWishlist'
>;

function CompareWishlistButtons({
  language,
  isInCompare,
  isInWishlist,
  onCompareToggle,
  onAddToWishlist,
}: CompareWishlistButtonsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onCompareToggle}
        className={`${PDP_GLASS_ICON_BUTTON_CLASS} shrink-0 ${isInCompare ? PDP_GLASS_ICON_BUTTON_ACTIVE_CLASS : ''}`}
        aria-label={t(language, isInCompare ? 'common.ariaLabels.removeFromCompare' : 'common.ariaLabels.addToCompare')}
      >
        <CompareIcon isActive={isInCompare} />
      </button>
      <button
        type="button"
        onClick={onAddToWishlist}
        className={`${PDP_GLASS_ICON_BUTTON_CLASS} shrink-0 ${isInWishlist ? PDP_GLASS_ICON_BUTTON_ACTIVE_CLASS : ''}`}
        aria-label={t(language, isInWishlist ? 'common.ariaLabels.removeFromWishlist' : 'common.ariaLabels.addToWishlist')}
      >
        <Heart fill={isInWishlist ? 'currentColor' : 'none'} />
      </button>
    </>
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
 * PDP action row — water-glass qty capsule + separate black add-to-cart pill.
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
  isInCompare,
  onQuantityAdjust,
  onAddToCart,
  onAddToWishlist,
  onCompareToggle,
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
        <button
          type="button"
          disabled={!canAddToCart || isAddingToCart}
          className={PDP_ADD_TO_CART_CLASS}
          onClick={onAddToCart}
        >
          {addToCartLabel}
        </button>
        <div className={PDP_DESKTOP_ICON_ACTIONS_CLASS}>
          <CompareWishlistButtons
            language={language}
            isInCompare={isInCompare}
            isInWishlist={isInWishlist}
            onCompareToggle={onCompareToggle}
            onAddToWishlist={onAddToWishlist}
          />
        </div>
      </div>
      <div className={PDP_SECONDARY_ACTION_ROW_CLASS}>
        <CompareWishlistButtons
          language={language}
          isInCompare={isInCompare}
          isInWishlist={isInWishlist}
          onCompareToggle={onCompareToggle}
          onAddToWishlist={onAddToWishlist}
        />
      </div>
    </div>
  );
}
