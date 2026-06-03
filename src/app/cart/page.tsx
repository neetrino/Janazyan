'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { openCartDrawer } from '../../lib/cart-drawer-events';

/**
 * Legacy /cart URL — opens the cart drawer and returns to home.
 */
export default function CartPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    openCartDrawer();
    router.replace('/');
  }, [router]);

  return null;
}
