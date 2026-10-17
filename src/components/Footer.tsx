'use client';

import type { CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { FooterBottle } from './footer/FooterBottle';
import { FooterCompact } from './footer/FooterCompact';
import { FooterPlacedContent } from './footer/FooterPlacedContent';
import {
  shouldShowStorefrontFooter,
  resolvePageFooterExtraUpPull,
  resolvePageFooterShellUpPullPx,
  resolvePageFooterCompactTopMarginClass,
} from '../lib/layout/storefront-footer-layout';

/** Footer block height (Figma node 486:270). */
const FOOTER_HEIGHT_PX = 407;

function getFooterShellStyle(shellUpPullPx: number, extraUpPullPx: number): CSSProperties {
  const overlapPx = shellUpPullPx + extraUpPullPx;

  return {
    height: FOOTER_HEIGHT_PX + overlapPx,
    marginTop: overlapPx > 0 ? -overlapPx : 0,
  };
}

function FooterDesktop({
  shellUpPullPx,
  extraUpPullPx,
}: {
  shellUpPullPx: number;
  extraUpPullPx: number;
}) {
  return (
    <div
      className="pointer-events-none relative z-30 hidden shrink-0 overflow-visible min-[1650px]:block"
      style={getFooterShellStyle(shellUpPullPx, extraUpPullPx)}
    >
      <footer className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 h-[407px] w-full overflow-visible rounded-t-[60px] border-t border-black/10 bg-gradient-to-b from-purple to-cream font-armenian">
        <FooterBottle />
        <div className="relative h-full w-full">
          <FooterPlacedContent />
        </div>
      </footer>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const shellUpPullPx = resolvePageFooterShellUpPullPx(pathname);
  const extraUpPullPx = resolvePageFooterExtraUpPull(pathname);
  const compactTopMarginClass = resolvePageFooterCompactTopMarginClass(pathname);

  if (!shouldShowStorefrontFooter(pathname)) {
    return null;
  }

  return (
    <>
      <FooterCompact extraUpPullPx={extraUpPullPx} topMarginClassName={compactTopMarginClass} />
      <FooterDesktop shellUpPullPx={shellUpPullPx} extraUpPullPx={extraUpPullPx} />
    </>
  );
}
