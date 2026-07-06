/** Compact footer (Figma node 486:270) — tablet and small desktop only. */

/** Default top gap before compact footer (`mt-24`). */
export const FOOTER_COMPACT_DEFAULT_TOP_MARGIN_PX = 96;

export const FOOTER_COMPACT_SHELL_CLASS =
  'hidden md:max-[1649px]:block pointer-events-auto relative z-30 mt-24 w-full shrink-0 overflow-x-clip overflow-y-visible font-armenian';

export const FOOTER_COMPACT_SURFACE_CLASS =
  'relative h-[407px] overflow-visible rounded-t-[60px] border-t border-black/10 bg-gradient-to-b from-purple to-cream';

/** Side inset aligned with Figma (62–66px at 1024). */
export const FOOTER_COMPACT_INSET_CLASS = 'px-[6.05%]';

export const FOOTER_COMPACT_TOP_PADDING_CLASS = 'pt-[43px]';

export const FOOTER_COMPACT_SUPPORT_LIST_CLASS = 'mt-5 space-y-[9px]';

export const FOOTER_COMPACT_CONTACT_LIST_CLASS = 'mt-[19px] flex flex-col gap-[10px]';

export const FOOTER_COMPACT_SOCIAL_CLASS =
  'absolute left-[51.37%] top-[265px] z-10 flex gap-3';

export const FOOTER_COMPACT_PAYMENTS_CLASS =
  'absolute left-[6.05%] top-[275px] z-10 flex items-center gap-[11px]';

export const FOOTER_COMPACT_COPYRIGHT_CLASS =
  'absolute bottom-[56px] left-[6.05%] z-10 max-w-[88%] pt-[13px] text-left';

/** Nudge bottle decoration slightly right on laptop/tablet footer. */
export const FOOTER_COMPACT_DECORATION_RIGHT_OFFSET_PX = 104;

export const FOOTER_COMPACT_DECORATION_CLASS =
  'pointer-events-none absolute bottom-0 z-40 w-[43%] min-w-[330px] max-w-[430px]';
