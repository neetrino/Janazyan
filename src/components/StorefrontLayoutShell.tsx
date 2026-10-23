'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PRODUCTS_PAGE_PDP_CATALOG_BOTTOM_PADDING_CLASS } from '../app/products/products-page-layout.constants';
import { PDP_MOBILE_CONTENT_SURFACE_CLASS } from '../lib/layout/storefront-mobile-layout.constants';
import { PROFILE_PAGE_HERO_SHELL_MOBILE_PROPS } from '../lib/layout/account-pages-layout.constants';
import { resolveStorefrontMainBottomPaddingClass } from '../lib/layout/storefront-footer-layout';
import {
  isAdminPath,
  isProductDetailPage,
  isProfilePage,
  isStorefrontPage,
  isPolicyPage,
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
  const productDetailPage = isProductDetailPage(pathname);
  const mainBottomPaddingClass = resolveStorefrontMainBottomPaddingClass(pathname);

  const usesHeroSurface = heroShellPage || useCatalogTheme;
  const mainSurfaceClass = usesHeroSurface ? 'desktop:bg-white' : '';

  return (
    <main className={`relative flex-1 w-full ${mainSurfaceClass}`}>
      {heroShellPage ? (
        <div className={`relative z-10 w-full ${mainBottomPaddingClass}`}>{children}</div>
      ) : useCatalogTheme ? (
        <div className={`relative z-10 w-full ${mainBottomPaddingClass}`}>
          <ProductsHeroShell
            catalog={children}
            {...(isProfilePage(pathname) ? PROFILE_PAGE_HERO_SHELL_MOBILE_PROPS : {})}
            {...(productDetailPage
              ? {
                  catalogBottomPaddingClassName: PRODUCTS_PAGE_PDP_CATALOG_BOTTOM_PADDING_CLASS,
                  catalogBackgroundClassName: 'pdp-catalog-background',
                  mobileContentSurfaceClassName: PDP_MOBILE_CONTENT_SURFACE_CLASS,
                }
              : {})}
            {...(isPolicyPage(pathname) ? { softCatalogFade: true } : {})}
            sectionAriaLabel={
              isProfilePage(pathname)
                ? 'Profile'
                : productDetailPage
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
