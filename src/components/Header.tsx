'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { isNavLinkActive } from '../lib/nav/is-nav-link-active';
import { HeaderAccountMenu } from './header/HeaderAccountMenu';
import { formatCartBadgeCount, useCartItemCount } from './hooks/useCartItemCount';
import { isStorefrontPage } from '../lib/nav/is-storefront-page';
import { HOME_NAV_LINKS } from './home/constants';

const NAV_LINKS = HOME_NAV_LINKS;

const HEADER_LOGO_WIDTH_PX = 110;
const HEADER_LOGO_HEIGHT_PX = 92;
const HEADER_LOGO_NAV_GAP_PX = 37;
const HEADER_NAV_LINK_GAP_PX = 24;
const HEADER_ACTIVE_PILL_HEIGHT_PX = 36;
const HEADER_ACTIVE_PILL_WIDTH_PX = 96;
const HEADER_ACTIVE_PILL_RADIUS_PX = 20;
const HEADER_ACTIVE_PILL_OFFSET_X_PX = -7;
const HEADER_ACTIVE_PILL_OFFSET_Y_PX = -6;
const HEADER_ACTION_BUTTON_SIZE_PX = 36;
const HEADER_ACTION_ICON_SIZE_PX = 20;
const HEADER_ACTION_GAP_PX = 16;
const HEADER_CART_BADGE_COLOR = '#0499c3';

const HEADER_HEART_ICON = '/figma/header-search-icon.svg';
const HEADER_CART_ICON = '/figma/header-cart-icon.svg';
const HEADER_LOGO_SRC = '/figma/header-logo.webp';

const HEADER_BRAND_LEFT_PX = 22;
const HEADER_BRAND_TOP_PX = 53;
const HEADER_ACTIONS_TOP_PERCENT = 7.77;
const HEADER_ACTIONS_RIGHT_PERCENT = 3.6;
/** Bar height for logo (top + height) and action cluster in flow/embedded shells. */
const HEADER_SHELL_MIN_HEIGHT_PX = 156;

const STOREFRONT_HEADER_BG_CLASS = 'bg-sky-mist';

type HeaderProps = {
  /** When true, only the overlay bar (parent supplies positioning shell). */
  embedded?: boolean;
};

function HeaderLogo() {
  return (
    <Link href="/" className="relative block shrink-0" aria-label="Janazyan Home">
      <span
        className="relative block overflow-hidden"
        style={{ width: HEADER_LOGO_WIDTH_PX, height: HEADER_LOGO_HEIGHT_PX }}
      >
        <Image
          src={HEADER_LOGO_SRC}
          alt="Janazyan"
          fill
          priority
          sizes="110px"
          className="object-contain object-left"
        />
      </span>
    </Link>
  );
}

function HeaderNav({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: URLSearchParams;
}) {
  return (
    <nav
      className="hidden items-center lg:flex"
      style={{ gap: HEADER_NAV_LINK_GAP_PX }}
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href, searchParams);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className="relative inline-flex h-6 items-center text-[16px] font-semibold leading-6 tracking-[-0.3125px] transition-colors duration-200"
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute bg-sky"
                style={{
                  borderRadius: HEADER_ACTIVE_PILL_RADIUS_PX,
                  height: HEADER_ACTIVE_PILL_HEIGHT_PX,
                  left: HEADER_ACTIVE_PILL_OFFSET_X_PX,
                  top: HEADER_ACTIVE_PILL_OFFSET_Y_PX,
                  width: HEADER_ACTIVE_PILL_WIDTH_PX,
                }}
              />
            )}
            <span className={`relative ${isActive ? 'text-white' : 'text-ink-500 hover:text-ink-800'}`}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

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
  const cartCount = useCartItemCount();
  const cartBadgeLabel = formatCartBadgeCount(cartCount);

  return (
    <div className="flex shrink-0 items-center overflow-visible rounded-7xl bg-white px-[22px] py-[10px]">
      <div className="flex items-center" style={{ gap: HEADER_ACTION_GAP_PX }}>
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_HEART_ICON} alt="" />
        </Link>
        <HeaderAccountMenu />
        <Link
          href="/cart"
          data-cart-fly-target
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
        </Link>
      </div>
    </div>
  );
}

function HeaderBar({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: URLSearchParams;
}) {
  return (
    <>
      <div
        className="pointer-events-auto absolute"
        style={{
          left: HEADER_BRAND_LEFT_PX,
          top: HEADER_BRAND_TOP_PX,
        }}
      >
        <div className="flex min-w-0 items-center" style={{ gap: HEADER_LOGO_NAV_GAP_PX }}>
          <HeaderLogo />
          <HeaderNav pathname={pathname} searchParams={searchParams} />
        </div>
      </div>
      <div
        className="pointer-events-auto absolute"
        style={{
          right: `${HEADER_ACTIONS_RIGHT_PERCENT}%`,
          top: `${HEADER_ACTIONS_TOP_PERCENT}%`,
        }}
      >
        <HeaderActions />
      </div>
    </>
  );
}

function HeaderFlowBar({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: URLSearchParams;
}) {
  return (
    <>
      <div className="flex min-w-0 items-center" style={{ gap: HEADER_LOGO_NAV_GAP_PX }}>
        <HeaderLogo />
        <HeaderNav pathname={pathname} searchParams={searchParams} />
      </div>
      <HeaderActions />
    </>
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
    <header className="pointer-events-none absolute inset-0 z-30">
      <HeaderBar pathname={pathname} searchParams={searchParams} />
    </header>
  );
}

function HeaderShell({
  children,
  storefrontTone,
}: {
  children: React.ReactNode;
  storefrontTone: boolean;
}) {
  const outerBgClass = storefrontTone ? STOREFRONT_HEADER_BG_CLASS : 'bg-safe-top';
  const innerBgClass = storefrontTone ? STOREFRONT_HEADER_BG_CLASS : 'bg-white';

  return (
    <div className={`relative z-30 hidden w-full ${outerBgClass} px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 md:px-8 md:pt-5 lg:block lg:px-0`}>
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
  const storefrontTone = isStorefrontPage(pathname);

  if (embedded) {
    return <HeaderOverlayBar pathname={pathname} searchParams={searchParams} />;
  }

  return (
    <HeaderShell storefrontTone={storefrontTone}>
      <HeaderFlowBar pathname={pathname} searchParams={searchParams} />
    </HeaderShell>
  );
}
