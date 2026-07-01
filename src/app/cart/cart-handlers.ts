import { apiClient } from '../../lib/api-client';
import { ApiError } from '../../lib/api-client/types';
import { logger } from '../../lib/utils/logger';
import { dispatchCartUpdated } from '../../lib/cart/cart-events';
import { parseSyntheticCartItemId } from '../../lib/cart/cart-item-id';
import { waitForPendingCartAdd } from '../../lib/cart/cart-pending-add';
import {
  persistCartSnapshotFromAuth,
  readCartSnapshot,
  resolveCartCacheScope,
} from '../../lib/cart/cart-snapshot-cache';
import { confirmCartMutation } from '../../lib/cart/cart-revalidate';
import type { Cart, CartItem } from './types';
import { CART_KEY } from './constants';

/**
 * Guest cart item
 */
interface GuestCartItem {
  productId: string;
  productSlug?: string;
  variantId: string;
  quantity: number;
}

/**
 * Calculate cart totals
 */
function calculateCartTotals(items: CartItem[], existingTotals: Cart['totals']): Cart['totals'] {
  const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  return {
    ...existingTotals,
    subtotal: newSubtotal,
    total: newSubtotal + existingTotals.tax + existingTotals.shipping - existingTotals.discount,
  };
}

function notifyCartMutation(itemsCount: number): void {
  dispatchCartUpdated({ itemsCount, fromMutation: true });
}

/**
 * Remove item from guest cart in localStorage
 */
function removeFromGuestCart(itemId: string): void {
  if (typeof window === 'undefined') return;

  const parsed = parseSyntheticCartItemId(itemId);
  if (!parsed) return;

  const stored = localStorage.getItem(CART_KEY);
  const guestCart: GuestCartItem[] = stored ? JSON.parse(stored) : [];

  const updatedCart = guestCart.filter(
    (item) => !(item.productId === parsed.productId && item.variantId === parsed.variantId),
  );

  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
}

/**
 * Update item quantity in guest cart in localStorage
 */
function updateGuestCartQuantity(itemId: string, quantity: number): void {
  if (typeof window === 'undefined') return;

  const parsed = parseSyntheticCartItemId(itemId);
  if (!parsed) return;

  const stored = localStorage.getItem(CART_KEY);
  const guestCart: GuestCartItem[] = stored ? JSON.parse(stored) : [];

  const item = guestCart.find(
    (line) => line.productId === parsed.productId && line.variantId === parsed.variantId,
  );

  if (item) {
    item.quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(guestCart));
  }
}

/**
 * Handle remove item from cart
 */
export async function handleRemoveItem(
  itemId: string,
  cart: Cart,
  isLoggedIn: boolean,
  setCart: (cart: Cart | null) => void,
  fetchCart: () => Promise<void>,
  userId: string | null | undefined,
  t: (key: string) => string,
): Promise<void> {
  const itemToRemove = cart.items.find((item) => item.id === itemId);
  if (!itemToRemove) return;
  const syntheticLine = parseSyntheticCartItemId(itemId);

  const updatedItems = cart.items.filter((item) => item.id !== itemId);
  const newItemsCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

  const optimisticCart: Cart = {
    ...cart,
    items: updatedItems,
    totals: calculateCartTotals(updatedItems, cart.totals),
    itemsCount: newItemsCount,
  };

  setCart(optimisticCart);
  persistCartSnapshotFromAuth(optimisticCart, isLoggedIn, userId);
  notifyCartMutation(newItemsCount);

  try {
    if (!isLoggedIn) {
      removeFromGuestCart(itemId);
      return;
    }

    if (syntheticLine) {
      await waitForPendingCartAdd({
        productId: syntheticLine.productId,
        variantId: syntheticLine.variantId,
      });
    }

    let serverItemId = itemId;
    if (syntheticLine) {
      const scope = resolveCartCacheScope(true, userId);
      const snapshot = scope ? readCartSnapshot(scope) : null;
      const matchedLine = snapshot?.items.find(
        (item) =>
          item.variant.product.id === syntheticLine.productId &&
          item.variant.id === syntheticLine.variantId,
      );
      if (matchedLine?.id) {
        serverItemId = matchedLine.id;
      }
    }

    await apiClient.delete(`/api/v1/cart/items/${serverItemId}`);
    confirmCartMutation(true, userId ?? null, t);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      if (syntheticLine) {
        const scope = resolveCartCacheScope(true, userId);
        const snapshot = scope ? readCartSnapshot(scope) : null;
        const matchedLine = snapshot?.items.find(
          (item) =>
            item.variant.product.id === syntheticLine.productId &&
            item.variant.id === syntheticLine.variantId,
        );

        if (matchedLine?.id) {
          try {
            await apiClient.delete(`/api/v1/cart/items/${matchedLine.id}`);
          } catch {
            // Keep optimistic state; revalidate below to converge with server.
          }
        }
      }
      confirmCartMutation(true, userId ?? null, t);
      return;
    }

    logger.error('Error removing item', { error, itemId });
    await fetchCart();
  }
}

