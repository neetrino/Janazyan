/** Contact page — Figma node 496:276 */

export const CONTACT_HERO_IMAGE_SRC = '/figma/contact-hero.png';

/** Actual asset dimensions — contact-hero.png */
export const CONTACT_HERO_IMAGE_NATURAL_WIDTH_PX = 1412;
export const CONTACT_HERO_IMAGE_NATURAL_HEIGHT_PX = 2508;

/** Display width — Figma node 496:497. */
export const CONTACT_HERO_WIDTH_PX = 484;

/** Height at {@link CONTACT_HERO_WIDTH_PX} from asset aspect ratio. */
export const CONTACT_HERO_HEIGHT_AT_WIDTH_PX = Math.round(
  (CONTACT_HERO_WIDTH_PX * CONTACT_HERO_IMAGE_NATURAL_HEIGHT_PX) /
    CONTACT_HERO_IMAGE_NATURAL_WIDTH_PX,
);

/**
 * Footer overlap zone — Figma image bottom crosses the footer arc by roughly 32px.
 * Tailwind classes must stay literal strings (JIT cannot scan template literals).
 */
export const CONTACT_HERO_FOOTER_BLEED_PX = 32;

/** Negative section margin — pulls hero column into footer overlap. */
export const CONTACT_HERO_FOOTER_BLEED_CLASS = 'desktop:-mb-8';

/** Absolute clip wrapper bottom bleed — must match {@link CONTACT_HERO_FOOTER_BLEED_PX}. */
export const CONTACT_HERO_CLIP_BOTTOM_BLEED_CLASS = 'desktop:-bottom-8';

/** Tailwind width utilities derived from {@link CONTACT_HERO_WIDTH_PX}. */
export const CONTACT_HERO_WIDTH_CLASS = 'max-desktop:max-w-[484px] desktop:w-[484px]';

/** Matches shell top-left radius — {@link PRODUCTS_PAGE_SHELL_CLASS}. */
export const CONTACT_BACKGROUND_BORDER_RADIUS_PX = 36;

/** Catalog top/bottom bleed — hero spans catalog edge to footer. */
export const CONTACT_SECTION_DESKTOP_BLEED_CLASS =
  `desktop:relative desktop:-mt-[122px] ${CONTACT_HERO_FOOTER_BLEED_CLASS} desktop:py-0 desktop:overflow-visible desktop:rounded-tl-[36px]`;

/** Desktop grid — Figma 496:276: 484px hero, 280px gutter, 633px form. */
export const CONTACT_PAGE_GRID_CLASS =
  'grid grid-cols-1 items-start gap-8 desktop:min-h-[796px] desktop:grid-cols-[484px_633px] desktop:items-start desktop:justify-start desktop:gap-[280px]';

/** Left column — stretch target; height spans background top through footer overlap. */
export const CONTACT_HERO_COLUMN_CLASS =
  'desktop:relative desktop:h-[828px]';

/**
 * Clip hero at catalog background border — top-left arc + left bleed.
 * Bottom bleed must match {@link CONTACT_HERO_FOOTER_BLEED_PX}.
 */
export const CONTACT_HERO_CLIP_WRAPPER_CLASS =
  `contact-hero-viewport-bleed desktop:absolute desktop:top-0 ${CONTACT_HERO_CLIP_BOTTOM_BLEED_CLASS} desktop:left-0 desktop:w-[516px] desktop:overflow-visible desktop:rounded-tl-[36px]`;

/** Form column — Figma heading/card gap 16px (345 − 329). */
export const CONTACT_FORM_COLUMN_CLASS =
  'flex w-full max-w-[633px] flex-col gap-4 self-start desktop:mt-[52px]';

/** Figma node 505:576 — 8px horizontal inset, 10px title/description gap. */
export const CONTACT_FORM_HEADING_CLASS = 'space-y-2.5 px-1 desktop:px-2';

/** Pull hero image flush to clip wrapper — top at background border, bottom at footer. */
export const CONTACT_HERO_DESKTOP_DROP_CLASS = 'desktop:top-[88px]';
export const CONTACT_HERO_DESKTOP_SCALE_CLASS = 'desktop:origin-top-left desktop:scale-[0.96]';

