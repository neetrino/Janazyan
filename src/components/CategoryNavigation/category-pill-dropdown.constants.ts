import { PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS } from '../../app/products/products-page-layout.constants';

/** Figma subcategory dropdown panel (node 486:366) — same radius as toolbar filter pills. */
export const CATEGORY_PILL_DROPDOWN_PANEL_CLASS =
  `w-64 overflow-hidden ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS} bg-white py-[13px] pl-[19px] pr-4 shadow-[0_8px_24px_rgba(74,85,101,0.12)]`;

/** Figma subcategory list item (node 486:370) — tight leading so same-category rows read as one group. */
export const CATEGORY_PILL_DROPDOWN_ITEM_CLASS =
  'block text-left text-[14px] font-medium leading-5 tracking-[0.5px] text-sky-deep transition-colors hover:underline py-0.5';

export const CATEGORY_PILL_DROPDOWN_ITEM_ACTIVE_CLASS = 'underline';

/** Active pill — invert sky-deep SVG assets to white on dark background. */
export const CATEGORY_PILL_ICON_ACTIVE_CLASS = 'brightness-0 invert';

/** Inactive pill hover — match active dark surface (requires `group` on the pill). */
export const CATEGORY_PILL_ICON_INACTIVE_HOVER_CLASS =
  'group-hover:brightness-0 group-hover:invert';

export const CATEGORY_PILL_CHEVRON = {
  src: '/figma/filter-kids-chevron.svg',
  width: 14,
  height: 14,
  className: 'h-3.5 w-3.5 desktop:h-4 desktop:w-4 transition-transform duration-200',
} as const;

export const CATEGORY_PILL_CHEVRON_ACTIVE_CLASS = CATEGORY_PILL_ICON_ACTIVE_CLASS;

export const CATEGORY_PILL_CHEVRON_OPEN_CLASS = '-scale-y-100';
