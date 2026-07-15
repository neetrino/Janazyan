'use client';

import type { ReactNode } from 'react';
import { PRODUCTS_PAGE_CONTENT_INSET_CLASS } from '../../app/products/products-page-layout.constants';
import {
  STOREFRONT_MOBILE_CONTENT_ONLY_BACKDROP_WHITE_TOP_CLASS,
  STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  STOREFRONT_MOBILE_SHELL_CLASS,
  STOREFRONT_MOBILE_TOP_INSET_CLASS,
  STOREFRONT_MOBILE_HEADER_CHROME_Z_INDEX_CLASS,
} from '../../lib/layout/storefront-mobile-layout.constants';
import { MobileTopBar } from '../home/MobileTopBar';
import { MobileBackdrop } from './MobileBackdrop';

type StorefrontMobileShellProps = {
  children: ReactNode;
  /** Optional page toolbar rendered at the top of the white content card. */
  toolbar?: ReactNode;
  /** Override toolbar slot layout — e.g. /products full-bleed category row. */
  toolbarClassName?: string;
  /** Override default white content card — e.g. /products catalog gradient. */
  contentSurfaceClassName?: string;
  /** Inner horizontal inset on the content surface — defaults to products page inset. */
  contentInsetClassName?: string;
  /** Hide search / phone / language row (e.g. /profile). */
  hideTopBar?: boolean;
  /** Tighter top spacing for pages without a toolbar row (stores, FAQ, blog). */
  compactMobileTop?: boolean;
  /**
   * When false, shell height follows content (no 100dvh stretch / grow).
   * Auth login/register use this to avoid a large empty band above the bottom nav.
   */
  fillViewport?: boolean;
  sectionAriaLabel?: string;
};

const STOREFRONT_MOBILE_PLAIN_SHELL_CLASS = 'bg-white';

/** Default gap below in-card toolbar before page content. */
const STOREFRONT_MOBILE_IN_CARD_TOOLBAR_SLOT_CLASS = 'mb-4';

/**
 * Shared mobile chrome for storefront pages — same backdrop and top bar as home.
 * Category toolbar sits inside the white rounded card (below the curve), matching shop Figma.
 */
export function StorefrontMobileShell({
  children,
  toolbar,
  toolbarClassName,
  contentSurfaceClassName = STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  contentInsetClassName = PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  hideTopBar = false,
  compactMobileTop = false,
  fillViewport = true,
  sectionAriaLabel = 'Page content',
}: StorefrontMobileShellProps) {
  const showTopBar = !hideTopBar;
  const toolbarSlotClassName =
    toolbarClassName ?? STOREFRONT_MOBILE_IN_CARD_TOOLBAR_SLOT_CLASS;
  const storefrontMobileBaseShellClass = fillViewport
    ? `${STOREFRONT_MOBILE_SHELL_CLASS} min-h-[100dvh] flex flex-col`
    : `${STOREFRONT_MOBILE_SHELL_CLASS} flex flex-col`;
  const shellClassName = hideTopBar
    ? `${storefrontMobileBaseShellClass} ${STOREFRONT_MOBILE_PLAIN_SHELL_CLASS}`
    : storefrontMobileBaseShellClass;
  const surfaceLayoutClass = fillViewport ? 'grow' : 'shrink-0';

  return (
    <section aria-label={sectionAriaLabel} className={shellClassName}>
      {showTopBar ? (
        <MobileBackdrop
          extendWhiteToBottom
          whiteCurveTopClass={
            compactMobileTop ? STOREFRONT_MOBILE_CONTENT_ONLY_BACKDROP_WHITE_TOP_CLASS : undefined
          }
        />
      ) : null}
      {showTopBar ? (
        <div
          className={`relative ${STOREFRONT_MOBILE_HEADER_CHROME_Z_INDEX_CLASS} ${STOREFRONT_MOBILE_TOP_INSET_CLASS}`}
        >
          <MobileTopBar />
        </div>
      ) : null}
      <div className={`${surfaceLayoutClass} ${contentSurfaceClassName} ${contentInsetClassName}`.trim()}>
        {toolbar ? <div className={toolbarSlotClassName}>{toolbar}</div> : null}
        {children}
      </div>
    </section>
  );
}
