'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS } from '../app/products/products-page-layout.constants';
import { PROFILE_PAGE_HERO_SHELL_MOBILE_PROPS } from '../lib/layout/account-pages-layout.constants';
import { resolveStorefrontMainBottomPaddingClass } from '../lib/layout/storefront-footer-layout';
import {
  isAdminPath,
  isProductDetailPage,
  isProfilePage,
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
  const mainBottomPaddingClass = resolveStorefrontMainBottomPaddingClass(pathname);

  const usesHeroSurface = heroShellPage || useCatalogTheme;

  return (
    <main className={`relative flex-1 w-full ${usesHeroSurface ? 'lg:bg-white' : ''}`}>
      {heroShellPage ? (
        <div className={`relative z-10 w-full ${mainBottomPaddingClass}`}>{children}</div>
      ) : useCatalogTheme ? (
        <div className={`relative z-10 w-full ${mainBottomPaddingClass}`}>
          <ProductsHeroShell
            catalog={children}
            {...(isProfilePage(pathname) ? PROFILE_PAGE_HERO_SHELL_MOBILE_PROPS : {})}
            {...(isProductDetailPage(pathname)
              ? { mobileContentSurfaceClassName: PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS }
              : {})}
            sectionAriaLabel={
              isProfilePage(pathname)
                ? 'Profile'
                : isProductDetailPage(pathname)
                  ? 'Product'
                  : 'Shop'
            }
          />
        </div>
      ) : (
        children
      )}
    </main>
  );
}