export const CONTACT_HERO_WALL_BLEED_CLASS =
  `relative mx-auto w-full ${CONTACT_HERO_WIDTH_CLASS} max-desktop:mx-auto desktop:absolute desktop:left-0 ${CONTACT_HERO_DESKTOP_DROP_CLASS} ${CONTACT_HERO_DESKTOP_SCALE_CLASS} desktop:mx-0 desktop:h-[860px] desktop:shrink-0`;

/** Hero image frame — Figma node 496:497, no matte behind transparent crop. */
export const CONTACT_HERO_FRAME_CLASS =
  `relative aspect-[484/860] w-full overflow-hidden ${CONTACT_HERO_WIDTH_CLASS} desktop:h-[860px] desktop:rounded-tl-[36px]`;

export const CONTACT_HERO_IMAGE_RADIUS_CLASS =
  'rounded-tl-[28px] rounded-tr-[14px] rounded-bl-[14px] rounded-br-[14px] desktop:rounded-none';

export const CONTACT_HERO_IMAGE_CLASS =
  `object-cover object-left-top ${CONTACT_HERO_IMAGE_RADIUS_CLASS} desktop:rounded-bl-[14px] desktop:rounded-br-[14px] desktop:rounded-tr-[14px]`;

export const CONTACT_PILL_ICON_BG_SRC = '/figma/contact-pill-icon-bg.svg';
export const CONTACT_PILL_PHONE_ICON_SRC = '/figma/contact-pill-phone.svg';
export const CONTACT_PILL_MAIL_ICON_SRC = '/figma/contact-pill-mail.svg';
export const CONTACT_PILL_LOCATION_ICON_SRC = '/figma/contact-pill-location.svg';
export const CONTACT_PILL_TIME_ICON_SRC = '/figma/contact-pill-time.svg';
export const CONTACT_SEND_ICON_SRC = '/figma/contact-send-icon.svg';

export const CONTACT_PILL_SHELL_CLASS =
  'inline-flex min-h-[56px] items-center gap-2 rounded-[70px] bg-white py-1.5 pl-2 pr-3 shadow-[0_4px_20px_rgba(147,182,227,0.12)] desktop:min-h-[64px] desktop:gap-3 desktop:py-2 desktop:pl-[11px] desktop:pr-5';

/** Location pill — flat right edge before the outward arrow tail. */
export const CONTACT_PILL_ARROW_BODY_CLASS =
  'rounded-[70px] rounded-r-[26px] pr-4 shadow-none desktop:pr-5';

/** Wrapper — drop-shadow follows the pill body and arrow tail. */
export const CONTACT_PILL_ARROW_HOST_CLASS = 'contact-pill-with-arrow-right';

export const CONTACT_PILL_TEXT_CLASS =
  'text-[12px] font-medium leading-4 tracking-[-0.31px] text-black desktop:text-base desktop:leading-[22px]';

/** Desktop pill anchors — measured from the visible 484px Figma hero frame. */
export const CONTACT_PILL_PHONE_POSITION_CLASS =
  'absolute left-[24%] top-[4%] desktop:left-[180px] desktop:top-[28px] desktop:mt-0';

export const CONTACT_PILL_EMAIL_POSITION_CLASS =
  'absolute left-[7%] top-[22%] desktop:left-[276px] desktop:top-[152px] desktop:mt-0';

export const CONTACT_PILL_LOCATION_POSITION_CLASS =
  'absolute left-[22%] top-[48%] max-desktop:max-w-[250px] desktop:left-[376px] desktop:top-[333px] desktop:mt-0 desktop:w-fit desktop:max-w-[318px]';

export const CONTACT_PILL_LOCATION_ICON_CLASS =
  'relative z-10 size-[35px] object-contain';

export const CONTACT_PILL_LOCATION_TEXT_CLASS =
  `${CONTACT_PILL_TEXT_CLASS} max-w-[200px] whitespace-pre-line leading-[22px] tracking-[-0.3125px]`;

export const CONTACT_PILL_TIME_POSITION_CLASS =
  'absolute left-[4%] top-[70%] max-desktop:max-w-[320px] desktop:left-[188px] desktop:top-[500px] desktop:mt-0';

