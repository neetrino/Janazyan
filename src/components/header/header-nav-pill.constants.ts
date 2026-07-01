export const HEADER_ACTIVE_PILL_HEIGHT_PX = 36;
export const HEADER_ACTIVE_PILL_RADIUS_PX = 20;
/** Horizontal inset applied on each side so the pill wraps the link label. */
export const HEADER_ACTIVE_PILL_OFFSET_X_PX = -7;
export const HEADER_ACTIVE_PILL_OFFSET_Y_PX = -6;

export {
  HEADER_NAV_ACTIVE_PILL_CLASS,
  HEADER_NAV_ACTIVE_PILL_DRAGGING_CLASS,
} from './header-glass-styles';

export const HEADER_NAV_ACTIVE_PILL_HIGHLIGHTED_TEXT_CLASS = 'text-white';

export type HeaderNavPillPosition = {
  left: number;
  top: number;
  width: number;
};
