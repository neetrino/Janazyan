'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../lib/i18n-client';
import { useAuth } from '../../lib/auth/AuthContext';
import { prefetchCartSnapshot } from '../../lib/cart/cart-revalidate';
import { shouldRunStorefrontPrefetch } from '../../lib/nav/should-run-storefront-prefetch';

/**
 * Warms cart snapshot once auth state is known (header badge + drawer).
 * Skipped on admin routes where cart UI is not shown.
 */
export function useCartPrefetch(): void {
  const pathname = usePathname();
  const { isLoggedIn, user, isLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!shouldRunStorefrontPrefetch(pathname)) {
      return;
    }
    if (isLoading) {
      return;
    }
    if (isLoggedIn && !user?.id) {
      return;
    }
    prefetchCartSnapshot(isLoggedIn, user?.id ?? null, t);
  }, [pathname, isLoading, isLoggedIn, user?.id, t]);
}
