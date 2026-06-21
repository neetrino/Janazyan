'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '../lib/auth/AuthContext';
import { CartDrawer } from './cart/CartDrawer';
import { useCartPrefetch } from './hooks/useCartPrefetch';
import { useProductsCatalogPrefetch } from './hooks/useProductsCatalogPrefetch';
import { ToastContainer } from './Toast';

/**
 * ClientProviders component
 * Wraps the app with all client-side providers (Auth, Theme, etc.)
 */
function StorefrontPrefetchBootstrap(): null {
  useCartPrefetch();
  useProductsCatalogPrefetch();
  return null;
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StorefrontPrefetchBootstrap />
      {children}
      <CartDrawer />
      <ToastContainer />
    </AuthProvider>
  );
}
