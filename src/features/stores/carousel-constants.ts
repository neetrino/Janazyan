/** 3D partner stores ring carousel layout and motion. */
export const CAROUSEL_PERSPECTIVE_PX = 760;
/** Larger value = flatter 3D; mobile tuned toward desktop depth without feeling zoomed. */
export const CAROUSEL_PERSPECTIVE_MOBILE_PX = 920;
/** Viewing angle — negative tilt keeps the active card at the bottom of the stack. */
export const CAROUSEL_GLOBE_TILT_DEG = -28;
/** Mobile tilt — close to desktop so the back stack sits higher like desktop. */
export const CAROUSEL_GLOBE_TILT_MOBILE_DEG = -24;
export const CAROUSEL_GLOBE_LATITUDE_DIP_PX = 32;
export const CAROUSEL_GLOBE_LATITUDE_DIP_MOBILE_PX = 18;
/** Extra upward offset for back-of-globe cards (faded stack at the top). */
export const CAROUSEL_GLOBE_BACK_LIFT_PX = 44;
export const CAROUSEL_GLOBE_BACK_LIFT_MOBILE_PX = 28;
/** Back-of-globe cards shrink and fade for depth. */
export const CAROUSEL_GLOBE_BACK_SCALE_MIN = 0.72;
export const CAROUSEL_GLOBE_BACK_SCALE_MIN_MOBILE = 0.76;
export const CAROUSEL_GLOBE_BACK_OPACITY_MIN = 0.4;
export const CAROUSEL_GLOBE_BACK_OPACITY_MIN_MOBILE = 0.5;
export const CAROUSEL_RADIUS_MOBILE_PX = 72;
export const CAROUSEL_RADIUS_MOBILE_MAX_PX = 84;
export const CAROUSEL_RADIUS_DESKTOP_PX = 200;
/** Uniform card width for every store on the ring. */
export const CAROUSEL_CARD_WIDTH_PX = 220;
export const CAROUSEL_CARD_WIDTH_MOBILE_PX = 128;
export const CAROUSEL_ROTATION_MS = 650;
export const CAROUSEL_AUTO_ROTATE_MS = 7000;
export const CAROUSEL_SCENE_MIN_HEIGHT_PX = 360;
export const CAROUSEL_SCENE_MIN_HEIGHT_MOBILE_PX = 200;
/** Lifts the 3D stack so dots/nav stay visible below the cards. */
export const CAROUSEL_SCENE_SHIFT_UP_PX = 80;
export const CAROUSEL_SCENE_SHIFT_UP_MOBILE_PX = 48;
/** Drops only the active card on mobile — side stack stays in place. */
export const CAROUSEL_FRONT_DROP_MOBILE_PX = 26;
/** Pulls the active card toward the viewer so actions are not covered by the stack. */
export const CAROUSEL_FRONT_FACE_Z_OFFSET_PX = 52;
export const CAROUSEL_FRONT_FACE_Z_OFFSET_MOBILE_PX = 16;
export const CAROUSEL_MOBILE_BREAKPOINT_PX = 768;
