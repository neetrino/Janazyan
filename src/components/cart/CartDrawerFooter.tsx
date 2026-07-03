'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { buildCartShippingAndTotalLabels } from '../../app/cart/cart-summary-labels';
import { STOREFRONT_SKY_SUBMIT_BUTTON_CLASS } from '../../app/products/[slug]/product-action-bar.constants';
import type { Cart } from '../../app/cart/types';
import { useCartDeliveryEstimate } from '../../app/cart/use-cart-delivery-estimate';
import { formatPrice } from '../../lib/currency';
import type { CurrencyCode } from '../../lib/currency';
import { closeCartDrawer } from '../../lib/cart-drawer-events';

interface CartDrawerFooterProps {
  cart: Cart;
  currency: CurrencyCode;
  t: (key: string) => string;
}

/**
 * Sticky footer with totals and checkout — mounts only when drawer has items.
 */
export function CartDrawerFooter({ cart, currency, t }: CartDrawerFooterProps) {
  const router = useRouter();
  const { deliveryPriceAMD, loadingDelivery } = useCartDeliveryEstimate();

  useEffect(() => {
    router.prefetch('/checkout');
  }, [router]);

  const summaryLabels = useMemo(
    () =>
      buildCartShippingAndTotalLabels({
        cart,
        currencyCode: currency,
        deliveryPriceAMD,
        loadingDelivery,
      }),
    [cart, currency, deliveryPriceAMD, loadingDelivery],
  );

  return (
    <footer className="shrink-0 border-t border-gray-200 bg-white px-5 py-5">
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between gap-3">
          <span>{t('common.cart.subtotal')}</span>
          <span className="font-medium text-ink-800">
            {formatPrice(cart.totals.subtotal, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>{t('common.cart.shipping')}</span>
          <span className="font-medium text-ink-800">{summaryLabels.shippingLabel}</span>
        </div>
      </div>

      <div className="mt-3 flex justify-between gap-3 border-t border-gray-100 pt-3 text-base font-bold text-ink-800">
        <span>{t('common.cart.total')}</span>
        <span>{summaryLabels.totalLabel}</span>
      </div>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          className={STOREFRONT_SKY_SUBMIT_BUTTON_CLASS}
          onClick={() => {
            closeCartDrawer();
            router.push('/checkout');
          }}
        >
          {t('common.buttons.proceedToCheckout')}
        </button>
      </div>
    </footer>
  );
}
