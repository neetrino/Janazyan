'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { handleRemoveItem, handleUpdateQuantity } from '../../app/cart/cart-handlers';
import type { Cart } from '../../app/cart/types';
import { hydrateCartFromLocal } from '../../lib/cart/cart-hydrate';
import {
  clearCartSnapshotMemory,
  isCartSnapshotFresh,
  readCartSnapshot,
  resolveCartCacheScope,
} from '../../lib/cart/cart-snapshot-cache';
import { revalidateCartIfStale } from '../../lib/cart/cart-revalidate';
import { getStoredCurrency } from '../../lib/currency';
import type { CurrencyCode } from '../../lib/currency';
import {
  CART_DRAWER_CLOSE_EVENT,
  CART_DRAWER_OPEN_EVENT,
  closeCartDrawer,
} from '../../lib/cart-drawer-events';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { STOREFRONT_GLASS_PILL_BUTTON_CLASS } from '../../app/products/[slug]/product-action-bar.constants';
import { CartDrawerItemRow } from './CartDrawerItemRow';
import { CartDrawerFooter } from './CartDrawerFooter';

const CART_DRAWER_MAX_WIDTH_PX = 420;
const CART_DRAWER_Z_INDEX = 80;

type CartUpdatedDetail = {
  skipRevalidate?: boolean;
  fromSync?: boolean;
};

function parseCartUpdatedDetail(event: Event): CartUpdatedDetail | null {
  if (!(event instanceof CustomEvent) || !event.detail) {
    return null;
  }
  return event.detail as CartUpdatedDetail;
}

/**
 * Right-side cart drawer — stays mounted; opens from cache without blocking on API.
 */
export function CartDrawer() {
  const { isLoggedIn, user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>(getStoredCurrency());
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const isLocalUpdateRef = useRef(false);
  const hasLoadedOnceRef = useRef(false);

  const syncFromLocal = useCallback(() => {
    const hydrated = hydrateCartFromLocal(isLoggedIn, user?.id);
    setCart(hydrated);
    return hydrated;
  }, [isLoggedIn, user?.id]);

  const backgroundSync = useCallback(() => {
    revalidateCartIfStale(isLoggedIn, user?.id ?? null, t);
  }, [isLoggedIn, user?.id, t]);

  useEffect(() => {
    clearCartSnapshotMemory();
    syncFromLocal();
  }, [isLoggedIn, user?.id, syncFromLocal]);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setSlideIn(false);

      const scope = resolveCartCacheScope(isLoggedIn, user?.id);
      const hydrated = syncFromLocal();

      if (scope && hydrated && isCartSnapshotFresh(scope)) {
        hasLoadedOnceRef.current = true;
        return;
      }

      if (!hasLoadedOnceRef.current || !hydrated) {
        backgroundSync();
      } else {
        revalidateCartIfStale(isLoggedIn, user?.id ?? null, t);
      }
      hasLoadedOnceRef.current = true;
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
  }, [isLoggedIn, user?.id, syncFromLocal, backgroundSync, t]);

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
    const handleCartUpdate = (event: Event) => {
      if (isLocalUpdateRef.current) {
        isLocalUpdateRef.current = false;
        return;
      }

      const detail = parseCartUpdatedDetail(event);
      const scope = resolveCartCacheScope(isLoggedIn, user?.id);
      const snapshot = scope ? readCartSnapshot(scope) : null;

      if (snapshot) {
        setCart(snapshot);
      } else if (!isLoggedIn) {
        syncFromLocal();
      } else {
        setCart(null);
      }

      if (detail?.skipRevalidate) {
        return;
      }

      if (open) {
        revalidateCartIfStale(isLoggedIn, user?.id ?? null, t);
      }
    };

    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    const handleAuthUpdate = () => {
      syncFromLocal();
      if (open) {
        backgroundSync();
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener('auth-updated', handleAuthUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener('auth-updated', handleAuthUpdate);
    };
  }, [open, isLoggedIn, user?.id, syncFromLocal, backgroundSync, t]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const scope = resolveCartCacheScope(isLoggedIn, user?.id);
    if (scope && isCartSnapshotFresh(scope)) {
      return;
    }

    const onSynced = (event: Event) => {
      const detail = parseCartUpdatedDetail(event);
      if (!detail?.fromSync) {
        return;
      }
      const synced = scope ? readCartSnapshot(scope) : null;
      setCart(synced);
    };

    window.addEventListener('cart-updated', onSynced);
    return () => {
      window.removeEventListener('cart-updated', onSynced);
    };
  }, [open, isLoggedIn, user?.id]);

  const reloadAfterError = useCallback(async () => {
    backgroundSync();
  }, [backgroundSync]);

  const onRemoveItem = async (itemId: string) => {
    if (!cart) {
      return;
    }
    isLocalUpdateRef.current = true;
    await handleRemoveItem(
      itemId,
      cart,
      isLoggedIn,
      setCart,
      reloadAfterError,
      user?.id,
    );
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
      reloadAfterError,
      t,
      user?.id,
    );
  };

  const itemCount =
    cart?.itemsCount ?? cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const hasItems = (cart?.items?.length ?? 0) > 0;

  return (
    <div
      className={`fixed inset-0 flex justify-end transition-opacity duration-300 ${
        open
          ? slideIn
            ? 'pointer-events-auto bg-black/40 opacity-100'
            : 'pointer-events-auto bg-black/0 opacity-0'
          : 'pointer-events-none invisible opacity-0'
      } backdrop-blur-sm`}
      style={{ zIndex: CART_DRAWER_Z_INDEX }}
      onClick={() => closeCartDrawer()}
      role="presentation"
      aria-hidden={!open}
    >
      <aside
        className={`flex h-full min-h-screen w-full flex-col overflow-hidden rounded-l-2xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open && slideIn ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ maxWidth: CART_DRAWER_MAX_WIDTH_PX }}
        role="dialog"
        aria-modal={open}
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
          {!hasItems ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-base font-medium text-gray-700">{t('common.cart.empty')}</p>
              <Link
                href="/products"
                onClick={() => closeCartDrawer()}
                className={`mt-6 ${STOREFRONT_GLASS_PILL_BUTTON_CLASS}`}
              >
                {t('common.buttons.browseProducts')}
              </Link>
            </div>
          ) : (
            (cart?.items ?? []).map((item) => (
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

