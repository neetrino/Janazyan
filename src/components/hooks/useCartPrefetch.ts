'use client';

import { useEffect } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import { useAuth } from '../../lib/auth/AuthContext';
import { prefetchCartSnapshot } from '../../lib/cart/cart-revalidate';

/**
 * Warms cart snapshot once auth state is known (header badge + drawer).
 */
export function useCartPrefetch(): void {
  const { isLoggedIn, user, isLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isLoggedIn && !user?.id) {
      return;
    }
    prefetchCartSnapshot(isLoggedIn, user?.id ?? null, t);
  }, [isLoading, isLoggedIn, user?.id, t]);
}
