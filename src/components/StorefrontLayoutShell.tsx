'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  isAdminPath,
  isStorefrontPage,
  usesStorefrontHeroShell,
} from '../lib/nav/is-storefront-page';
import { ProductsHeroShell } from './products/ProductsHeroShell';

/** Legacy fixed backdrop — storefront pages use the hero shell instead. */
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
  const heroShellPage = usesStorefrontHeroShell(pathname);
  const useCatalogTheme = isStorefrontPage(pathname) && !heroShellPage;

  const usesHeroSurface = heroShellPage || useCatalogTheme;

  return (
    <main className={`relative flex-1 w-full ${usesHeroSurface ? 'bg-white' : ''}`}>
      {heroShellPage ? (
        <div className="relative z-10 w-full pb-12 lg:pb-[220px]">{children}</div>
      ) : useCatalogTheme ? (
        <div className="relative z-10 w-full pb-12 lg:pb-[220px]">
          <ProductsHeroShell catalog={children} />
        </div>
      ) : (
        children
      )}
    </main>
  );
}
