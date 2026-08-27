'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { HOME_NAV_LINK_HREFS } from '../home/constants';
import { useTranslation } from '../../lib/i18n-client';
import { isNavLinkActive } from '../../lib/nav/is-nav-link-active';
import {
  HEADER_ACTIVE_PILL_HEIGHT_PX,
  HEADER_ACTIVE_PILL_RADIUS_PX,
  HEADER_NAV_ACTIVE_PILL_CLASS,
  HEADER_NAV_ACTIVE_PILL_DRAGGING_CLASS,
  HEADER_NAV_ACTIVE_PILL_HIGHLIGHTED_TEXT_CLASS,
} from './header-nav-pill.constants';
import {
  getHeaderNavLinkRowClass,
  getHeaderNavLinkTextClass,
} from './header-nav-typography.constants';
import {
  HEADER_LOGO_COMPACT_HEIGHT_PX,
  HEADER_LOGO_COMPACT_WIDTH_PX,
  HEADER_LOGO_HEIGHT_PX,
  HEADER_LOGO_NAV_GAP_PX,
  HEADER_LOGO_WIDTH_PX,
  HEADER_NAV_LINK_GAP_CLASS,
  HEADER_NAV_PILL_PADDING_LEFT_PX,
  HEADER_NAV_PILL_PADDING_RIGHT_PX,
  HEADER_NAV_PILL_PADDING_Y_PX,
  HEADER_PILL_BORDER_RADIUS_PX,
  HEADER_PILL_HEIGHT_PX,
} from './header-shell-shape.constants';
import { HEADER_LOGO_IMAGE_CROP_STYLE, HEADER_LOGO_SRC } from './header-logo.constants';
import { STOREFRONT_DESKTOP_FLEX_CLASS } from '../../lib/layout/storefront-layout.constants';
import { useHeaderNavActivePill } from './useHeaderNavActivePill';

function useHeaderNavLinks() {
  const { t } = useTranslation();
  return HOME_NAV_LINK_HREFS.map((link) => ({
    href: link.href,
    label:
      link.labelKey === 'shop'
        ? t('common.footer.shop')
        : t(`common.navigation.${link.labelKey}`),
  }));
}

type HeaderBrandClusterProps = {
  pathname: string;
  searchParams: URLSearchParams;
  isHomePage: boolean;
};

/**
 * Persists optimistic active nav item across route-transition remounts.
 */
let pendingHeaderNavHref: string | null = null;

function HeaderLogo({ isHomePage }: { isHomePage: boolean }) {
  const logoWidthPx = isHomePage ? HEADER_LOGO_WIDTH_PX : HEADER_LOGO_COMPACT_WIDTH_PX;
  const logoHeightPx = isHomePage ? HEADER_LOGO_HEIGHT_PX : HEADER_LOGO_COMPACT_HEIGHT_PX;

  return (
    <Link href="/" className="relative block shrink-0" aria-label="Janazyan Home">
      <span
        className="relative block overflow-hidden"
        style={{ width: logoWidthPx, height: logoHeightPx }}
      >
        {isHomePage ? (
          <Image
            src={HEADER_LOGO_SRC}
            alt="Janazyan"
            fill
            priority
            sizes={`${HEADER_LOGO_WIDTH_PX}px`}
            className="object-contain object-left"
          />
        ) : (
          <img
            src={HEADER_LOGO_SRC}
            alt="Janazyan"
            style={HEADER_LOGO_IMAGE_CROP_STYLE}
          />
        )}
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
  const router = useRouter();
  const { lang } = useTranslation();
  const navLinks = useHeaderNavLinks();
  const [pendingActiveHref, setPendingActiveHref] = useState<string | null>(
    () => pendingHeaderNavHref,
  );
  const navLinkTextClass = getHeaderNavLinkTextClass(lang);
  const navLinkRowClass = getHeaderNavLinkRowClass(lang);

  const setPendingHref = (href: string | null) => {
    pendingHeaderNavHref = href;
    setPendingActiveHref(href);
  };

  useEffect(() => {
    if (!pendingActiveHref) {
      return;
    }

    if (isNavLinkActive(pathname, pendingActiveHref, searchParams)) {
      setPendingHref(null);
    }
  }, [pathname, pendingActiveHref, searchParams]);

  const handleNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isNavLinkActive(pathname, href, searchParams)) {
      setPendingHref(null);
      return;
    }

    setPendingHref(href);
    router.push(href);
  };

  const {
    navRef,
    setLinkRef,
    pillPosition,
    isDragging,
    highlightedIndex,
    activeIndex,
    pillPointerHandlers,
  } = useHeaderNavActivePill({
    links: navLinks,
    pathname,
    searchParams,
    pendingActiveHref,
  });

  return (
    <nav
      ref={navRef}
      className={`relative items-center ${STOREFRONT_DESKTOP_FLEX_CLASS} ${HEADER_NAV_LINK_GAP_CLASS}`}
      aria-label="Main navigation"
    >
      <span
        aria-hidden
        className={`absolute touch-none select-none ${
          isDragging ? HEADER_NAV_ACTIVE_PILL_DRAGGING_CLASS : HEADER_NAV_ACTIVE_PILL_CLASS
        } ${isDragging ? 'z-30 cursor-grabbing' : 'z-20 cursor-grab'}`}
        style={{
          borderRadius: HEADER_ACTIVE_PILL_RADIUS_PX,
          height: HEADER_ACTIVE_PILL_HEIGHT_PX,
          width: pillPosition.width,
          left: pillPosition.left,
          top: pillPosition.top,
          transition: 'none',
        }}
        {...pillPointerHandlers}
      />
      {navLinks.map((link, index) => {
        const isHighlighted = highlightedIndex === index;
        const isCurrentPage = activeIndex === index;

        return (
          <Link
            key={link.href}
            ref={setLinkRef(index)}
            href={link.href}
            onClick={(event) => handleNavLinkClick(event, link.href)}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={`relative z-30 inline-flex ${navLinkRowClass} items-center ${navLinkTextClass} transition-colors duration-200 ${
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

export function HeaderBrandCluster({ pathname, searchParams, isHomePage }: HeaderBrandClusterProps) {
  const shadowClassName = isHomePage
    ? 'shadow-soft'
    : 'shadow-[0_10px_26px_rgba(15,23,42,0.06)]';

  return (
    <div
      className={`flex min-w-0 items-center bg-white ${shadowClassName}`}
      style={{
        gap: HEADER_LOGO_NAV_GAP_PX,
        height: HEADER_PILL_HEIGHT_PX,
        borderRadius: HEADER_PILL_BORDER_RADIUS_PX,
        paddingLeft: HEADER_NAV_PILL_PADDING_LEFT_PX,
        paddingRight: HEADER_NAV_PILL_PADDING_RIGHT_PX,
        ...(isHomePage
          ? {}
          : {
              paddingTop: HEADER_NAV_PILL_PADDING_Y_PX,
              paddingBottom: HEADER_NAV_PILL_PADDING_Y_PX,
            }),
      }}
    >
      <HeaderLogo isHomePage={isHomePage} />
      <HeaderNav pathname={pathname} searchParams={searchParams} />
    </div>
  );
}