export const CONTACT_PILL_TIME_TEXT_CLASS =
  `${CONTACT_PILL_TEXT_CLASS} flex flex-col gap-0 leading-[18px]`;

export const CONTACT_PILL_TIME_WEEKDAYS_LINE_CLASS = 'whitespace-nowrap';

export const CONTACT_PILL_TIME_SATURDAY_LINE_CLASS = 'whitespace-nowrap';

export const CONTACT_PILL_TIME_ACCENT_CLASS = 'text-[#6b95cb]';

/** Mobile matches /login card; desktop keeps Figma contact form. */
export const CONTACT_FORM_CARD_CLASS =
  'flex w-full flex-col rounded-[34px] bg-white p-8 sm:p-12 desktop:w-[633px] desktop:rounded-[30px] desktop:px-5 desktop:pb-[7px] desktop:pt-6';

/** Figma node 496:460 — inner app shell inside card. */
export const CONTACT_FORM_STACK_CLASS =
  'flex w-full flex-col gap-5 desktop:gap-[5px] desktop:pb-6 desktop:pl-4 desktop:pr-6';

/** Figma node 496:461 — name + email row; 26px column gap at 270/274 widths. */
export const CONTACT_FORM_ROW_CLASS =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 desktop:gap-[26px]';

/** Figma node 496:474 — subject block top inset (desktop only). */
export const CONTACT_FORM_SUBJECT_GROUP_CLASS = 'desktop:pt-6';

/** Label + input gap — matches /login on mobile. */
export const CONTACT_FORM_FIELD_GROUP_CLASS = 'flex w-full flex-col gap-1.5 desktop:gap-0';

/** Figma node 496:480 — message block vertical inset (desktop only). */
export const CONTACT_FORM_MESSAGE_GROUP_CLASS = 'desktop:py-6';

/** Mobile label matches /login; desktop keeps Figma contact labels. */
export const CONTACT_FORM_LABEL_CLASS =
  'block text-base font-medium leading-normal tracking-[-0.24px] text-[#232323] desktop:mb-2 desktop:text-sm desktop:tracking-[-0.15px] desktop:text-[#0a0a0a]';

/** Mobile pill shell matches /login; desktop keeps Figma rounded field. */
export const CONTACT_FORM_INPUT_SHELL_CLASS =
  'flex h-12 w-full items-center gap-3.5 rounded-[42px] border border-transparent bg-[#f3f3f5] px-4 py-3.5 focus-within:border-sky-deep/30 focus-within:ring-2 focus-within:ring-sky-deep/15 desktop:rounded-[20px] desktop:px-[13px] desktop:py-0';

/** Inner input — transparent on mobile pill; desktop field inherits shell chrome. */
export const CONTACT_FORM_INPUT_CLASS =
  'min-w-0 flex-1 border-0 bg-transparent text-base font-medium leading-normal tracking-[-0.24px] text-[#232323] placeholder:font-normal placeholder:text-[#717182] focus:outline-none focus:ring-0 desktop:text-sm desktop:tracking-[-0.1504px] desktop:text-ink-800';

export const CONTACT_FORM_TEXTAREA_CLASS =
  'min-h-[120px] w-full resize-y rounded-[42px] border border-transparent bg-[#f3f3f5] px-4 py-3.5 text-base font-medium leading-normal tracking-[-0.24px] text-[#232323] placeholder:font-normal placeholder:text-[#717182] focus:border-sky-deep/30 focus:outline-none focus:ring-2 focus:ring-sky-deep/15 desktop:min-h-[95px] desktop:rounded-[20px] desktop:px-[13px] desktop:py-[9px] desktop:text-sm desktop:leading-5 desktop:tracking-[-0.1504px] desktop:font-normal desktop:text-ink-800';

export const CONTACT_SUBMIT_BUTTON_CLASS =
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-sky-deep px-3 text-sm font-medium tracking-[-0.15px] text-white transition-all duration-200 hover:shadow-[0_6px_22px_rgba(147,182,227,0.34)] disabled:cursor-not-allowed disabled:opacity-50';

export const CONTACT_PAGE_DESCRIPTION_CLASS =
  'max-w-[519px] text-base leading-6 tracking-[-0.3125px] text-black/47';
