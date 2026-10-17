import { STOREFRONT_CONTENT_MAX_WIDTH_CLASS } from './storefront-layout.constants';

/** Desktop upward nudge — hero frame tucks under the header S-notch. */
export const HOME_HERO_DESKTOP_UPWARD_NUDGE_CLASS = 'lg:-mt-8';

/** Keeps the home hero inside the screen gutter so the card matches the header inset. */
export const HOME_HERO_BLEED_CLASS = HOME_HERO_DESKTOP_UPWARD_NUDGE_CLASS;

/** Shared Figma storefront hero frame — width follows responsive content column. */
export const STOREFRONT_HERO_FRAME_CLASS = `relative mx-auto w-full overflow-hidden rounded-[28px] bg-white sm:rounded-[44px] lg:h-[940px] lg:rounded-t-[36px] lg:rounded-bl-[44px] lg:rounded-br-[44px] ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`;

/** Hero content vertical offset — aligns with HomeHero title block (top 255px). */
export const STOREFRONT_HERO_CONTENT_TOP_CLASS = 'pt-24 sm:pt-28 lg:pt-[255px]';

/** Hero title block left inset — Figma paragraph x=43 on the 1388px frame (3.1%). */
export const STOREFRONT_HERO_CONTENT_INSET_LEFT_PX = 43;

export const STOREFRONT_HERO_CONTENT_INSET_LEFT_CLASS = 'left-[3.1%]';

/** Hero title block right inset — Figma paragraph inset 3.6% on the 1388px frame. */
export const STOREFRONT_HERO_CONTENT_INSET_RIGHT_CLASS = 'right-[3.6%]';

/** Overlap for content directly below the hero frame (matches home CategoryPosters). */
export const STOREFRONT_HERO_BELOW_OVERLAP_CLASS = 'lg:-mt-[30px]';
