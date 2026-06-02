'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HOME_NAV_LINKS } from './home/constants';

const NAV_LINKS = HOME_NAV_LINKS;

const HEADER_LOGO_WIDTH_PX = 79;
const HEADER_LOGO_HEIGHT_PX = 66;
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
const HEADER_USER_ICON = '/figma/header-user-icon.svg';
const HEADER_CART_ICON = '/figma/header-cart-icon.svg';
const HEADER_LOGO_SRC = '/figma/header-logo.webp';

const HERO_HEADER_LEFT_PX = 22;
const HERO_HEADER_TOP_PX = 53;
const HERO_ACTIONS_TOP_PERCENT = 7.77;
const HERO_ACTIONS_RIGHT_PERCENT = 3.6;

type HeaderVariant = 'hero' | 'default';

type HeaderProps = {
  variant?: HeaderVariant;
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
          sizes="80px"
          className="object-contain object-left"
        />
      </span>
    </Link>
  );
}

function HeaderNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="hidden items-center lg:flex"
      style={{ gap: HEADER_NAV_LINK_GAP_PX }}
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link, index) => {
        const isActive = link.active ?? pathname === link.href;

        return (
          <Link
            key={`${link.href}-${index}`}
            href={link.href}
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
  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded-7xl bg-white px-[22px] py-[10px]">
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
        <Link
          href="/profile"
          aria-label="Account"
          className="grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_USER_ICON} alt="" />
        </Link>
        <Link
          href="/cart"
          aria-label="Cart"
          className="relative grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_CART_ICON} alt="" />
          <span
            className="absolute left-5 top-0 grid size-4 place-items-center rounded-full text-[12px] font-medium leading-4 text-white"
            style={{ backgroundColor: HEADER_CART_BADGE_COLOR }}
          >
            0
          </span>
        </Link>
      </div>
    </div>
  );
}

function HeaderBrandNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex min-w-0 items-center" style={{ gap: HEADER_LOGO_NAV_GAP_PX }}>
      <HeaderLogo />
      <HeaderNav pathname={pathname} />
    </div>
  );
}

function DefaultHeaderBar({ pathname }: { pathname: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <HeaderBrandNav pathname={pathname} />
      <HeaderActions />
    </div>
  );
}

function HeroHeaderBar({ pathname }: { pathname: string }) {
  return (
    <>
      <div
        className="pointer-events-auto absolute"
        style={{
          left: HERO_HEADER_LEFT_PX,
          top: HERO_HEADER_TOP_PX,
        }}
      >
        <HeaderBrandNav pathname={pathname} />
      </div>
      <div
        className="pointer-events-auto absolute"
        style={{
          right: `${HERO_ACTIONS_RIGHT_PERCENT}%`,
          top: `${HERO_ACTIONS_TOP_PERCENT}%`,
        }}
      >
        <HeaderActions />
      </div>
    </>
  );
}

export function Header({ variant = 'default' }: HeaderProps) {
  const pathname = usePathname();

  if (variant === 'hero') {
    return (
      <header className="pointer-events-none absolute inset-0 z-30">
        <HeroHeaderBar pathname={pathname} />
      </header>
    );
  }

  return (
    <header className="w-full bg-safe-top px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-6 md:px-8 lg:px-[58px]">
      <div className="mx-auto w-full max-w-[1472px] rounded-[28px] bg-white px-4 py-3 shadow-soft sm:px-5 md:px-6 lg:px-7">
        <DefaultHeaderBar pathname={pathname} />
      </div>
    </header>
  );
}
