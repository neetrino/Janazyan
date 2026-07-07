/** Figma footer surface — purple (top) → cream (bottom). */
export const FOOTER_SURFACE_GRADIENT_FROM_COLOR = '#B09FC8';

export const FOOTER_SURFACE_GRADIENT_TO_COLOR = '#FCF8EC';

export const FOOTER_SURFACE_GRADIENT_CSS = `linear-gradient(180deg, ${FOOTER_SURFACE_GRADIENT_FROM_COLOR} 0%, ${FOOTER_SURFACE_GRADIENT_TO_COLOR} 100%)`;

/** Tailwind utility for footer shell background. */
export const FOOTER_SURFACE_BACKGROUND_CLASS = 'bg-footer-surface';

/** Shared footer shell chrome — rounded top, hairline border, gradient fill. */
export const FOOTER_SURFACE_SHELL_CLASS = `${FOOTER_SURFACE_BACKGROUND_CLASS} overflow-visible rounded-t-[60px] border-t border-black/10`;
