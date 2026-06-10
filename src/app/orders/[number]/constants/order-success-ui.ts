import {
  STOREFRONT_GLASS_SECONDARY_BUTTON_CLASS,
  STOREFRONT_GLASS_SUBMIT_BUTTON_FLEX_CLASS,
} from '../../../products/[slug]/product-action-bar.constants';

/**
 * Storefront order confirmation / success (monochrome panel + CTAs).
 */

/** White panel (non-receipt): full rounded rect — unused on current flow, kept for reuse. */
export const ORDER_SUCCESS_PANEL_CLASS =
  'mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8';

/** Wrapper around receipt clip panel (shadow follows zigzag). */
export const ORDER_SUCCESS_RECEIPT_OUTER_CLASS =
  'mb-10 w-full [filter:drop-shadow(0_2px_10px_rgba(15,23,42,0.07))]';

/** Inner receipt body: rounded top only; bottom edge comes from clip-path. */
export const ORDER_SUCCESS_RECEIPT_INNER_CLASS =
  'rounded-t-2xl border border-b-0 border-gray-200 bg-white px-6 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-8';

/** Primary CTA — glass pill (order again). */
export const ORDER_SUCCESS_PRIMARY_CTA_CLASS = `${STOREFRONT_GLASS_SUBMIT_BUTTON_FLEX_CLASS} w-full gap-2 sm:w-auto`;

/** Secondary CTA — glass pill (home). */
export const ORDER_SUCCESS_SECONDARY_CTA_CLASS = `${STOREFRONT_GLASS_SECONDARY_BUTTON_CLASS} w-full sm:w-auto`;
