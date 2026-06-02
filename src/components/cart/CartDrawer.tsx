'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCart } from '../../app/cart/cart-fetcher';
import { handleRemoveItem, handleUpdateQuantity } from '../../app/cart/cart-handlers';
import type { Cart } from '../../app/cart/types';
import { getStoredCurrency } from '../../lib/currency';
import type { CurrencyCode } from '../../lib/currency';
import {
  CART_DRAWER_CLOSE_EVENT,
  CART_DRAWER_OPEN_EVENT,
  closeCartDrawer,
} from '../../lib/cart-drawer-events';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { CartDrawerItemRow } from './CartDrawerItemRow';
import { CartDrawerFooter } from './CartDrawerFooter';

const CART_DRAWER_MAX_WIDTH_PX = 420;
const CART_DRAWER_Z_INDEX = 80;

/**
 * Right-side cart drawer — opens from header cart icon or after add-to-cart.
 */
export function CartDrawer() {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>(getStoredCurrency());
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const isLocalUpdateRef = useRef(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartData = await fetchCart(isLoggedIn, t);
      setCart(cartData);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, t]);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setSlideIn(false);
      void loadCart();
    };
    const handleClose = () => {
      setSlideIn(false);
      setOpen(false);
    };

    window.addEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
    window.addEventListener(CART_DRAWER_CLOSE_EVENT, handleClose);
    return () => {
      window.removeEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
      window.removeEventListener(CART_DRAWER_CLOSE_EVENT, handleClose);
    };
  }, [loadCart]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setSlideIn(true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleCartUpdate = () => {
      if (isLocalUpdateRef.current) {
        isLocalUpdateRef.current = false;
        return;
      }
      void loadCart();
    };

    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener('auth-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener('auth-updated', handleCartUpdate);
    };
  }, [open, loadCart]);

  const onRemoveItem = async (itemId: string) => {
    if (!cart) {
      return;
    }
    isLocalUpdateRef.current = true;
    await handleRemoveItem(itemId, cart, isLoggedIn, setCart, loadCart);
  };

  const onUpdateQuantity = async (itemId: string, quantity: number) => {
    isLocalUpdateRef.current = true;
    await handleUpdateQuantity(
      itemId,
      quantity,
      cart,
      isLoggedIn,
      setCart,
      setUpdatingItems,
      loadCart,
      t,
    );
  };

  if (!open) {
    return null;
  }

  const itemCount = cart?.itemsCount ?? cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const hasItems = Boolean(cart && cart.items.length > 0);

  return (
    <div
      className={`fixed inset-0 flex justify-end transition-opacity duration-300 ${
        slideIn ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0'
      } backdrop-blur-sm`}
      style={{ zIndex: CART_DRAWER_Z_INDEX }}
      onClick={() => closeCartDrawer()}
      role="presentation"
    >
      <aside
        className={`flex h-full min-h-screen w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          slideIn ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ maxWidth: CART_DRAWER_MAX_WIDTH_PX }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 id="cart-drawer-title" className="text-lg font-bold text-ink-800">
              {t('common.cart.title')}
            </h2>
            {itemCount > 0 && (
              <p className="mt-0.5 text-sm text-gray-500">
                {itemCount}{' '}
                {itemCount === 1 ? t('common.cart.item') : t('common.cart.items')}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => closeCartDrawer()}
            className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-gray-300 hover:text-ink-800"
            aria-label={t('common.buttons.close')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg
                className="h-8 w-8 animate-spin text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : !hasItems ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-base font-medium text-gray-700">{t('common.cart.empty')}</p>
              <Link
                href="/products"
                onClick={() => closeCartDrawer()}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-ink-800 px-6 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
              >
                {t('common.buttons.browseProducts')}
              </Link>
            </div>
          ) : (
            cart?.items.map((item) => (
              <CartDrawerItemRow
                key={item.id}
                item={item}
                currency={currency}
                isUpdating={updatingItems.has(item.id)}
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                t={t}
              />
            ))
          )}
        </div>

        {hasItems && cart && <CartDrawerFooter cart={cart} currency={currency} t={t} />}
      </aside>
    </div>
  );
}
