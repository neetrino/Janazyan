'use client';

import {
  PDP_DESCRIPTION_SLOT_CLASS,
  PDP_INFO_ACTIONS_WRAPPER_CLASS,
  PDP_INFO_COLUMN_CLASS,
  PDP_VARIANT_SLOT_CLASS,
} from './product-info-layout.constants';
import {
  PDP_ACTION_ROW_CLASS,
  PDP_ADD_TO_CART_CLASS,
  PDP_GLASS_ICON_BUTTON_CLASS,
  PDP_QTY_GLASS_CAPSULE_CLASS,
  PDP_QTY_STEP_BUTTON_CLASS,
  PDP_QTY_VALUE_CLASS,
} from './product-action-bar.constants';
import { Heart } from 'lucide-react';

/** Right-column placeholder while PDP details payload is loading (matches grid slot, limits CLS). */
export function ProductInfoColumnSkeleton() {
  return (
    <div className={PDP_INFO_COLUMN_CLASS} aria-busy="true" aria-label="Product details loading">
      <div className="min-h-0 flex-1 space-y-4 pt-2">
        <div className="h-4 w-24 rounded bg-white/50" aria-hidden />
        <div className="h-10 w-4/5 max-w-md rounded bg-white/50" aria-hidden />
        <div className="h-6 w-32 rounded bg-white/45" aria-hidden />
        <div className="h-12 w-44 rounded bg-white/50" aria-hidden />
        <div className={PDP_DESCRIPTION_SLOT_CLASS} aria-hidden />
        <div className={PDP_VARIANT_SLOT_CLASS} aria-hidden />
      </div>
      <div className={PDP_INFO_ACTIONS_WRAPPER_CLASS}>
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
            className={`${PDP_ADD_TO_CART_CLASS} cursor-default pointer-events-none`}
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
  );
}
