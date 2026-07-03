'use client';

import type { CSSProperties, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { HeaderBrandCluster } from './header/HeaderBrandCluster';
import { HeaderStorefrontActions } from './header/HeaderStorefrontActions';
import {
  HEADER_EMBEDDED_MOBILE_BRAND_TOP_PX,
  HEADER_HERO_SHELL_BAND_HEIGHT_PX,
  HEADER_HOME_EMBEDDED_ROW_TOP_PX,
  HEADER_HOME_HORIZONTAL_INSET_LEFT_PX,
  HEADER_HOME_HORIZONTAL_INSET_RIGHT_PX,
  HEADER_SHELL_HORIZONTAL_INSET_PX,
  HEADER_SHELL_STICKY_Z_INDEX,
  resolveEmbeddedHeaderRowBottomPx,
  resolveEmbeddedHeaderRowTopPx,
  resolveHeaderBandHeightPx,
  resolveHeaderRowVerticalInsetPx,
  resolveHeaderStickyOverlapPx,
} from './header/header-shell-shape.constants';
import {
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_MAX_WIDTH_CLASS,
  PRODUCTS_PAGE_SIDE_PADDING_CLASS,
} from '../app/products/products-page-layout.constants';
import {
  STOREFRONT_CONTENT_MAX_WIDTH_CLASS,
  STOREFRONT_HORIZONTAL_GUTTER_CLASS,
  STOREFRONT_SIDE_PADDING_CLASS,
} from '../lib/layout/storefront-layout.constants';
import {
  isProductsListingPage,
  isStorefrontPage,
  usesStorefrontHeroShell,
} from '../lib/nav/is-storefront-page';

const STOREFRONT_HEADER_BG_CLASS = 'bg-sky-mist';

const HEADER_STICKY_CLASS = 'sticky top-0';
const HEADER_NON_HOME_COMPACT_SCREEN_OFFSET_CLASS = 'lg:max-[1649px]:-translate-y-4';

type HeaderProps = {
  /** When true, only the overlay bar (parent supplies positioning shell). */
  embedded?: boolean;
};

type HeaderContainerLayout = {
  containerClassName: string;
  insetClassName: string;
  horizontalInsetLeftPx: number;
  horizontalInsetRightPx: number;
};

function resolveHeaderContainerLayout(pathname: string): HeaderContainerLayout {
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return {
      containerClassName: `mx-auto w-full ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`,
      insetClassName: '',
      horizontalInsetLeftPx: HEADER_HOME_HORIZONTAL_INSET_LEFT_PX,
      horizontalInsetRightPx: HEADER_HOME_HORIZONTAL_INSET_RIGHT_PX,
    };
  }

  if (usesStorefrontHeroShell(pathname)) {
    return {
      containerClassName: `mx-auto w-full ${PRODUCTS_PAGE_MAX_WIDTH_CLASS} ${PRODUCTS_PAGE_SIDE_PADDING_CLASS}`,
      insetClassName: PRODUCTS_PAGE_CONTENT_INSET_CLASS,
      horizontalInsetLeftPx: 0,
      horizontalInsetRightPx: 0,
    };
  }

  return {
    containerClassName: `mx-auto w-full ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS} ${STOREFRONT_SIDE_PADDING_CLASS}`,
    insetClassName: '',
    horizontalInsetLeftPx: HEADER_SHELL_HORIZONTAL_INSET_PX,
    horizontalInsetRightPx: HEADER_SHELL_HORIZONTAL_INSET_PX,
  };
}

function HeaderContentRow({
  pathname,
  searchParams,
  embedded = false,
  horizontalInsetLeftPx = HEADER_SHELL_HORIZONTAL_INSET_PX,
  horizontalInsetRightPx = HEADER_SHELL_HORIZONTAL_INSET_PX,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  embedded?: boolean;
  horizontalInsetLeftPx?: number;
  horizontalInsetRightPx?: number;
}) {
  const isHomePage = pathname === '/';
  const bandHeightPx = resolveHeaderBandHeightPx(isHomePage, embedded);
  const isHeroShellBand = !isHomePage && bandHeightPx === HEADER_HERO_SHELL_BAND_HEIGHT_PX;
  const rowTopPx = isHomePage
    ? HEADER_HOME_EMBEDDED_ROW_TOP_PX
    : isHeroShellBand
      ? resolveEmbeddedHeaderRowTopPx(false)
      : resolveHeaderRowVerticalInsetPx(bandHeightPx);
  const rowBottomPx = isHomePage
    ? 0
    : isHeroShellBand
      ? resolveEmbeddedHeaderRowBottomPx(false)
      : resolveHeaderRowVerticalInsetPx(bandHeightPx);
  const shellHeightPx = resolveHeaderStickyOverlapPx(bandHeightPx);
  const embeddedMobileRowTopPx = isHomePage ? HEADER_EMBEDDED_MOBILE_BRAND_TOP_PX : rowTopPx;
  const embeddedMobileRowBottomPx = isHomePage ? 0 : rowBottomPx;

  return (
    <div
      className={`relative flex w-full items-center justify-between overflow-visible min-h-[var(--header-shell-height)] ${
        embedded
          ? 'pt-[var(--header-mobile-row-top)] pb-[var(--header-mobile-row-bottom)] lg:pt-[var(--header-row-top)] lg:pb-[var(--header-row-bottom)]'
          : ''
      }`}
      style={
        {
          '--header-shell-height': `${shellHeightPx}px`,
          '--header-row-top': `${rowTopPx}px`,
          '--header-row-bottom': `${rowBottomPx}px`,
          '--header-mobile-row-top': `${embeddedMobileRowTopPx}px`,
          '--header-mobile-row-bottom': `${embeddedMobileRowBottomPx}px`,
          ...(embedded
            ? {}
            : {
                paddingTop: rowTopPx,
                paddingBottom: rowBottomPx,
              }),
          paddingLeft: horizontalInsetLeftPx,
          paddingRight: horizontalInsetRightPx,
        } as CSSProperties
      }
    >
      <HeaderBrandCluster pathname={pathname} searchParams={searchParams} isHomePage={isHomePage} />
      <HeaderStorefrontActions isHomePage={isHomePage} />
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
  const { containerClassName, insetClassName, horizontalInsetLeftPx, horizontalInsetRightPx } =
    resolveHeaderContainerLayout(pathname);
  const compactScreenOffsetClass =
    pathname === '/' ? '' : HEADER_NON_HOME_COMPACT_SCREEN_OFFSET_CLASS;

  return (
    <header
      className={`${HEADER_STICKY_CLASS} pointer-events-none w-full ${compactScreenOffsetClass}`}
      style={{ zIndex: HEADER_SHELL_STICKY_Z_INDEX }}
    >
      <div className={`pointer-events-auto relative w-full ${containerClassName}`}>
        <div className={insetClassName}>
          <HeaderContentRow
            embedded
            pathname={pathname}
            searchParams={searchParams}
            horizontalInsetLeftPx={horizontalInsetLeftPx}
            horizontalInsetRightPx={horizontalInsetRightPx}
          />
        </div>
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
      className={`${HEADER_STICKY_CLASS} hidden w-full ${outerBgClass} ${STOREFRONT_HORIZONTAL_GUTTER_CLASS} lg:block`}
      style={{
        zIndex: HEADER_SHELL_STICKY_Z_INDEX,
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
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
