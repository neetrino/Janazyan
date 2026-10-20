/**
 * PDP stage. From lg the info column is pinned to the gallery frame:
 * title at the top edge, actions at the bottom edge.
 */
export const PDP_STAGE_GRID_CLASS =
  'relative grid grid-cols-1 gap-12 lg:grid-cols-[42%_1fr] lg:items-start';

/** Info column box — in flow on phones, stretched to the frame from lg. */
export const PDP_INFO_COLUMN_SHELL_CLASS =
  'flex min-h-0 flex-col lg:absolute lg:inset-y-0 lg:left-[calc(42%+3rem)] lg:right-0';

/** PDP right column — fills the gallery frame; title at the top, actions at the bottom. */
export const PDP_INFO_COLUMN_CLASS = 'flex h-full min-h-0 w-full flex-1 flex-col pt-0';

/** Pins qty / add-to-cart / wishlist to the gallery bottom edge. */
/** Pins the one-line action row to the bottom edge of the gallery frame. */
export const PDP_INFO_ACTIONS_WRAPPER_CLASS = 'mt-auto shrink-0 pt-0';

/**
 * Variant selectors slot — reserved on lg so the action row does not jump
 * when attributes hydrate in.
 */
export const PDP_VARIANT_SLOT_CLASS =
  'mb-8 lg:min-h-[188px] lg:max-h-[188px] lg:overflow-y-auto';

/** Description block — stable height before/after hydrate. */
export const PDP_DESCRIPTION_SLOT_CLASS = 'mb-8 min-h-[72px]';
