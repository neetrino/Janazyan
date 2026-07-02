'use client';

import { useTranslation } from '../../lib/i18n-client';
import {
  STOREFRONT_GLASS_ACTION_BUTTON_CLASS,
  STOREFRONT_GLASS_SUBMIT_BUTTON_CLASS,
} from '../products/[slug]/product-action-bar.constants';
import { CheckoutGlassCard } from './components/CheckoutGlassCard';
import { CheckoutOrderSummaryBreakdown } from './components/CheckoutOrderSummaryBreakdown';
import { CHECKOUT_ORDER_SUMMARY_COLUMN_CLASS } from './checkout-layout.constants';
import { CHECKOUT_GLASS_ERROR_CLASS } from './checkout-glass-styles';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import type { Cart } from './types';

interface OrderSummaryProps {
  cart: Cart | null;
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
  error: string | null;
  isSubmitting: boolean;
  promoCode: string;
  promoError: string | null;
  promoApplying: boolean;
  appliedPromoCode: string | null;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: () => void;
}

export function OrderSummary({
  cart,
  orderSummary,
  currency,
  shippingMethod,
  shippingCountry,
  shippingCity,
  deliveryOptions,
  loadingDeliveryPrice,
  deliveryPrice,
  error,
  isSubmitting,
  promoCode,
  promoError,
  promoApplying,
  appliedPromoCode,
  onPromoCodeChange,
  onApplyPromo,
}: OrderSummaryProps) {
  const { t } = useTranslation();

  if (!cart) {
    return null;
  }

  return (
    <div className={CHECKOUT_ORDER_SUMMARY_COLUMN_CLASS}>
      <CheckoutGlassCard>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.orderSummary')}</h2>

        <CheckoutOrderSummaryBreakdown
          cart={cart}
          orderSummary={orderSummary}
          currency={currency}
          shippingMethod={shippingMethod}
          shippingCountry={shippingCountry}
          shippingCity={shippingCity}
          deliveryOptions={deliveryOptions}
          loadingDeliveryPrice={loadingDeliveryPrice}
          deliveryPrice={deliveryPrice}
        />

        <div className="mb-6 rounded-3xl border border-white/50 bg-white/60 p-4 backdrop-blur-sm">
          <p className="text-base font-semibold text-gray-800">{t('checkout.promo.title')}</p>
          <div className="mt-3 flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(event) => onPromoCodeChange(event.target.value)}
              placeholder={t('checkout.promo.placeholder')}
              disabled={promoApplying || isSubmitting}
              className="h-11 w-full rounded-full border border-gray-300 bg-white px-5 text-sm text-gray-700 placeholder:text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-deep/15 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={onApplyPromo}
              disabled={promoApplying || isSubmitting}
              className={`${STOREFRONT_GLASS_ACTION_BUTTON_CLASS} h-11 min-w-[104px] px-4 text-sm uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {promoApplying ? t('checkout.promo.applying') : t('checkout.promo.apply')}
            </button>
          </div>
          {appliedPromoCode ? (
            <p className="mt-2 text-sm font-medium text-emerald-700">
              {t('checkout.promo.applied').replace('{code}', appliedPromoCode)}
            </p>
          ) : null}
          {promoError ? <p className="mt-2 text-sm text-red-600">{promoError}</p> : null}
        </div>

        {error ? (
          <div className={`mb-4 p-3 ${CHECKOUT_GLASS_ERROR_CLASS}`}>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          className={STOREFRONT_GLASS_SUBMIT_BUTTON_CLASS}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('checkout.buttons.processing') : t('checkout.buttons.placeOrder')}
        </button>
      </CheckoutGlassCard>
    </div>
  );
}
