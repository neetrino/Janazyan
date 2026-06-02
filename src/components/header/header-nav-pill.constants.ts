export const HEADER_ACTIVE_PILL_HEIGHT_PX = 36;
export const HEADER_ACTIVE_PILL_WIDTH_PX = 96;
export const HEADER_ACTIVE_PILL_RADIUS_PX = 20;
export const HEADER_ACTIVE_PILL_OFFSET_X_PX = -7;
export const HEADER_ACTIVE_PILL_OFFSET_Y_PX = -6;

/** Frosted sky glass pill for the draggable header nav indicator. */
export const HEADER_NAV_ACTIVE_PILL_CLASS =
  'border border-white/45 bg-sky/40 shadow-[0_4px_18px_rgba(147,182,227,0.22)] backdrop-blur-xl';

export const HEADER_NAV_ACTIVE_PILL_HIGHLIGHTED_TEXT_CLASS = 'text-ink-800';

export type HeaderNavPillPosition = {
  left: number;
  top: number;
};
