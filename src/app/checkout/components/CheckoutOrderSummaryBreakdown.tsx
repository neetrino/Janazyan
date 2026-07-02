'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n-client';
import { formatPriceInCurrency } from '@/lib/currency';
import { resolveDeliveryZoneLabel } from '@/lib/delivery/resolve-delivery-zone-label';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import { formatCheckoutShippingLine } from '../utils/format-checkout-shipping-line';
import type { Cart } from '../types';

type CheckoutOrderSummaryBreakdownProps = {
  cart: Cart;
  orderSummary: {
    subtotalDisplay: number;
    shippingDisplay: number;
    discountDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  shippingMethod: 'pickup' | 'delivery';
  shippingCountry?: string;
  shippingCity?: string;
  deliveryOptions: DeliveryOptionsPublic | null;
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
  compact?: boolean;
};

export function CheckoutOrderSummaryBreakdown({
  cart,
  orderSummary,
  currency,
  shippingMethod,
  shippingCountry,
  shippingCity,
  deliveryOptions,
  loadingDeliveryPrice,
  deliveryPrice,
  compact = false,
}: CheckoutOrderSummaryBreakdownProps) {
  const { t } = useTranslation();

  const regionLabel = useMemo(
    () => resolveDeliveryZoneLabel(deliveryOptions, shippingCountry, shippingCity),
    [deliveryOptions, shippingCountry, shippingCity],
  );

  const shippingLine = formatCheckoutShippingLine({
    shippingMethod,
    loadingDeliveryPrice,
    deliveryPrice,
    shippingDisplayAmount: orderSummary.shippingDisplay,
    currency,
    regionLabel,
    formatPrice: formatPriceInCurrency,
    labels: {
      freePickup: t('checkout.shipping.freePickup'),
      loading: t('checkout.shipping.loading'),
      selectRegion: t('checkout.shipping.selectRegion'),
      freeDelivery: t('checkout.shipping.freeDelivery'),
      delivery: t('checkout.shipping.delivery'),
    },
  });

  const rowClass = compact ? 'flex justify-between text-sm' : 'flex justify-between text-gray-600';
  const valueClass = compact ? 'font-medium' : '';

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4 mb-6'}>
      <div className={rowClass}>
        <span className="text-gray-600">{t('checkout.summary.items')}</span>
        <span className={valueClass}>{cart.itemsCount}</span>
      </div>
      <div className={rowClass}>
        <span className="text-gray-600">{t('checkout.summary.subtotal')}</span>
        <span className={valueClass}>
          {formatPriceInCurrency(orderSummary.subtotalDisplay, currency)}
        </span>
      </div>
      <div className={rowClass}>
        <span className="text-gray-600">{t('checkout.summary.shipping')}</span>
        <span className={valueClass}>{shippingLine}</span>
      </div>
      {orderSummary.discountDisplay > 0 ? (
        <div className={rowClass}>
          <span className="text-gray-600">{t('checkout.summary.discount')}</span>
          <span className={`${valueClass} text-emerald-700`}>
            -{formatPriceInCurrency(orderSummary.discountDisplay, currency)}
          </span>
        </div>
      ) : null}
      <div className={compact ? 'border-t border-gray-200 pt-2 mt-2' : 'border-t border-white/40 pt-4'}>
        <div className={`flex justify-between ${compact ? '' : 'text-lg'} font-bold text-gray-900`}>
          <span>{t('checkout.summary.total')}</span>
          <span>{formatPriceInCurrency(orderSummary.totalDisplay, currency)}</span>
        </div>
      </div>
    </div>
  );
}
