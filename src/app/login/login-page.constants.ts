/** Login page — Figma node 505:631 */

import { STOREFRONT_CONTENT_MAX_WIDTH_PX } from '../../lib/layout/storefront-layout.constants';

/** Fixed artboard for tablet/mobile scale — same coordinates as desktop layout. */
export const AUTH_PAGE_ARTBOARD_WIDTH_PX = STOREFRONT_CONTENT_MAX_WIDTH_PX;
export const AUTH_PAGE_ARTBOARD_HEIGHT_PX = 828;

export const AUTH_PAGE_SCALE_HOST_CLASS = 'auth-page-scale-host @container relative w-full';
export const AUTH_PAGE_SCALE_VIEWPORT_CLASS = 'auth-page-scale-viewport relative mx-auto w-full';
export const AUTH_PAGE_SCALE_ARTBOARD_CLASS = 'auth-page-scale-artboard relative';

export const LOGIN_HERO_LEFT_IMAGE_SRC = '/figma/contact-hero.png';
export const LOGIN_HERO_RIGHT_IMAGE_SRC = '/figma/login-hero-decoration.png';

/** Left hero — Figma node 513:865 (487×865). */
export const LOGIN_HERO_LEFT_WIDTH_PX = 487;
export const LOGIN_HERO_LEFT_HEIGHT_PX = 865;

/** Right decoration — Figma node 508:858 (594×497), mirrored vertically. */
export const LOGIN_HERO_RIGHT_WIDTH_PX = 594;
export const LOGIN_HERO_RIGHT_HEIGHT_PX = 497;

/** Vertical offset of right decoration from left hero top — Figma 422 − 140. */
export const LOGIN_HERO_RIGHT_TOP_OFFSET_PX = 282;

export {
  CONTACT_HERO_CLIP_BOTTOM_BLEED_CLASS,
  CONTACT_HERO_CLIP_WRAPPER_CLASS,
  CONTACT_HERO_COLUMN_CLASS,
  CONTACT_HERO_DESKTOP_DROP_CLASS,
  CONTACT_HERO_DESKTOP_SCALE_CLASS,
  CONTACT_HERO_FOOTER_BLEED_CLASS,
  CONTACT_HERO_FRAME_CLASS,
  CONTACT_HERO_IMAGE_CLASS,
  CONTACT_HERO_IMAGE_RADIUS_CLASS,
  CONTACT_HERO_WALL_BLEED_CLASS,
  CONTACT_HERO_WIDTH_CLASS,
  CONTACT_HERO_WIDTH_PX,
  CONTACT_SECTION_DESKTOP_BLEED_CLASS,
} from '../contact/contact-page.constants';

/** Catalog bleed — same pull-up + footer overlap as contact hero. */
export const LOGIN_SECTION_DESKTOP_BLEED_CLASS =
  'desktop:relative desktop:-mt-[122px] desktop:-mb-8 desktop:py-0 desktop:overflow-visible desktop:rounded-tl-[36px]';

/** Section root — isolated stacking context for hero vs content layers. */
export const LOGIN_SECTION_STACK_CLASS = 'relative isolate min-h-[828px]';

/** Left hero column — absolute, behind interactive content. */
export const LOGIN_HERO_LEFT_COLUMN_CLASS =
  'pointer-events-none absolute inset-y-0 left-0 z-0 h-[828px]';

/** Left clip wrapper — viewport bleed on desktop only; fixed left edge when scaled. */
export const LOGIN_HERO_LEFT_CLIP_CLASS =
  'login-hero-left-clip absolute top-0 -bottom-8 left-0 z-0 w-[516px] overflow-visible rounded-tl-[36px]';

/** Right decoration — Figma 508:858, overlaps form card on the right (above content). */
export const LOGIN_HERO_RIGHT_WRAPPER_CLASS =
  'login-hero-right-clip pointer-events-none absolute right-0 top-[282px] z-20 h-[497px] w-[594px]';

/** Login left hero — fixed desktop frame (used inside scaled artboard and on desktop). */
export const LOGIN_HERO_LEFT_WALL_CLASS =
  'pointer-events-none absolute left-0 top-[88px] z-0 mx-0 h-[860px] w-[484px] shrink-0 origin-top-left scale-[0.96]';

export const LOGIN_HERO_LEFT_FRAME_CLASS =
  'relative h-[860px] w-[484px] overflow-hidden rounded-tl-[36px]';

export const LOGIN_HERO_LEFT_IMAGE_CLASS =
  'object-cover object-left-top rounded-bl-[14px] rounded-br-[14px] rounded-tr-[14px]';

/** Figma 508:858 — vertical mirror. */
export const LOGIN_HERO_RIGHT_FLIP_CLASS = '-scale-y-100 rotate-180';

