/** Compact footer (Figma node 486:270) — tablet and small desktop only. */

/** Default top gap before compact footer (`mt-24`). */
export const FOOTER_COMPACT_DEFAULT_TOP_MARGIN_PX = 96;

/** Compact footer shell — clip horizontal overflow, keep vertical bleed visible. */
export const FOOTER_COMPACT_SHELL_CLASS =
  'hidden md:max-[1649px]:block pointer-events-auto relative z-30 w-full shrink-0 overflow-visible font-armenian';

export const FOOTER_COMPACT_SURFACE_CLASS =
  'relative h-[407px] overflow-visible rounded-t-[60px] border-t border-black/10 bg-gradient-to-b from-purple to-cream';

/** Frame stays inside the footer; overflow past the right edge is clipped. */
export const FOOTER_BOTTLE_FRAME_CLASS =
  'pointer-events-none absolute bottom-0 right-0 z-[1] h-[720px] w-[640px] max-w-[62%] overflow-hidden';

/** Shifts the photo so the bottle sits on the right edge; the frame clips the rest. */
export const FOOTER_BOTTLE_CLASS =
  'h-full w-full translate-x-[21%] object-contain object-bottom';
/** Side inset aligned with Figma (62–66px at 1024). */
export const FOOTER_COMPACT_INSET_CLASS = 'px-[6.05%]';

export const FOOTER_COMPACT_TOP_PADDING_CLASS = 'pt-[43px]';

export const FOOTER_COMPACT_SUPPORT_LIST_CLASS = 'mt-5 space-y-[9px] whitespace-normal';

export const FOOTER_COMPACT_CONTACT_LIST_CLASS = 'mt-[19px] flex flex-col gap-[10px]';

export const FOOTER_COMPACT_SOCIAL_CLASS =
  'absolute left-[51.37%] top-[265px] z-10 flex gap-3';

export const FOOTER_COMPACT_PAYMENTS_CLASS =
  'absolute left-[6.05%] top-[275px] z-10 flex items-center gap-[11px]';

export const FOOTER_COMPACT_COPYRIGHT_CLASS =
  'absolute bottom-[56px] left-[6.05%] z-10 max-w-[88%] pt-[13px] text-left';
