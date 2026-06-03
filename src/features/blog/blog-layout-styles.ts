/** Layout classes for the public blog index page. */
export const BLOG_PAGE_BG_CLASS =
  'min-h-screen bg-gradient-to-b from-[#eef4f8] via-[#f4f7fa] to-[#f8fafb]';

export const BLOG_CARD_CLASS =
  'flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]';

/** Fixed height image area on blog index cards — images crop with object-cover. */
export const BLOG_CARD_IMAGE_BOX_CLASS =
  'relative h-[220px] w-full shrink-0 overflow-hidden bg-gray-100 md:h-[240px]';

export const BLOG_CARD_IMAGE_CLASS =
  'block h-full w-full object-cover object-center transition-transform duration-300';

export const BLOG_CARD_SKELETON_CLASS =
  'h-[420px] animate-pulse rounded-2xl bg-white/80 shadow-[0_2px_16px_rgba(15,23,42,0.06)]';

export const BLOG_DETAIL_CONTAINER_CLASS = 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8';

export const BLOG_HERO_IMAGE_BOX_CLASS =
  'relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100';

export const BLOG_HERO_IMAGE_CLASS =
  'block h-full w-full object-cover object-center';

export const BLOG_GALLERY_IMAGE_BOX_CLASS =
  'relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100';

export const BLOG_GALLERY_IMAGE_CLASS =
  'block h-full w-full object-cover object-center';

export const BLOG_EXCERPT_CALLOUT_CLASS =
  'border-l-4 border-teal-600 bg-[#eef6fb] px-5 py-4 text-base italic leading-relaxed text-gray-700';
