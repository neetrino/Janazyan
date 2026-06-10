/** PDP main hero image container — soft sky panel with large radius (Figma PDP). */
export const PDP_GALLERY_MAIN_PANEL_CLASS =
  'relative aspect-square overflow-hidden rounded-[28px] bg-sky-mist/40 shadow-soft lg:rounded-[36px]';

/** Inner wrapper fills the padded hero panel so the main image can use `fill`. */
export const PDP_GALLERY_MAIN_IMAGE_INSET_CLASS =
  'relative h-full w-full';

/** Padding inside the hero panel — keeps product photography centered with breathing room. */
export const PDP_GALLERY_MAIN_PADDING_CLASS = 'p-6 sm:p-8 lg:p-10';

/** Vertical thumbnail strip width. */
export const PDP_GALLERY_THUMB_WIDTH_CLASS = 'w-[88px]';

/** Thumbnail tile shape and surface. */
export const PDP_GALLERY_THUMB_TILE_CLASS =
  'relative aspect-square w-full shrink-0 overflow-hidden rounded-[20px] border bg-white transition-all duration-300';

export const PDP_GALLERY_THUMB_TILE_ACTIVE_CLASS =
  'border-sky-deep/35 shadow-[0_4px_16px_rgba(147,182,227,0.28)]';

export const PDP_GALLERY_THUMB_TILE_INACTIVE_CLASS =
  'border-sky-mist/80 hover:border-sky-deep/25 hover:shadow-[0_2px_10px_rgba(147,182,227,0.18)]';

/** Fullscreen control on the hero image. */
export const PDP_GALLERY_ZOOM_BUTTON_CLASS =
  'flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-ink-700 shadow-[0_4px_14px_rgba(30,41,57,0.12)] transition-all duration-300 hover:bg-white hover:shadow-[0_6px_18px_rgba(30,41,57,0.16)]';
