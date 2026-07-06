/** Figma subcategory dropdown panel (node 486:366). */
export const CATEGORY_PILL_DROPDOWN_PANEL_CLASS =
  'w-64 overflow-hidden rounded-[20px] bg-white py-[13px] pl-[19px] pr-4 shadow-[0_8px_24px_rgba(74,85,101,0.12)]';

/** Figma subcategory list item (node 486:370). */
export const CATEGORY_PILL_DROPDOWN_ITEM_CLASS =
  'block text-left text-[14px] font-medium leading-[33px] tracking-[0.5px] text-sky-deep transition-colors hover:underline';

export const CATEGORY_PILL_DROPDOWN_ITEM_ACTIVE_CLASS = 'underline';

/** Active pill — invert sky-deep SVG assets to white on dark background. */
export const CATEGORY_PILL_ICON_ACTIVE_CLASS = 'brightness-0 invert';

export const CATEGORY_PILL_CHEVRON = {
  src: '/figma/filter-kids-chevron.svg',
  width: 14,
  height: 14,
  className: 'h-3.5 w-3.5 desktop:h-4 desktop:w-4 transition-transform duration-200',
} as const;

export const CATEGORY_PILL_CHEVRON_ACTIVE_CLASS = CATEGORY_PILL_ICON_ACTIVE_CLASS;

export const CATEGORY_PILL_CHEVRON_OPEN_CLASS = '-scale-y-100';