/** Center stack — heading + form; below right decoration overlap. */
export const LOGIN_CENTER_COLUMN_CLASS =
  'relative z-10 mx-auto flex w-full max-w-[583px] flex-col items-center px-1 pb-12 pt-[65px]';

/** Mobile auth — centered column with white form card (no hero art). */
export const AUTH_MOBILE_CENTER_COLUMN_CLASS =
  'mx-auto flex w-full max-w-[509px] flex-col items-center px-3 pb-12 pt-6 sm:px-4';

/** Phone only — simple centered form without hero artboard. */
export const AUTH_PAGE_PHONE_ONLY_CLASS = 'md:hidden';

/** Tablet and up — Figma hero artboard (scaled below desktop breakpoint). */
export const AUTH_PAGE_TABLET_HERO_CLASS = 'hidden md:block';

/** Figma 505:848 — Mirage title + subtitle gap. */
export const LOGIN_HEADING_STACK_CLASS = 'mb-8 flex w-full flex-col items-center gap-2.5 text-center';

/** Figma 505:851 — subtitle under Mirage title. */
export const LOGIN_SUBTITLE_CLASS =
  'max-w-[467px] text-base leading-6 tracking-[-0.3125px] text-black/47';

/** Figma 505:808 — outer form shell. */
export const LOGIN_FORM_SHELL_CLASS = 'relative w-full max-w-[509px]';

/** Figma 505:809 — solid white card (not glass). */
export const LOGIN_FORM_CARD_CLASS =
  'flex w-full flex-col items-center gap-[18px] rounded-[34px] bg-white p-8 sm:p-12';

/** Figma 505:809 — input field icons. */
export const LOGIN_INPUT_MAIL_ICON_SRC = '/figma/login-input-mail.svg';
export const LOGIN_INPUT_LOCK_ICON_SRC = '/figma/login-input-lock.svg';
export const LOGIN_INPUT_EYE_OFF_ICON_SRC = '/figma/login-input-eye-off.svg';
export const LOGIN_CHECKBOX_SQUARE_ICON_SRC = '/figma/login-checkbox-square.svg';

/** Figma 505:813 — form stack gap 20px. */
export const LOGIN_FORM_STACK_CLASS = 'flex w-full flex-col gap-5';

/** Figma 505:814 — email + password group gap 16px. */
export const LOGIN_FORM_FIELDS_CLASS = 'flex w-full flex-col gap-4';

/** Figma 505:815/820 — label + input gap 6px. */
export const LOGIN_FORM_FIELD_GROUP_CLASS = 'flex w-full flex-col gap-1.5';

/** Figma 505:816/821 — field labels. */
export const LOGIN_FORM_LABEL_CLASS =
  'text-base font-medium leading-normal tracking-[-0.24px] text-[#232323]';

/** Figma 505:817/822 — pill input shell. */
export const LOGIN_FORM_INPUT_SHELL_CLASS =
  'flex h-12 w-full items-center gap-3.5 rounded-[42px] bg-[#f3f3f5] px-4 py-3.5';

/** Figma 505:819/824 — inner text input. */
export const LOGIN_FORM_INPUT_CLASS =
  'min-w-0 flex-1 border-0 bg-transparent text-base font-medium leading-normal tracking-[-0.24px] text-[#232323] placeholder:font-normal placeholder:text-[#717182] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50';

/** Figma 505:841 — primary submit button. */
export const LOGIN_SUBMIT_BUTTON_CLASS =
  'inline-flex h-12 w-full items-center justify-center rounded-[30px] bg-sky-deep px-3 text-base font-semibold leading-7 text-white transition-all duration-200 hover:shadow-[0_6px_22px_rgba(147,182,227,0.34)] disabled:cursor-not-allowed disabled:opacity-50';

/** Figma 505:826 — button + options group gap 16px. */
export const LOGIN_FORM_ACTIONS_CLASS = 'flex w-full flex-col gap-4';

/** Figma 505:829 — remember me + forgot password row. */
export const LOGIN_FORM_OPTIONS_ROW_CLASS = 'flex flex-wrap items-center gap-[34px]';

/** Figma 505:830 — remember me control. */
export const LOGIN_REMEMBER_ROW_CLASS = 'flex cursor-pointer items-center gap-2.5';

export const LOGIN_REMEMBER_TEXT_CLASS = 'text-base font-medium leading-normal text-[#9c9c9c]';

/** Figma 505:833 — forgot password link. */
export const LOGIN_FORGOT_LINK_CLASS =
  'text-base font-medium leading-normal text-[#9c9c9c] underline decoration-solid hover:text-[#6c6c6c]';

/** Figma 505:834 — sign-up footer line. */
export const LOGIN_SIGNUP_FOOTER_CLASS = 'text-center text-base leading-normal text-[#6c6c6c]';

export const LOGIN_SIGNUP_LINK_CLASS = 'font-semibold text-[#256dff] hover:underline';
