import { convertPrice, formatPrice } from '../../lib/currency';
import type { CurrencyCode } from '../../lib/currency';
import type { Cart } from './types';

interface CartSummaryLabelsInput {
  cart: Cart;
  currencyCode: CurrencyCode;
  deliveryPriceAMD: number | null;
  loadingDelivery: boolean;
}

/**
 * Shipping row: shows **0** in the storefront currency until the estimate request finishes,
 * then the API value (including real **0 AMD**). Totals use the same provisional shipping.
 */
export function buildCartShippingAndTotalLabels({
  cart,
  currencyCode,
  deliveryPriceAMD,
  loadingDelivery,
}: CartSummaryLabelsInput): { shippingLabel: string; totalLabel: string } {
  const shippingAmdResolved = !loadingDelivery && deliveryPriceAMD !== null;
  const shippingAmd = shippingAmdResolved ? deliveryPriceAMD : 0;

  // Cart line prices and subtotals are stored in USD (variant.price); shipping estimate is AMD.
  const shippingUsd = convertPrice(shippingAmd, 'AMD', 'USD');
  const shippingLabel = formatPrice(shippingUsd, currencyCode);
  const displayTotalUsd = cart.totals.subtotal - cart.totals.discount + shippingUsd;
  const totalLabel = formatPrice(displayTotalUsd, currencyCode);
  return { shippingLabel, totalLabel };
}
