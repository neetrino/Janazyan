'use client';

import Image from 'next/image';
import Link from 'next/link';
import { isNavLinkActive } from '../../lib/nav/is-nav-link-active';
import { HOME_NAV_LINKS } from '../home/constants';

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

const HEADER_LOGO_SRC = '/figma/header-logo.webp';

type HeaderBrandClusterProps = {
  pathname: string;
  searchParams: URLSearchParams;
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

export function HeaderBrandCluster({ pathname, searchParams }: HeaderBrandClusterProps) {
  return (
    <div className="flex min-w-0 items-center" style={{ gap: HEADER_LOGO_NAV_GAP_PX }}>
      <HeaderLogo />
      <HeaderNav pathname={pathname} searchParams={searchParams} />
    </div>
  );
}
