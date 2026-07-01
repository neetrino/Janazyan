import type { CurrencyCode } from '@/lib/currency';

type FormatCheckoutShippingLineParams = {
  shippingMethod: 'pickup' | 'delivery';
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
  shippingDisplayAmount: number;
  currency: CurrencyCode;
  regionLabel?: string;
  formatPrice: (amount: number, currency: CurrencyCode) => string;
  labels: {
    freePickup: string;
    loading: string;
    selectRegion: string;
    freeDelivery: string;
    delivery: string;
  };
};

export function formatCheckoutShippingLine({
  shippingMethod,
  loadingDeliveryPrice,
  deliveryPrice,
  shippingDisplayAmount,
  currency,
  regionLabel,
  formatPrice,
  labels,
}: FormatCheckoutShippingLineParams): string {
  if (shippingMethod === 'pickup') {
    return labels.freePickup;
  }

  if (!regionLabel) {
    return labels.selectRegion;
  }

  if (loadingDeliveryPrice) {
    return labels.loading;
  }

  if (deliveryPrice === null) {
    return labels.selectRegion;
  }

  const regionSuffix = ` (${regionLabel})`;

  if (deliveryPrice === 0) {
    return `${labels.freeDelivery}${regionSuffix}`;
  }

  return `${formatPrice(shippingDisplayAmount, currency)}${regionSuffix}`;
}
