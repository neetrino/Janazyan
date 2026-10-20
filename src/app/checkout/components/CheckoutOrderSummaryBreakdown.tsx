'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n-client';
import { formatPriceInCurrency } from '@/lib/currency';
import { resolveDeliveryZoneLabel } from '@/lib/delivery/resolve-delivery-zone-label';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import {
  CHECKOUT_SUMMARY_LABEL_CLASS,
  CHECKOUT_SUMMARY_ROW_CLASS,
  CHECKOUT_SUMMARY_VALUE_CLASS,
} from '../checkout-layout.constants';
import { formatCheckoutShippingLine } from '../utils/format-checkout-shipping-line';
import type { Cart, CheckoutShippingMethod } from '../types';

type CheckoutOrderSummaryBreakdownProps = {
  cart: Cart;
  orderSummary: {
    subtotalDisplay: number;
    shippingDisplay: number;
    discountDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  shippingMethod: CheckoutShippingMethod;
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
  const { t, lang } = useTranslation();

  const regionLabel = useMemo(
    () => resolveDeliveryZoneLabel(deliveryOptions, shippingCountry, shippingCity, lang),
    [deliveryOptions, shippingCountry, shippingCity, lang],
  );

  const shippingLine = formatCheckoutShippingLine({
    loadingDeliveryPrice,
    deliveryPrice,
    shippingDisplayAmount: orderSummary.shippingDisplay,
    currency,
    regionLabel,
    formatPrice: formatPriceInCurrency,
    labels: {
      loading: t('checkout.shipping.loading'),
      selectRegion: t('checkout.shipping.selectRegion'),
      freeDelivery: t('checkout.shipping.freeDelivery'),
    },
  });

  const rowClass = CHECKOUT_SUMMARY_ROW_CLASS;
  const labelClass = CHECKOUT_SUMMARY_LABEL_CLASS;
  const valueClass = compact
    ? `${CHECKOUT_SUMMARY_VALUE_CLASS} font-medium`
    : CHECKOUT_SUMMARY_VALUE_CLASS;

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4 mb-6'}>
      <div className={rowClass}>
        <span className={labelClass}>{t('checkout.summary.items')}</span>
        <span className={valueClass}>{cart.itemsCount}</span>
      </div>
      <div className={rowClass}>
        <span className={labelClass}>{t('checkout.summary.subtotal')}</span>
        <span className={valueClass}>
          {formatPriceInCurrency(orderSummary.subtotalDisplay, currency)}
        </span>
      </div>
      <div className={rowClass}>
        <span className={labelClass}>
          {shippingMethod === 'pochta'
            ? t('checkout.shipping.pochta')
            : t('checkout.summary.shipping')}
        </span>
        <span className={valueClass}>{shippingLine}</span>
      </div>
      {orderSummary.discountDisplay > 0 ? (
        <div className={rowClass}>
          <span className={labelClass}>{t('checkout.summary.discount')}</span>
          <span className={`${valueClass} text-emerald-700`}>
            -{formatPriceInCurrency(orderSummary.discountDisplay, currency)}
          </span>
        </div>
      ) : null}
      <div className={compact ? 'border-t border-gray-200 pt-2 mt-2' : 'border-t border-white/40 pt-4'}>
        <div className={`${CHECKOUT_SUMMARY_ROW_CLASS} ${compact ? '' : 'text-lg'} font-bold text-gray-900`}>
          <span className={CHECKOUT_SUMMARY_LABEL_CLASS}>{t('checkout.summary.total')}</span>
          <span className={CHECKOUT_SUMMARY_VALUE_CLASS}>{formatPriceInCurrency(orderSummary.totalDisplay, currency)}</span>
        </div>
      </div>
    </div>
  );
}
