import { STOREFRONT_CONTENT_MAX_WIDTH_PX } from '../../lib/layout/storefront-layout.constants';

/** Desktop footer decoration — Figma node 516:869. */
export const FOOTER_DESKTOP_DECORATION_SRC = '/figma/footer-decoration-desktop.webp';

export const FOOTER_DESKTOP_DECORATION_WIDTH_PX = 635;
export const FOOTER_DESKTOP_DECORATION_HEIGHT_PX = 554;
export const FOOTER_DESKTOP_DECORATION_LEFT_PX = 435;
export const FOOTER_DESKTOP_DECORATION_TOP_PX = -147;

/** Upward extension of the desktop decoration above the footer surface. */
export const FOOTER_DESKTOP_DECORATION_BLEED_PX = Math.abs(FOOTER_DESKTOP_DECORATION_TOP_PX);

/** Artboard width used for horizontal placement in Figma. */
export const FOOTER_DESKTOP_DECORATION_ARTBOARD_WIDTH_PX =
  STOREFRONT_CONTENT_MAX_WIDTH_PX;

export const FOOTER_DESKTOP_DECORATION_LEFT_PERCENT =
  (FOOTER_DESKTOP_DECORATION_LEFT_PX / FOOTER_DESKTOP_DECORATION_ARTBOARD_WIDTH_PX) *
  100;
