'use client';

import type { ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { HeaderBrandCluster } from './header/HeaderBrandCluster';
import { HeaderStorefrontActions } from './header/HeaderStorefrontActions';
import {
  STOREFRONT_CONTENT_MAX_WIDTH_CLASS,
  STOREFRONT_HORIZONTAL_GUTTER_CLASS,
} from '../lib/layout/storefront-layout.constants';
import { isProductsListingPage, isStorefrontPage } from '../lib/nav/is-storefront-page';

const HEADER_BRAND_TOP_PX = 53;
/** Bar height for logo (top + height) and action cluster in flow/embedded shells. */
const HEADER_SHELL_MIN_HEIGHT_PX = 156;

const STOREFRONT_HEADER_BG_CLASS = 'bg-sky-mist';

type HeaderProps = {
  /** When true, only the overlay bar (parent supplies positioning shell). */
  embedded?: boolean;
};

function HeaderOverlayBar({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: URLSearchParams;
}) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div
        className={`pointer-events-auto mx-auto flex w-full items-center justify-between px-[22px] lg:pr-[53px] ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`}
        style={{
          paddingTop: HEADER_BRAND_TOP_PX,
          minHeight: HEADER_SHELL_MIN_HEIGHT_PX,
        }}
      >
        <HeaderBrandCluster pathname={pathname} searchParams={searchParams} />
        <HeaderStorefrontActions />
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
  const innerBgClass = plainWhite || !storefrontTone ? 'bg-white' : STOREFRONT_HEADER_BG_CLASS;

  return (
    <div
      className={`relative z-30 hidden w-full ${outerBgClass} ${STOREFRONT_HORIZONTAL_GUTTER_CLASS} pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] md:pt-5 lg:block`}
    >
      <div
        className={`relative mx-auto flex w-full items-center justify-between ${innerBgClass} px-[22px] lg:rounded-t-[36px] lg:pr-[53px] ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`}
        style={{ minHeight: HEADER_SHELL_MIN_HEIGHT_PX }}
      >
        {children}
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
      <HeaderBrandCluster pathname={pathname} searchParams={searchParams} />
      <HeaderStorefrontActions />
    </HeaderShell>
  );
}
