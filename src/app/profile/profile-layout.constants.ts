/** Profile page — brand-aligned layout and surface tokens. */

export const PROFILE_PRIMARY_BUTTON_CLASS =
  'rounded-xl bg-sky-deep hover:bg-sky-deep/90 focus:ring-sky/60';

/** Shared corner radius for profile white surfaces. */
export const PROFILE_SURFACE_RADIUS_CLASS = 'rounded-3xl';

export const PROFILE_CARD_CLASS =
  `${PROFILE_SURFACE_RADIUS_CLASS} border border-sky-mist/70 bg-white p-6 shadow-sm ring-1 ring-sky-mist/40 sm:p-8 lg:p-9`;

export const PROFILE_SECTION_TITLE_CLASS =
  'text-lg font-bold tracking-tight text-ink-800 sm:text-xl';

export const PROFILE_BODY_TEXT_CLASS = 'text-sm text-ink-600';

export const PROFILE_MUTED_TEXT_CLASS = 'text-xs text-ink-500 sm:text-sm';

export const PROFILE_LABEL_TEXT_CLASS =
  'text-[10px] font-semibold uppercase tracking-wide text-ink-500 sm:text-xs';

export const PROFILE_BORDER_DIVIDER_CLASS = 'border-b border-sky-mist/50';

export const PROFILE_ORDER_ROW_CLASS =
  `${PROFILE_SURFACE_RADIUS_CLASS} block border border-sky-mist/60 bg-white p-5 transition hover:border-sky-soft hover:shadow-sm sm:p-6`;

export const PROFILE_STAT_CARD_CLASS =
  `relative overflow-hidden ${PROFILE_SURFACE_RADIUS_CLASS} border border-sky-mist/70 bg-white p-6 shadow-sm ring-1 ring-sky-mist/40 sm:p-7`;

export const PROFILE_DESKTOP_MAIN_SURFACE_CLASS =
  `space-y-6 ${PROFILE_SURFACE_RADIUS_CLASS} bg-white p-5 shadow-sm ring-1 ring-sky-mist/60 sm:p-7 md:space-y-8 lg:p-9`;

export const PROFILE_SIDEBAR_SURFACE_CLASS =
  `flex w-full flex-col overflow-hidden ${PROFILE_SURFACE_RADIUS_CLASS} border border-sky-mist/60 bg-gradient-to-b from-sky-mist/35 to-cream/80 shadow-inner ring-1 ring-sky/20`;

export const PROFILE_SIDEBAR_IDENTITY_PANEL_CLASS =
  'border-b border-sky-mist/50 bg-sky-mist/20 p-5 sm:p-6';

export const PROFILE_SIDEBAR_NAV_PANEL_CLASS = 'p-3 sm:bg-sky-mist/10 sm:p-4';

export const PROFILE_CONTACT_CHIP_CLASS =
  'flex items-start gap-2.5 rounded-2xl border border-sky-mist/60 bg-white px-4 py-3 shadow-sm backdrop-blur-sm';

export const PROFILE_TAB_ACTIVE_DESKTOP_CLASS =
  'sm:border-l-[3px] sm:border-sky-deep sm:bg-sky/20 sm:pl-[calc(0.75rem-3px)] sm:text-ink-800 sm:shadow-sm';

export const PROFILE_TAB_INACTIVE_DESKTOP_CLASS =
  'sm:border-l-[3px] sm:border-transparent sm:text-ink-600 sm:hover:bg-sky/10 sm:hover:text-ink-800';

export const PROFILE_TAB_ACTIVE_MOBILE_CLASS =
  'max-sm:border-2 max-sm:border-sky-deep max-sm:bg-white max-sm:text-ink-800 max-sm:shadow-sm';

export const PROFILE_TAB_INACTIVE_MOBILE_CLASS =
  'max-sm:border max-sm:border-sky-mist/80 max-sm:bg-white/50 max-sm:text-ink-700 max-sm:hover:border-sky-soft max-sm:hover:bg-white/80';

export const PROFILE_TAB_ICON_ACTIVE_CLASS =
  'bg-sky/25 text-sky-deep shadow-sm max-sm:bg-sky/20';

export const PROFILE_TAB_ICON_INACTIVE_CLASS = 'bg-sky-mist/40 text-ink-500';

export const PROFILE_DELETE_TAB_INACTIVE_DESKTOP_CLASS =
  'sm:border-l-[3px] sm:border-transparent sm:text-sale sm:hover:bg-sale/10 sm:hover:text-sale';

