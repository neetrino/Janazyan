/** Header pill row offset from hero top. */
export const HEADER_SHELL_ROW_TOP_PX = 48;

/** Brand row inset — same as pill row for non-embedded shell. */
export const HEADER_SHELL_BRAND_TOP_PX = HEADER_SHELL_ROW_TOP_PX;

/** Embedded mobile brand row — no desktop shell shape. */
export const HEADER_EMBEDDED_MOBILE_BRAND_TOP_PX = 45;

/** Horizontal inset — brand pill left edge aligns with the hero frame edge. */
export const HEADER_SHELL_HORIZONTAL_INSET_PX = 0;

/** Right inset — mirrors left for symmetric pill alignment. */
export const HEADER_SHELL_HORIZONTAL_INSET_RIGHT_PX = 25;

/** Brand and actions pills share the same baseline in Figma. */
export const HEADER_SHELL_ACTIONS_TOP_OFFSET_PX = 0;

/** Figma header / Frame 472 pill height. */
export const HEADER_PILL_HEIGHT_PX = 72;

/** Figma rounded-[70px] on both header pills. */
export const HEADER_PILL_BORDER_RADIUS_PX = 70;

/** Logo left inset inside the nav pill (Figma header x=30). */
export const HEADER_NAV_PILL_PADDING_LEFT_PX = 30;

/** Trailing inset inside the nav pill. */
export const HEADER_NAV_PILL_PADDING_RIGHT_PX = 24;

/** Gap between logo and navigation (Figma gap 15px). */
export const HEADER_LOGO_NAV_GAP_PX = 15;

/** Actions pill inner padding (Figma Frame 472 inset 11×14). */
export const HEADER_ACTIONS_PILL_PADDING_X_PX = 11;
export const HEADER_ACTIONS_PILL_PADDING_Y_PX = 14;

/** Gap between utility pill and profile button — Figma Frame 9272. */
export const HEADER_ACTION_PROFILE_GAP_PX = 21;

/** Sticky stack order — above hero/sections; below mobile nav (70) and modal overlays (≥100). */
export const HEADER_SHELL_STICKY_Z_INDEX = 60;

/** Minimum overlay header height — row top + pill height. */
export const HEADER_SHELL_OVERLAY_MIN_HEIGHT_PX =
  HEADER_SHELL_ROW_TOP_PX + HEADER_PILL_HEIGHT_PX;

/** Pull hero band up under the sticky header overlay (pill row top + pill height). */
export const HEADER_SHELL_STICKY_OVERLAP_PX = HEADER_SHELL_OVERLAY_MIN_HEIGHT_PX;

/** Figma logo frame inside the header cluster (node 368:626). */
export const HEADER_LOGO_WIDTH_PX = 72;
export const HEADER_LOGO_HEIGHT_PX = 61;
