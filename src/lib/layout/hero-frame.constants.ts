import { STOREFRONT_CONTENT_MAX_WIDTH_CLASS, STOREFRONT_SIDE_PADDING_NEG_CLASS } from './storefront-layout.constants';

/** Cancel shell side padding so the home hero spans the full content column width. */
export const HOME_HERO_BLEED_CLASS = `${STOREFRONT_SIDE_PADDING_NEG_CLASS} lg:-mt-6`;

/** Shared Figma storefront hero frame — width follows responsive content column. */
export const STOREFRONT_HERO_FRAME_CLASS = `relative mx-auto w-full overflow-hidden rounded-[28px] bg-white sm:rounded-[44px] lg:h-[940px] lg:rounded-t-[36px] lg:rounded-bl-[44px] lg:rounded-br-[44px] ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`;

/** Hero content vertical offset — aligns with HomeHero title block (top 255px). */
export const STOREFRONT_HERO_CONTENT_TOP_CLASS = 'pt-24 sm:pt-28 lg:pt-[255px]';

/** Hero title / CTA block inset inside the hero frame (Figma x=43 at 1470px; scaled to 25 at column edge). */
export const STOREFRONT_HERO_CONTENT_INSET_LEFT_PX = 25;

export const STOREFRONT_HERO_CONTENT_INSET_LEFT_CLASS = 'left-[25px]';

/** Overlap for content directly below the hero frame (matches home CategoryPosters). */
export const STOREFRONT_HERO_BELOW_OVERLAP_CLASS = 'lg:-mt-[30px]';
