import type { ReactNode } from 'react';
import {
  PRODUCTS_PAGE_CATALOG_DESKTOP_SHELL_CONTINUATION_CLASS,
  PRODUCTS_PAGE_CATALOG_MOBILE_SURFACE_RESET_CLASS,
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';

type ProductsHeroCatalogSlotProps = {
  children: ReactNode;
  mobileContentSurfaceClassName?: string;
  mobileContentInsetClassName?: string;
};

/**
 * Single catalog mount for hero-shell pages — responsive surface without duplicating children.
 */
export function ProductsHeroCatalogSlot({
  children,
  mobileContentSurfaceClassName = STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  mobileContentInsetClassName = PRODUCTS_PAGE_CONTENT_INSET_CLASS,
}: ProductsHeroCatalogSlotProps) {
  return (
    <div
      className={[
        mobileContentSurfaceClassName,
        mobileContentInsetClassName,
        PRODUCTS_PAGE_CATALOG_MOBILE_SURFACE_RESET_CLASS,
        PRODUCTS_PAGE_CATALOG_DESKTOP_SHELL_CONTINUATION_CLASS,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
