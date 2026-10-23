'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { STOREFRONT_SKY_SUBMIT_BUTTON_CLASS } from '../../app/products/[slug]/product-action-bar.constants';
import type { Cart } from '../../app/cart/types';
import { formatPrice, type CurrencyCode } from '../../lib/currency';
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

  useEffect(() => {
    router.prefetch('/checkout');
  }, [router]);

  return (
    <footer className="shrink-0 border-t border-gray-200 bg-white px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px)+2.25rem)] md:py-5">
      <div className="flex justify-between gap-3 text-base font-bold text-ink-800">
        <span>{t('common.cart.total')}</span>
        <span>{formatPrice(cart.totals.total, currency)}</span>
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
