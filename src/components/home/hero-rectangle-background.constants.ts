/** Figma Rectangle 8 (node 42:237) — 1388×852 hero background shell. */
export const HERO_RECTANGLE_VIEWBOX_WIDTH = 1388;
export const HERO_RECTANGLE_VIEWBOX_HEIGHT = 852;

/** Top cutout lowered vs Figma node 42:237 — keeps embedded header on white (matches /products catalog shell). */
export const HERO_RECTANGLE_PATH =
  'M0 148.739C0 131.618 13.8792 117.739 31 117.739H805C822.121 117.739 836 103.86 836 86.7391V31C836 13.8792 849.879 0 867 0H1357C1374.12 0 1388 13.8792 1388 31V821C1388 838.121 1374.12 852 1357 852H31C13.8792 852 0 838.121 0 821V148.739Z';

export const HERO_RECTANGLE_BG_SRC = '/figma/hero-rectangle-bg.webp';

/** Derived from Figma SVG gradient vector (198,109.873) → (1397.46,988.619). */
export const HERO_RECTANGLE_GRADIENT_ANGLE_DEG = 144;

export const HERO_RECTANGLE_PINK_GRADIENT = `linear-gradient(${HERO_RECTANGLE_GRADIENT_ANGLE_DEG}deg, #F5C8CE 0%, #BCD4EC 64.85%)`;

/** Nudged down so the gradient seam clears the sticky header band on hero-shell pages. */
export const HERO_RECTANGLE_TOP_PERCENT = 4.2;
export const HERO_RECTANGLE_BOTTOM_PERCENT = 3.4;
