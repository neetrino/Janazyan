/** Login page — Figma node 505:631 */

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
  'lg:relative lg:-mt-[122px] lg:-mb-8 lg:py-0 lg:overflow-visible lg:rounded-tl-[36px]';

/** Section root — isolated stacking context for hero vs content layers. */
export const LOGIN_SECTION_STACK_CLASS = 'relative isolate lg:min-h-[828px]';

/** Left hero column — absolute on desktop, behind interactive content. */
export const LOGIN_HERO_LEFT_COLUMN_CLASS =
  'lg:absolute lg:inset-y-0 lg:left-0 lg:z-0 lg:h-[828px]';

/** Left clip wrapper — same bleed as contact, pinned behind form. */
export const LOGIN_HERO_LEFT_CLIP_CLASS =
  'contact-hero-viewport-bleed lg:absolute lg:top-0 lg:-bottom-8 lg:left-0 lg:z-0 lg:w-[516px] lg:overflow-visible lg:rounded-tl-[36px]';

/** Right decoration — Figma 508:858, overlaps form card on the right (above content). */
export const LOGIN_HERO_RIGHT_WRAPPER_CLASS =
  'login-hero-right-viewport-bleed pointer-events-none absolute z-20 hidden lg:block lg:top-[282px] lg:h-[497px] lg:w-[594px]';

/** Figma 508:858 — vertical mirror. */
export const LOGIN_HERO_RIGHT_FLIP_CLASS = '-scale-y-100 rotate-180';

/** Center stack — heading + form; below right decoration overlap. */
export const LOGIN_CENTER_COLUMN_CLASS =
  'relative z-10 mx-auto flex w-full max-w-[583px] flex-col items-center px-1 pb-24 pt-8 lg:pb-12 lg:pt-[65px]';

/** Figma 505:848 — Mirage title + subtitle gap. */
export const LOGIN_HEADING_STACK_CLASS = 'mb-6 flex w-full flex-col items-center gap-2.5 text-center lg:mb-8';

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
