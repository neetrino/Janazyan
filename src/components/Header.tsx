'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { HeaderAccountMenu } from './header/HeaderAccountMenu';
import { HeaderBrandCluster } from './header/HeaderBrandCluster';
import { openCartDrawer } from '../lib/cart-drawer-events';
import { formatCartBadgeCount, useCartItemCount } from './hooks/useCartItemCount';
import { formatWishlistBadgeCount, useWishlistItemCount } from './hooks/useWishlistItemCount';
import { STOREFRONT_HORIZONTAL_GUTTER_CLASS } from '../lib/layout/storefront-layout.constants';
import { isProductsListingPage, isStorefrontPage } from '../lib/nav/is-storefront-page';

const HEADER_ACTION_BUTTON_SIZE_PX = 36;
const HEADER_ACTION_ICON_SIZE_PX = 20;
const HEADER_ACTION_GAP_PX = 16;
const HEADER_CART_BADGE_COLOR = '#0499c3';

const HEADER_HEART_ICON = '/figma/header-search-icon.svg';
const HEADER_CART_ICON = '/figma/header-cart-icon.svg';

const HEADER_BRAND_TOP_PX = 53;
/** Bar height for logo (top + height) and action cluster in flow/embedded shells. */
const HEADER_SHELL_MIN_HEIGHT_PX = 156;

const STOREFRONT_HEADER_BG_CLASS = 'bg-sky-mist';

type HeaderProps = {
  /** When true, only the overlay bar (parent supplies positioning shell). */
  embedded?: boolean;
};

function HeaderActionIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={HEADER_ACTION_ICON_SIZE_PX}
      height={HEADER_ACTION_ICON_SIZE_PX}
      className="h-5 w-5"
    />
  );
}

function HeaderActions() {
  const wishlistCount = useWishlistItemCount();
  const wishlistBadgeLabel = formatWishlistBadgeCount(wishlistCount);
  const cartCount = useCartItemCount();
  const cartBadgeLabel = formatCartBadgeCount(cartCount);

  return (
    <div className="flex shrink-0 items-center overflow-visible rounded-7xl bg-white px-[22px] py-[10px] shadow-soft">
      <div className="flex items-center" style={{ gap: HEADER_ACTION_GAP_PX }}>
        <Link
          href="/wishlist"
          aria-label={
            wishlistCount === 0
              ? 'Wishlist'
              : `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`
          }
          className="relative grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_HEART_ICON} alt="" />
          <span
            className="absolute left-5 top-0 grid min-w-4 place-items-center rounded-full px-0.5 text-[12px] font-medium leading-4 text-white"
            style={{ backgroundColor: HEADER_CART_BADGE_COLOR, height: 16 }}
            aria-hidden
          >
            {wishlistBadgeLabel}
          </span>
        </Link>
        <HeaderAccountMenu />
        <button
          type="button"
          data-cart-fly-target
          onClick={() => openCartDrawer()}
          aria-label={
            cartCount === 0 ? 'Cart' : `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
          }
          className="relative grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_CART_ICON} alt="" />
          <span
            className="absolute left-5 top-0 grid min-w-4 place-items-center rounded-full px-0.5 text-[12px] font-medium leading-4 text-white"
            style={{ backgroundColor: HEADER_CART_BADGE_COLOR, height: 16 }}
            aria-hidden
          >
            {cartBadgeLabel}
          </span>
        </button>
      </div>
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
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div
        className="pointer-events-auto mx-auto flex w-full max-w-[1472px] items-center justify-between px-[22px] lg:pr-[53px]"
        style={{
          paddingTop: HEADER_BRAND_TOP_PX,
          minHeight: HEADER_SHELL_MIN_HEIGHT_PX,
        }}
      >
        <HeaderBrandCluster pathname={pathname} searchParams={searchParams} />
        <HeaderActions />
      </div>
    </header>
  );
}

function HeaderShell({
  children,
  storefrontTone,
  plainWhite,
}: {
  children: React.ReactNode;
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
        className={`relative mx-auto flex w-full max-w-[1472px] items-center justify-between ${innerBgClass} px-[22px] lg:rounded-t-[36px] lg:pr-[53px]`}
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
      <HeaderActions />
    </HeaderShell>
  );
}
