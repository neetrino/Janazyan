'use client';

import type { ReactNode } from 'react';
import { PRODUCTS_PAGE_CONTENT_INSET_CLASS } from '../../app/products/products-page-layout.constants';
import {
  STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  STOREFRONT_MOBILE_SHELL_CLASS,
  STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS,
  STOREFRONT_MOBILE_TOP_INSET_CLASS,
} from '../../lib/layout/storefront-mobile-layout.constants';
import { MobileTopBar } from '../home/MobileTopBar';
import { MobileBackdrop } from './MobileBackdrop';

type StorefrontMobileShellProps = {
  children: ReactNode;
  /** Breadcrumb, category pills, etc. — rendered below the search row. */
  toolbar?: ReactNode;
  sectionAriaLabel?: string;
};

/**
 * Shared mobile chrome for storefront pages — same backdrop and top bar as home.
 */
export function StorefrontMobileShell({
  children,
  toolbar,
  sectionAriaLabel = 'Page content',
}: StorefrontMobileShellProps) {
  return (
    <section aria-label={sectionAriaLabel} className={STOREFRONT_MOBILE_SHELL_CLASS}>
      <MobileBackdrop />
      <div className={`relative z-10 ${STOREFRONT_MOBILE_TOP_INSET_CLASS}`}>
        <MobileTopBar />
        {toolbar ? (
          <div className={`${STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS}`}>
            {toolbar}
          </div>
        ) : null}
      </div>
      <div
        className={`${STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS}`}
      >
        {children}
      </div>
    </section>
  );
}
