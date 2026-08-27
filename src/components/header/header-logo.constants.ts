import type { CSSProperties } from 'react';

/** Header brand mark — generous padding in the source asset; crop to visible mark. */
export const HEADER_LOGO_SRC = '/figma/header-logo.webp';

/** Crop/zoom offsets — align visible mark inside {@link HEADER_LOGO_SRC}. */
export const HEADER_LOGO_IMAGE_HEIGHT_PERCENT = 213.14;
export const HEADER_LOGO_IMAGE_WIDTH_PERCENT = 170.73;
export const HEADER_LOGO_IMAGE_LEFT_PERCENT = -31.71;
export const HEADER_LOGO_IMAGE_TOP_PERCENT = -53.44;

export const HEADER_LOGO_IMAGE_CROP_STYLE: CSSProperties = {
  position: 'absolute',
  maxWidth: 'none',
  height: `${HEADER_LOGO_IMAGE_HEIGHT_PERCENT}%`,
  width: `${HEADER_LOGO_IMAGE_WIDTH_PERCENT}%`,
  left: `${HEADER_LOGO_IMAGE_LEFT_PERCENT}%`,
  top: `${HEADER_LOGO_IMAGE_TOP_PERCENT}%`,
};
