'use client';

import type { ReactNode } from 'react';
import { PRODUCTS_PAGE_CONTENT_INSET_CLASS } from '../../app/products/products-page-layout.constants';
import {
  STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  STOREFRONT_MOBILE_SHELL_CLASS,
  STOREFRONT_MOBILE_HERO_SHELL_TOP_INSET_CLASS,
  STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS,
} from '../../lib/layout/storefront-mobile-layout.constants';
import { MobileTopBar } from '../home/MobileTopBar';
import { MobileBackdrop } from './MobileBackdrop';

type StorefrontMobileShellProps = {
  children: ReactNode;
  /** Optional page toolbar rendered below the search row. */
  toolbar?: ReactNode;
  /** Override default white content card — e.g. /products catalog gradient. */
  contentSurfaceClassName?: string;
  /** Inner horizontal inset on the content surface — defaults to products page inset. */
  contentInsetClassName?: string;
  /** Hide search / phone / language row (e.g. /profile). */
  hideTopBar?: boolean;
  sectionAriaLabel?: string;
};

const STOREFRONT_MOBILE_PLAIN_SHELL_CLASS = 'bg-white';

/**
 * Shared mobile chrome for storefront pages — same backdrop and top bar as home.
 */
export function StorefrontMobileShell({
  children,
  toolbar,
  contentSurfaceClassName = STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  contentInsetClassName = PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  hideTopBar = false,
  sectionAriaLabel = 'Page content',
}: StorefrontMobileShellProps) {
  const showHeaderChrome = !hideTopBar || Boolean(toolbar);
  const storefrontMobileBaseShellClass = `${STOREFRONT_MOBILE_SHELL_CLASS} min-h-[100dvh] flex flex-col`;
  const shellClassName = hideTopBar
    ? `${storefrontMobileBaseShellClass} ${STOREFRONT_MOBILE_PLAIN_SHELL_CLASS}`
    : storefrontMobileBaseShellClass;

  return (
    <section aria-label={sectionAriaLabel} className={shellClassName}>
      {hideTopBar ? null : <MobileBackdrop extendWhiteToBottom />}
      {showHeaderChrome ? (
        <div className={`relative z-10 ${STOREFRONT_MOBILE_HERO_SHELL_TOP_INSET_CLASS}`}>
          {hideTopBar ? null : <MobileTopBar />}
          {toolbar ? (
            <div className={`${STOREFRONT_MOBILE_TOOLBAR_GAP_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS}`}>
              {toolbar}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className={`grow ${contentSurfaceClassName} ${contentInsetClassName}`.trim()}>
        {children}
      </div>
    </section>
  );
}
