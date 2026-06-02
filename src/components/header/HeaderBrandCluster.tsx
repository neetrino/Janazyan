'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HOME_NAV_LINKS } from '../home/constants';
import {
  HEADER_ACTIVE_PILL_HEIGHT_PX,
  HEADER_ACTIVE_PILL_RADIUS_PX,
  HEADER_ACTIVE_PILL_WIDTH_PX,
  HEADER_NAV_ACTIVE_PILL_CLASS,
  HEADER_NAV_ACTIVE_PILL_HIGHLIGHTED_TEXT_CLASS,
} from './header-nav-pill.constants';
import { useHeaderNavActivePill } from './useHeaderNavActivePill';

const NAV_LINKS = HOME_NAV_LINKS;

const HEADER_LOGO_WIDTH_PX = 110;
const HEADER_LOGO_HEIGHT_PX = 92;
const HEADER_LOGO_NAV_GAP_PX = 37;
const HEADER_NAV_LINK_GAP_PX = 24;

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
  const {
    navRef,
    setLinkRef,
    pillPosition,
    isDragging,
    highlightedIndex,
    activeIndex,
    pillPointerHandlers,
  } = useHeaderNavActivePill({
    links: NAV_LINKS,
    pathname,
    searchParams,
  });

  return (
    <nav
      ref={navRef}
      className="relative hidden items-center lg:flex"
      style={{ gap: HEADER_NAV_LINK_GAP_PX }}
      aria-label="Main navigation"
    >
      <span
        aria-hidden
        className={`absolute touch-none select-none ${HEADER_NAV_ACTIVE_PILL_CLASS} ${
          isDragging ? 'z-30 cursor-grabbing bg-sky/50' : 'z-20 cursor-grab'
        }`}
        style={{
          borderRadius: HEADER_ACTIVE_PILL_RADIUS_PX,
          height: HEADER_ACTIVE_PILL_HEIGHT_PX,
          width: HEADER_ACTIVE_PILL_WIDTH_PX,
          left: pillPosition.left,
          top: pillPosition.top,
          transition: isDragging ? 'none' : 'left 200ms ease, top 200ms ease',
        }}
        {...pillPointerHandlers}
      />
      {NAV_LINKS.map((link, index) => {
        const isHighlighted = highlightedIndex === index;
        const isCurrentPage = activeIndex === index;

        return (
          <Link
            key={link.href}
            ref={setLinkRef(index)}
            href={link.href}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={`relative z-30 inline-flex h-6 items-center text-[16px] font-semibold leading-6 tracking-[-0.3125px] transition-colors duration-200 ${
              isDragging ? 'pointer-events-none' : ''
            }`}
          >
            <span
              className={`relative ${
                isHighlighted
                  ? HEADER_NAV_ACTIVE_PILL_HIGHLIGHTED_TEXT_CLASS
                  : 'text-ink-500 hover:text-ink-800'
              }`}
            >
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
