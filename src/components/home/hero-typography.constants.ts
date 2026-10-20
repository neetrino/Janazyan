/** Figma home hero title at 1470px artboard. */
export const HOME_HERO_TITLE_MAX_PX = 198;

/**
 * Figma node I45:562;42:255 — Special Gothic Expanded One.
 * 198px type, 200px line box, 2px tracking, 170px frame on the 1388px hero.
 */
export const HOME_HERO_TITLE_DESKTOP_CLASS =
  'whitespace-nowrap font-wide h-[12.25cqw] overflow-visible text-[14.27cqw] leading-[1.0101] tracking-[0.0101em] text-cream';

/** Title block top — Figma paragraph y=285 on the 940px hero. */
export const HOME_HERO_TITLE_TOP_CLASS = 'top-[30.32%]';

/**
 * Kids label (Figma node 42:369).
 * 4px above the title frame. Right edge follows the title ink, not the
 * layout box: Special Gothic's right sidebearing is wider than Montserrat's,
 * so the label sits inset by that difference.
 */
export const HOME_HERO_KIDS_LABEL_TOP_CLASS = 'top-[calc(30.32%-4px)]';

/**
 * Content inset 3.6% plus the title's right sidebearing (0.97cqw) minus
 * the label's own sidebearing (3.1px), so the last glyph lines up.
 * Kept as one literal so Tailwind can see the class.
 */
export const HOME_HERO_KIDS_LABEL_RIGHT_CLASS =
  'right-[calc(3.6%+0.97cqw-3.1px)]';

/** Stacked hero (below lg) — fluid size from small phones through tablet. */
export const HOME_HERO_TITLE_MOBILE_CLASS =
  'font-wide text-[clamp(48px,12vw,128px)] leading-[0.9] tracking-[0.01em] text-cream';
