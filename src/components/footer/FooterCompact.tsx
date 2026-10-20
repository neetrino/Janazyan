'use client';

import { FooterBottle } from './FooterBottle';
import { FooterPlacedContent } from './FooterPlacedContent';
import {
  FOOTER_COMPACT_DEFAULT_TOP_MARGIN_PX,
  FOOTER_COMPACT_INSET_CLASS,
  FOOTER_COMPACT_SHELL_CLASS,
  FOOTER_COMPACT_SURFACE_CLASS,
  FOOTER_COMPACT_TOP_PADDING_CLASS,
} from './footer-compact.constants';

/**
 * Storefront footer for `md` to `lg` viewports (Figma node 486:270).
 * Mobile intentionally has no footer; desktop uses the full footer variant.
 */
export function FooterCompact({
  extraUpPullPx = 0,
  topMarginClassName = '',
}: {
  extraUpPullPx?: number;
  topMarginClassName?: string;
}) {
  const shellStyle =
    extraUpPullPx > 0
      ? { marginTop: FOOTER_COMPACT_DEFAULT_TOP_MARGIN_PX - extraUpPullPx }
      : undefined;

  const resolvedTopMarginClass = topMarginClassName || 'mt-24';

  return (
    <footer className={`${FOOTER_COMPACT_SHELL_CLASS} ${resolvedTopMarginClass}`.trim()} style={shellStyle}>
      <div
        className={`${FOOTER_COMPACT_SURFACE_CLASS} ${FOOTER_COMPACT_INSET_CLASS} ${FOOTER_COMPACT_TOP_PADDING_CLASS}`}
      >
        <FooterBottle />
        <FooterPlacedContent />
      </div>
    </footer>
  );
}