/**
 * Handle update item quantity in cart
 */
export async function handleUpdateQuantity(
  itemId: string,
  quantity: number,
  cart: Cart | null,
  isLoggedIn: boolean,
  setCart: (cart: Cart | null) => void,
  setUpdatingItems: (fn: (prev: Set<string>) => Set<string>) => void,
  fetchCart: () => Promise<void>,
  t: (key: string) => string,
  userId: string | null | undefined,
): Promise<void> {
  if (quantity < 1) {
    if (cart) {
      await handleRemoveItem(
        itemId,
        cart,
        isLoggedIn,
        setCart,
        fetchCart,
        userId,
        t,
      );
    }
    return;
  }

  const cartItem = cart?.items.find((item) => item.id === itemId);
  if (!cartItem) return;

  if (cartItem.variant.stock !== undefined && quantity > cartItem.variant.stock) {
    alert(`Մատչելի քանակը ${cartItem.variant.stock} հատ է: Դուք չեք կարող ավելացնել ավելի շատ քանակ:`);
    return;
  }

  if (cart) {
    const updatedItems = cart.items.map((item) =>
      item.id === itemId
        ? { ...item, quantity, total: item.price * quantity }
        : item,
    );
    const newItemsCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    const optimisticCart: Cart = {
      ...cart,
      items: updatedItems,
      totals: calculateCartTotals(updatedItems, cart.totals),
      itemsCount: newItemsCount,
    };
    setCart(optimisticCart);
    persistCartSnapshotFromAuth(optimisticCart, isLoggedIn, userId);
    notifyCartMutation(newItemsCount);
  }

  setUpdatingItems((prev) => new Set(prev).add(itemId));

  try {
    if (!isLoggedIn) {
      if (typeof window === 'undefined') return;

      if (cartItem.variant.stock !== undefined && quantity > cartItem.variant.stock) {
        alert(`Մատչելի քանակը ${cartItem.variant.stock} հատ է: Դուք չեք կարող ավելացնել ավելի շատ քանակ:`);
        await fetchCart();
        setUpdatingItems((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        return;
      }

      updateGuestCartQuantity(itemId, quantity);
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      return;
    }

    await apiClient.patch(`/api/v1/cart/items/${itemId}`, { quantity });
    confirmCartMutation(true, userId ?? null, t);
  } catch (error: unknown) {
    const errorObj = error as { detail?: string; message?: string };
    logger.error('Error updating quantity', { error, itemId });
    await fetchCart();

    const errorMessage =
      errorObj?.detail || errorObj?.message || t('common.messages.failedToUpdateQuantity');
    if (errorMessage.includes('stock') || errorMessage.includes('exceeds')) {
      alert(t('common.alerts.stockInsufficient').replace('{message}', errorMessage));
    } else {
      alert(errorMessage);
    }
  } finally {
    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }
}
