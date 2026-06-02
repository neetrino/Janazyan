import { buildGuestCartFromStorage } from './cart-optimistic';
import {
  readCartSnapshot,
  resolveCartCacheScope,
} from './cart-snapshot-cache';
import type { Cart } from '../../app/cart/types';

/**
 * Synchronous cart for drawer open — snapshot first, else guest storage lines.
 */
export function hydrateCartFromLocal(
  isLoggedIn: boolean,
  userId: string | null | undefined,
): Cart | null {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (!scope) {
    return null;
  }

  const snapshot = readCartSnapshot(scope);
  if (snapshot) {
    return snapshot;
  }

  if (!isLoggedIn) {
    return buildGuestCartFromStorage();
  }

  return null;
}
