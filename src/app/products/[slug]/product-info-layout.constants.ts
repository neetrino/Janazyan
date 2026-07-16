/** PDP two-column stage — stretch so the info column matches gallery height. */
export const PDP_STAGE_GRID_CLASS =
  'grid grid-cols-1 gap-12 lg:grid-cols-[55%_45%] lg:items-stretch';

/** PDP right column — fills gallery height; action bar pins with mt-auto. */
export const PDP_INFO_COLUMN_CLASS = 'flex h-full min-h-0 flex-1 flex-col pt-0';

/** Pins qty / add-to-cart / wishlist to the gallery bottom edge. */
export const PDP_INFO_ACTIONS_WRAPPER_CLASS = 'mt-auto shrink-0 pt-0';

/**
 * Variant selectors slot — reserved on lg so the action row does not jump
 * when attributes hydrate in.
 */
export const PDP_VARIANT_SLOT_CLASS =
  'mb-8 lg:min-h-[188px] lg:max-h-[188px] lg:overflow-y-auto';

/** Description block — stable height before/after hydrate. */
export const PDP_DESCRIPTION_SLOT_CLASS = 'mb-8 min-h-[72px]';
