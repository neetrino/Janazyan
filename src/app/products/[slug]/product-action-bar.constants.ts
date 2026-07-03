export const PDP_ACTION_STACK_CLASS = 'flex flex-col gap-4 lg:gap-0';

export const PDP_ACTION_ROW_CLASS = 'flex items-center gap-4';

export const PDP_SECONDARY_ACTION_ROW_CLASS = 'flex items-center justify-end gap-4 lg:hidden';

export const PDP_DESKTOP_ICON_ACTIONS_CLASS = 'hidden shrink-0 items-center gap-4 lg:flex';

/** Shared frosted water-glass surface for PDP controls. */
export const PDP_GLASS_SURFACE_CLASS =
  'border border-white/55 bg-gradient-to-b from-white/55 to-sky-mist/35 shadow-[0_4px_24px_rgba(147,182,227,0.22)] backdrop-blur-[14px]';

export const PDP_GLASS_SURFACE_HOVER_CLASS =
  'transition-all duration-200 hover:border-white/70 hover:from-white/65 hover:to-sky-mist/45 hover:shadow-[0_6px_28px_rgba(147,182,227,0.3)]';

/** Solid #93B6E3 surface for PDP action buttons. */
export const PDP_SKY_SURFACE_CLASS =
  'border border-sky-deep bg-sky-deep shadow-[0_4px_24px_rgba(147,182,227,0.28)]';

export const PDP_SKY_SURFACE_HOVER_CLASS =
  'transition-all duration-200 hover:border-sky-deep hover:bg-sky-deep hover:shadow-[0_6px_28px_rgba(147,182,227,0.36)]';

/**
 * Single frosted water-glass capsule — − qty + inside one pill (reference: borboraqua).
 */
export const PDP_QTY_GLASS_CAPSULE_CLASS = `inline-flex h-14 shrink-0 items-center gap-0.5 rounded-full px-2 ${PDP_SKY_SURFACE_CLASS}`;

export const PDP_QTY_STEP_BUTTON_CLASS =
  'flex size-11 items-center justify-center rounded-full text-[26px] font-medium leading-none text-white transition-all duration-200 active:bg-white/50 disabled:cursor-not-allowed disabled:opacity-35';

export const PDP_QTY_VALUE_CLASS =
  'min-w-[2.25rem] px-1 text-center text-lg font-semibold tabular-nums text-white';

/** Compact water-glass qty capsule — cart drawer line items. */
export const CART_QTY_GLASS_CAPSULE_CLASS = `inline-flex h-10 shrink-0 items-center gap-0.5 rounded-full px-1.5 ${PDP_SKY_SURFACE_CLASS}`;

export const CART_QTY_STEP_BUTTON_CLASS =
  'flex size-8 items-center justify-center rounded-full text-xl font-medium leading-none text-white transition-all duration-200 active:bg-white/50 disabled:cursor-not-allowed disabled:opacity-35';

export const CART_QTY_VALUE_CLASS =
  'min-w-[1.75rem] px-0.5 text-center text-sm font-semibold tabular-nums text-white';

/** Black pill — default + hover stay dark with soft lift. */
export const PDP_BLACK_PILL_BUTTON_CLASS =
  'inline-flex items-center justify-center rounded-full bg-primary text-white transition-all duration-200 hover:bg-ink-900 hover:shadow-[0_6px_22px_rgba(0,0,0,0.28)] active:scale-[0.98]';

/** Sky pill — PDP review actions in the requested #93B6E3 brand tone. */
export const PDP_SKY_PILL_BUTTON_CLASS =
  'inline-flex items-center justify-center rounded-full bg-sky-deep text-white transition-all duration-200 hover:bg-sky-deep hover:shadow-[0_6px_22px_rgba(147,182,227,0.34)] active:scale-[0.98]';

/** Black pill CTA — separate from quantity glass capsule. */
export const PDP_ADD_TO_CART_CLASS = `flex h-14 flex-1 px-4 text-sm font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:hover:bg-neutral-300 disabled:hover:shadow-none disabled:active:scale-100 ${PDP_BLACK_PILL_BUTTON_CLASS}`;

/** Glass pill label — dark text only, surface stays water-glass. */
export const PDP_GLASS_PILL_TEXT_CLASS = 'text-ink-800 hover:text-sky-deep';

/** PDP sky action label — white text on #93B6E3 buttons. */
export const PDP_SKY_PILL_TEXT_CLASS = 'text-white hover:text-white';

/** Reviews count link — sky button, white text. */
export const PDP_REVIEWS_BUTTON_CLASS = `inline-flex h-9 items-center rounded-full px-4 text-sm font-medium ${PDP_SKY_PILL_TEXT_CLASS} ${PDP_SKY_SURFACE_CLASS} ${PDP_SKY_SURFACE_HOVER_CLASS}`;

/** Write review CTA — sky button, white text. */
export const PDP_WRITE_REVIEW_BUTTON_CLASS = `inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold ${PDP_SKY_PILL_TEXT_CLASS} ${PDP_SKY_SURFACE_CLASS} ${PDP_SKY_SURFACE_HOVER_CLASS}`;

