import type { CurrencyCode } from '@/lib/currency';

type FormatCheckoutShippingLineParams = {
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
  shippingDisplayAmount: number;
  currency: CurrencyCode;
  regionLabel?: string;
  formatPrice: (amount: number, currency: CurrencyCode) => string;
  labels: {
    loading: string;
    selectRegion: string;
    freeDelivery: string;
  };
};

export function formatCheckoutShippingLine({
  loadingDeliveryPrice,
  deliveryPrice,
  shippingDisplayAmount,
  currency,
  regionLabel,
  formatPrice,
  labels,
}: FormatCheckoutShippingLineParams): string {
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
