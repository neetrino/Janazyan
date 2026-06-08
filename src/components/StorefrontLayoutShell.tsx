'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  isAdminPath,
  isProductsListingPage,
  isStorefrontPage,
} from '../lib/nav/is-storefront-page';
import { StorefrontPageShell } from './StorefrontPageShell';

/** Legacy fixed backdrop — storefront pages use `StorefrontPageShell` instead. */
export function StorefrontBackground() {
  const pathname = usePathname();

  if (pathname === '/' || isStorefrontPage(pathname) || isAdminPath(pathname)) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-safe-top"
    />
  );
}

export function StorefrontMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const plainProductsListing = isProductsListingPage(pathname);
  const useCatalogTheme = isStorefrontPage(pathname) && !plainProductsListing;

  return (
    <main className={`relative flex-1 w-full ${plainProductsListing ? 'bg-white' : ''}`}>
      {plainProductsListing ? (
        <div className="relative z-10 w-full pb-12 lg:pb-[220px]">{children}</div>
      ) : useCatalogTheme ? (
        <StorefrontPageShell>{children}</StorefrontPageShell>
      ) : (
        children
      )}
    </main>
  );
}