/** Review form submit — sky pill, compact height. */
export const PDP_REVIEW_SUBMIT_BUTTON_CLASS = `h-10 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:hover:bg-neutral-300 disabled:hover:shadow-none disabled:active:scale-100 ${PDP_SKY_PILL_BUTTON_CLASS}`;

/** Inline glass pill — cart empty state, secondary CTAs. */
export const STOREFRONT_GLASS_PILL_BUTTON_CLASS = `inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-wide ${PDP_GLASS_PILL_TEXT_CLASS} ${PDP_GLASS_SURFACE_CLASS} ${PDP_GLASS_SURFACE_HOVER_CLASS}`;

/** Inline sky pill — storefront CTAs that need the #93B6E3 button treatment. */
export const STOREFRONT_SKY_PILL_BUTTON_CLASS = `inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-wide ${PDP_SKY_PILL_TEXT_CLASS} ${PDP_SKY_SURFACE_CLASS} ${PDP_SKY_SURFACE_HOVER_CLASS}`;

const STOREFRONT_GLASS_SUBMIT_BUTTON_BASE = `inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${PDP_GLASS_PILL_TEXT_CLASS} ${PDP_GLASS_SURFACE_CLASS} ${PDP_GLASS_SURFACE_HOVER_CLASS}`;

const STOREFRONT_SKY_SUBMIT_BUTTON_BASE = `inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${PDP_SKY_PILL_TEXT_CLASS} ${PDP_SKY_SURFACE_CLASS} ${PDP_SKY_SURFACE_HOVER_CLASS}`;

/** Rounded glass inputs — contact and storefront forms. */
export const STOREFRONT_GLASS_INPUT_CLASS = `!rounded-full py-3 px-5 !border-white/55 ${PDP_GLASS_SURFACE_CLASS} focus:!border-white/70 focus:ring-sky-deep/15`;

export const STOREFRONT_GLASS_TEXTAREA_CLASS = `!rounded-3xl px-5 py-4 !border-white/55 ${PDP_GLASS_SURFACE_CLASS} focus:!border-white/70 focus:ring-2 focus:ring-sky-deep/15 focus:outline-none`;

/** Full-width glass pill — contact / cart checkout / form submit. */
export const STOREFRONT_GLASS_SUBMIT_BUTTON_CLASS = `${STOREFRONT_GLASS_SUBMIT_BUTTON_BASE} w-full uppercase tracking-wide`;

/** Full-width sky pill — cart / checkout primary submit actions. */
export const STOREFRONT_SKY_SUBMIT_BUTTON_CLASS = `${STOREFRONT_SKY_SUBMIT_BUTTON_BASE} w-full uppercase tracking-wide`;

/** Flex glass pill — checkout modals (side-by-side actions). */
export const STOREFRONT_GLASS_SUBMIT_BUTTON_FLEX_CLASS = `${STOREFRONT_GLASS_SUBMIT_BUTTON_BASE} min-w-0 flex-1 uppercase tracking-wide`;

/** Flex sky pill — checkout modal primary actions. */
export const STOREFRONT_SKY_SUBMIT_BUTTON_FLEX_CLASS = `${STOREFRONT_SKY_SUBMIT_BUTTON_BASE} min-w-0 flex-1 uppercase tracking-wide`;

/** Secondary glass pill — cancel / outline actions. */
export const STOREFRONT_GLASS_SECONDARY_BUTTON_CLASS = `${STOREFRONT_GLASS_SUBMIT_BUTTON_BASE} min-w-0 flex-1`;

/** Inline glass action — store cards, paired CTAs. */
export const STOREFRONT_GLASS_ACTION_BUTTON_CLASS = `inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${PDP_GLASS_PILL_TEXT_CLASS} ${PDP_GLASS_SURFACE_CLASS} ${PDP_GLASS_SURFACE_HOVER_CLASS}`;

/** Inline sky action — checkout promo and compact CTAs. */
export const STOREFRONT_SKY_ACTION_BUTTON_CLASS = `inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${PDP_SKY_PILL_TEXT_CLASS} ${PDP_SKY_SURFACE_CLASS} ${PDP_SKY_SURFACE_HOVER_CLASS}`;

/** Compact glass action — store carousel side cards. */
export const STOREFRONT_GLASS_ACTION_BUTTON_COMPACT_CLASS = `flex w-full cursor-pointer items-center justify-center rounded-full px-2 py-1.5 text-[10px] font-medium leading-tight transition-all duration-200 active:scale-[0.98] ${PDP_GLASS_PILL_TEXT_CLASS} ${PDP_GLASS_SURFACE_CLASS} ${PDP_GLASS_SURFACE_HOVER_CLASS}`;

/** Compare / wishlist icon buttons — glass circles. */
export const PDP_GLASS_ICON_BUTTON_CLASS = `flex size-12 items-center justify-center rounded-full text-white ${PDP_SKY_SURFACE_CLASS} ${PDP_SKY_SURFACE_HOVER_CLASS} active:scale-95`;

export const PDP_GLASS_ICON_BUTTON_ACTIVE_CLASS =
  'border-sky-deep bg-sky-deep text-white shadow-[0_6px_28px_rgba(147,182,227,0.36)]';

/** Selected / active glass action. */
export const STOREFRONT_GLASS_ACTION_BUTTON_ACTIVE_CLASS = PDP_GLASS_ICON_BUTTON_ACTIVE_CLASS;
