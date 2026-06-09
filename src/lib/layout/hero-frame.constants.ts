import { STOREFRONT_CONTENT_MAX_WIDTH_CLASS } from './storefront-layout.constants';

/** Shared Figma storefront hero frame — width follows responsive content column. */
export const STOREFRONT_HERO_FRAME_CLASS = `relative mx-auto w-full overflow-hidden rounded-[28px] bg-white sm:rounded-[44px] lg:h-[940px] lg:rounded-t-[36px] lg:rounded-bl-[44px] lg:rounded-br-[44px] ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`;

/** Hero content vertical offset — aligns with HomeHero title block (top 255px). */
export const STOREFRONT_HERO_CONTENT_TOP_CLASS = 'pt-24 sm:pt-28 lg:pt-[255px]';

/** Overlap for content directly below the hero frame (matches home CategoryPosters). */
export const STOREFRONT_HERO_BELOW_OVERLAP_CLASS = 'lg:-mt-[30px]';
