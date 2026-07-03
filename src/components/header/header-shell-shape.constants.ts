/** Sticky header band height — home embedded and non-embedded shell (24 + 72 + 24). */
export const HEADER_HOME_BAND_HEIGHT_PX = 120;

/** Sticky header band height — hero-shell embedded pages (56 + 72 + 0). */
export const HEADER_HERO_SHELL_BAND_HEIGHT_PX = 128;

/** Figma header / Frame 472 pill height. */
export const HEADER_PILL_HEIGHT_PX = 72;

/** Home embedded header — Figma row offset from hero top (top-only inset). */
export const HEADER_HOME_EMBEDDED_ROW_TOP_PX = 48;

/** Hero-shell embedded header — desktop row sits slightly below home Figma offset. */
export const HEADER_HERO_SHELL_EMBEDDED_ROW_TOP_PX = 56;

/** Vertical inset — centers pills in {@link HEADER_HOME_BAND_HEIGHT_PX} (non-home). */
export const HEADER_SHELL_ROW_INSET_PX = (HEADER_HOME_BAND_HEIGHT_PX - HEADER_PILL_HEIGHT_PX) / 2;

/** Home horizontal inset — brand flush left, actions inset right. */
export const HEADER_HOME_HORIZONTAL_INSET_LEFT_PX = 0;
export const HEADER_HOME_HORIZONTAL_INSET_RIGHT_PX = 25;

/** Vertical inset — centers pills in {@link HEADER_HERO_SHELL_BAND_HEIGHT_PX}. */
export const HEADER_EMBEDDED_HERO_SHELL_ROW_INSET_PX =
  (HEADER_HERO_SHELL_BAND_HEIGHT_PX - HEADER_PILL_HEIGHT_PX) / 2;

/** @deprecated Use {@link HEADER_HOME_EMBEDDED_ROW_TOP_PX} on home. */
export const HEADER_SHELL_ROW_TOP_PX = HEADER_HOME_EMBEDDED_ROW_TOP_PX;

/** @deprecated Use {@link HEADER_HOME_EMBEDDED_ROW_TOP_PX} on home. */
export const HEADER_SHELL_BRAND_TOP_PX = HEADER_HOME_EMBEDDED_ROW_TOP_PX;

/** Embedded mobile brand row — no desktop shell shape. */
export const HEADER_EMBEDDED_MOBILE_BRAND_TOP_PX = 45;

/** Symmetric horizontal inset from the content column edge to header pills (Figma x=25). */
export const HEADER_SHELL_HORIZONTAL_INSET_PX = 25;

/** Brand and actions pills share the same baseline in Figma. */
export const HEADER_SHELL_ACTIONS_TOP_OFFSET_PX = 0;

/** Figma rounded-[70px] on both header pills. */
export const HEADER_PILL_BORDER_RADIUS_PX = 70;

/** Logo left inset inside the nav pill (Figma header x=30). */
export const HEADER_NAV_PILL_PADDING_LEFT_PX = 30;

/** Trailing inset inside the nav pill. */
export const HEADER_NAV_PILL_PADDING_RIGHT_PX = 24;

/** Nav pill vertical inset — matches actions pill (Figma Frame 472). */
export const HEADER_NAV_PILL_PADDING_Y_PX = 14;

/** Gap between logo and navigation (Figma gap 15px). */
export const HEADER_LOGO_NAV_GAP_PX = 15;

/** Actions pill inner padding (Figma Frame 472 inset 11×14). */
export const HEADER_ACTIONS_PILL_PADDING_X_PX = 11;
export const HEADER_ACTIONS_PILL_PADDING_Y_PX = 14;

/** Gap between utility pill and profile button — Figma Frame 9272. */
export const HEADER_ACTION_PROFILE_GAP_PX = 21;

/** Sticky stack order — above hero/sections; below mobile nav (70) and modal overlays (≥100). */
export const HEADER_SHELL_STICKY_Z_INDEX = 60;

/** @deprecated Use {@link HEADER_EMBEDDED_HERO_SHELL_ROW_INSET_PX}. */
export const HEADER_EMBEDDED_HERO_SHELL_ROW_TOP_PX = HEADER_EMBEDDED_HERO_SHELL_ROW_INSET_PX;

/** Minimum overlay header height — symmetric band around pills (home). */
export const HEADER_SHELL_OVERLAY_MIN_HEIGHT_PX = HEADER_HOME_BAND_HEIGHT_PX;

/** Pull hero band up under the sticky header overlay (home embedded header). */
export const HEADER_SHELL_STICKY_OVERLAP_PX = HEADER_HOME_BAND_HEIGHT_PX;

/** Hero-shell embedded header overlap — symmetric band around pills. */
export const HEADER_HERO_SHELL_STICKY_OVERLAP_PX = HEADER_HERO_SHELL_BAND_HEIGHT_PX;

/** Header band height for embedded vs shell layouts. */
export function resolveHeaderBandHeightPx(isHomePage: boolean, embedded: boolean): number {
  if (!embedded) {
    return HEADER_HOME_BAND_HEIGHT_PX;
  }

  return isHomePage ? HEADER_HOME_BAND_HEIGHT_PX : HEADER_HERO_SHELL_BAND_HEIGHT_PX;
}

/** Symmetric vertical inset so pill centers match the actions cluster reference. */
export function resolveHeaderRowVerticalInsetPx(bandHeightPx: number): number {
  return (bandHeightPx - HEADER_PILL_HEIGHT_PX) / 2;
}

/** Embedded header row top — home keeps Figma offset; hero-shell nudged down on desktop. */
export function resolveEmbeddedHeaderRowTopPx(isHomePage: boolean): number {
  return isHomePage ? HEADER_HOME_EMBEDDED_ROW_TOP_PX : HEADER_HERO_SHELL_EMBEDDED_ROW_TOP_PX;
}

/** Embedded header row bottom — no trailing band inset on embedded layouts. */
export function resolveEmbeddedHeaderRowBottomPx(_isHomePage: boolean): number {
  return 0;
}

/** Sticky overlap equals the full header band height. */
export function resolveHeaderStickyOverlapPx(bandHeightPx: number): number {
  return bandHeightPx;
}

/** Figma logo frame inside the header cluster (node 368:626). */
export const HEADER_LOGO_WIDTH_PX = 72;
export const HEADER_LOGO_HEIGHT_PX = 61;

/** Compact logo — fits nav pill vertical padding on hero-shell pages. */
export const HEADER_LOGO_COMPACT_HEIGHT_PX = HEADER_PILL_HEIGHT_PX - HEADER_NAV_PILL_PADDING_Y_PX * 2;
export const HEADER_LOGO_COMPACT_WIDTH_PX = Math.round((72 * HEADER_LOGO_COMPACT_HEIGHT_PX) / 61);
