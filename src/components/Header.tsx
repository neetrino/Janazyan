'use client';

import type { CSSProperties, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { HeaderBrandCluster } from './header/HeaderBrandCluster';
import { HeaderStorefrontActions } from './header/HeaderStorefrontActions';
import {
  HEADER_SHELL_HORIZONTAL_INSET_PX,
  HEADER_SHELL_HORIZONTAL_INSET_RIGHT_PX,
  HEADER_SHELL_OVERLAY_MIN_HEIGHT_PX,
  HEADER_SHELL_ROW_TOP_PX,
  HEADER_SHELL_STICKY_Z_INDEX,
} from './header/header-shell-shape.constants';
import {
  STOREFRONT_CONTENT_MAX_WIDTH_CLASS,
  STOREFRONT_HORIZONTAL_GUTTER_CLASS,
} from '../lib/layout/storefront-layout.constants';
import { isProductsListingPage, isStorefrontPage } from '../lib/nav/is-storefront-page';

const STOREFRONT_HEADER_BG_CLASS = 'bg-sky-mist';

const HEADER_STICKY_CLASS = 'sticky top-0';

type HeaderProps = {
  /** When true, only the overlay bar (parent supplies positioning shell). */
  embedded?: boolean;
};

function HeaderContentRow({
  pathname,
  searchParams,
  embedded = false,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  embedded?: boolean;
}) {
  const minHeightClass = embedded
    ? `min-h-[120px] lg:min-h-[var(--header-shell-height)]`
    : 'min-h-[var(--header-shell-height)]';

  const rowTopPx = HEADER_SHELL_ROW_TOP_PX;

  return (
    <div
      className={`relative flex w-full items-center justify-between overflow-visible ${minHeightClass} ${
        embedded ? 'pt-[45px] lg:pt-[var(--header-row-top)]' : ''
      }`}
      style={
        {
          '--header-shell-height': `${HEADER_SHELL_OVERLAY_MIN_HEIGHT_PX}px`,
          '--header-row-top': `${rowTopPx}px`,
          ...(embedded ? {} : { paddingTop: rowTopPx }),
          paddingLeft: HEADER_SHELL_HORIZONTAL_INSET_PX,
          paddingRight: HEADER_SHELL_HORIZONTAL_INSET_RIGHT_PX,
        } as CSSProperties
      }
    >
      <HeaderBrandCluster pathname={pathname} searchParams={searchParams} />
      <HeaderStorefrontActions />
    </div>
  );
}

function HeaderOverlayBar({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: URLSearchParams;
}) {
  return (
    <header
      className={`${HEADER_STICKY_CLASS} pointer-events-none w-full`}
      style={{ zIndex: HEADER_SHELL_STICKY_Z_INDEX }}
    >
      <div className={`pointer-events-auto relative mx-auto w-full ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`}>
        <HeaderContentRow embedded pathname={pathname} searchParams={searchParams} />
      </div>
    </header>
  );
}

function HeaderShell({
  children,
  storefrontTone,
  plainWhite,
}: {
  children: ReactNode;
  storefrontTone: boolean;
  plainWhite: boolean;
}) {
  const outerBgClass = plainWhite
    ? 'bg-white'
    : storefrontTone
      ? STOREFRONT_HEADER_BG_CLASS
      : 'bg-safe-top';

  return (
    <div
      className={`${HEADER_STICKY_CLASS} hidden w-full ${outerBgClass} ${STOREFRONT_HORIZONTAL_GUTTER_CLASS} pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] md:pt-5 lg:block`}
      style={{ zIndex: HEADER_SHELL_STICKY_Z_INDEX }}
    >
      <div className={`relative mx-auto w-full ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`}>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

export function Header({ embedded = false }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const plainWhite = isProductsListingPage(pathname);
  const storefrontTone = isStorefrontPage(pathname) && !plainWhite;

  if (embedded) {
    return <HeaderOverlayBar pathname={pathname} searchParams={searchParams} />;
  }

  return (
    <HeaderShell storefrontTone={storefrontTone} plainWhite={plainWhite}>
      <HeaderContentRow pathname={pathname} searchParams={searchParams} />
    </HeaderShell>
  );
}
