import type { LanguageCode } from '../../lib/language';

/** Default desktop header nav link size (hy / ru). */
export const HEADER_NAV_LINK_FONT_SIZE_PX = 17;
export const HEADER_NAV_LINK_LINE_HEIGHT_PX = 26;

/** Slightly larger nav labels for English — longer words read small at 16px. */
export const HEADER_NAV_LINK_FONT_SIZE_EN_PX = 18;
export const HEADER_NAV_LINK_LINE_HEIGHT_EN_PX = 30;

const HEADER_NAV_LINK_BASE_CLASS = 'font-semibold tracking-[-0.3125px]';
const HEADER_NAV_LINK_TEXT_CLASS_EN = `text-[18px] leading-[30px] ${HEADER_NAV_LINK_BASE_CLASS}`;
const HEADER_NAV_LINK_TEXT_CLASS_DEFAULT = `text-[17px] leading-[26px] ${HEADER_NAV_LINK_BASE_CLASS}`;

/** Desktop header nav link typography for the active storefront language. */
export function getHeaderNavLinkTextClass(language: LanguageCode): string {
  return language === 'en' ? HEADER_NAV_LINK_TEXT_CLASS_EN : HEADER_NAV_LINK_TEXT_CLASS_DEFAULT;
}

/** Row height aligned with nav link line-height so the active pill centers correctly. */
export function getHeaderNavLinkRowClass(language: LanguageCode): string {
  return language === 'en' ? 'h-[30px]' : 'h-[26px]';
}