export const PROFILE_DELETE_TAB_ACTIVE_DESKTOP_CLASS =
  'sm:border-l-[3px] sm:border-sale sm:bg-sale/10 sm:pl-[calc(0.75rem-3px)] sm:text-sale sm:shadow-sm';

export const PROFILE_DELETE_TAB_ACTIVE_MOBILE_CLASS =
  'max-sm:border-2 max-sm:border-sale max-sm:bg-sale/5 max-sm:text-sale max-sm:shadow-sm';

export const PROFILE_DELETE_TAB_INACTIVE_MOBILE_CLASS =
  'max-sm:border max-sm:border-sale/30 max-sm:bg-white/50 max-sm:text-sale max-sm:hover:border-sale/50 max-sm:hover:bg-sale/5';

export const PROFILE_DELETE_TAB_ICON_CLASS = 'bg-sale/15 text-sale';

export const PROFILE_LOGOUT_BUTTON_CLASS =
  'flex w-full items-center gap-3 rounded-md border-l-[3px] border-transparent px-3 py-2 text-left text-sm font-medium text-sale transition-colors hover:bg-sale/10 hover:text-sale';

export const PROFILE_LOGOUT_ICON_CLASS =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sale/15 text-sale';

export const PROFILE_MOBILE_MENU_SURFACE_CLASS =
  `${PROFILE_SURFACE_RADIUS_CLASS} divide-y divide-sky-mist/40 overflow-hidden border border-sky-mist/70 bg-white shadow-sm ring-1 ring-sky-mist/40`;

/** White content block inside the mobile bottom sheet. */
export const PROFILE_MOBILE_COMPACT_SURFACE_CLASS =
  `${PROFILE_SURFACE_RADIUS_CLASS} border border-sky-mist/60 bg-white p-5 shadow-sm ring-1 ring-sky-mist/40 sm:p-6`;

export const PROFILE_MOBILE_ROW_CLASS =
  'flex w-full items-center justify-between px-5 py-4 text-left';

export const PROFILE_MOBILE_ROW_LABEL_CLASS =
  'flex items-center gap-3 text-base font-medium text-ink-800';

export const PROFILE_MOBILE_ROW_ICON_CLASS = 'text-ink-500';

export const PROFILE_MOBILE_CHEVRON_CLASS = 'h-5 w-5 text-ink-400';

export const PROFILE_DELETE_MOBILE_ROW_CLASS =
  'flex w-full items-center justify-between px-5 py-4 text-left text-sale';

export const PROFILE_DELETE_MOBILE_ROW_LABEL_CLASS =
  'flex items-center gap-3 text-base font-medium text-sale';

export const PROFILE_DELETE_MOBILE_ROW_ICON_CLASS = 'text-sale';

export const PROFILE_FORM_SURFACE_CLASS =
  `mb-8 space-y-5 ${PROFILE_SURFACE_RADIUS_CLASS} border border-dashed border-sky-mist bg-sky-mist/20 p-5 sm:mb-10 sm:p-6`;

export const PROFILE_SUCCESS_ALERT_CLASS =
  'rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success';

export const PROFILE_ERROR_ALERT_CLASS =
  'rounded-lg border border-sale/30 bg-sale/10 p-4 text-sm text-sale';

export const PROFILE_DELETE_CARD_CLASS =
  `${PROFILE_SURFACE_RADIUS_CLASS} border border-sale/40 bg-sale/5 p-6 shadow-sm ring-1 ring-sale/20 sm:p-8 lg:p-9`;

export const PROFILE_DELETE_BUTTON_CLASS =
  'h-11 w-full rounded-xl !bg-sale hover:!bg-sale/90 focus:!ring-sale/50 sm:w-auto';

export const PROFILE_SPINNER_CLASS =
  'h-11 w-11 animate-spin rounded-full border-2 border-sky-mist border-t-sky-deep';

export const PROFILE_DEFAULT_BADGE_CLASS =
  'rounded-md bg-sky/25 px-2 py-1 text-xs font-medium text-sky-deep';

export const PROFILE_ASIDE_BORDER_CLASS = 'md:border-r md:border-sky-mist/60';

/** Mobile sheet — above MobileBottomNav (z-70) when portaled to body. */
export const PROFILE_MOBILE_SHEET_OVERLAY_Z_CLASS = 'z-[120]';

/** Mobile sheet form actions — cancel above save so it is not clipped by bottom chrome. */
export const PROFILE_MOBILE_FORM_ACTIONS_CLASS = 'flex flex-col gap-3 pt-2';

/** Desktop form actions — primary on the right. */
export const PROFILE_DESKTOP_FORM_ACTIONS_CLASS =
  'flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4';
