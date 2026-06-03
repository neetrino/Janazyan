/** Layout and glass classes for the public blog pages — catalog gradient from layout shell. */
export const BLOG_GLASS_CARD_CLASS =
  'rounded-[28px] border border-white/45 bg-white/55 shadow-[0_8px_32px_rgba(135,123,135,0.15)] backdrop-blur-xl';

export const BLOG_CARD_CLASS =
  'flex h-full flex-col overflow-hidden rounded-[28px] border border-white/45 bg-white/55 shadow-[0_8px_32px_rgba(135,123,135,0.15)] backdrop-blur-xl transition-shadow hover:shadow-[0_12px_40px_rgba(135,123,135,0.18)]';

/** Fixed height image area on blog index cards — images crop with object-cover. */
export const BLOG_CARD_IMAGE_BOX_CLASS =
  'relative h-[220px] w-full shrink-0 overflow-hidden bg-white/40 md:h-[240px]';

export const BLOG_CARD_IMAGE_CLASS =
  'block h-full w-full object-cover object-center transition-transform duration-300';

export const BLOG_CARD_SKELETON_CLASS =
  'h-[420px] animate-pulse rounded-[28px] border border-white/45 bg-white/55 shadow-[0_8px_32px_rgba(135,123,135,0.12)] backdrop-blur-xl';

export const BLOG_GLASS_EMPTY_CLASS =
  'mx-auto max-w-xl rounded-[28px] border border-white/45 bg-white/55 px-6 py-16 text-center shadow-[0_8px_32px_rgba(135,123,135,0.15)] backdrop-blur-xl';

export const BLOG_DETAIL_CONTAINER_CLASS = 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8';

export const BLOG_GLASS_ARTICLE_CLASS =
  'rounded-[28px] border border-white/45 bg-white/55 shadow-[0_8px_32px_rgba(135,123,135,0.15)] backdrop-blur-xl';

export const BLOG_HERO_IMAGE_BOX_CLASS =
  'relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-white/45 bg-white/40 shadow-[0_8px_32px_rgba(135,123,135,0.12)]';

export const BLOG_HERO_IMAGE_CLASS =
  'block h-full w-full object-cover object-center';

export const BLOG_GALLERY_IMAGE_BOX_CLASS =
  'relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/40 bg-white/40';

export const BLOG_GALLERY_IMAGE_CLASS =
  'block h-full w-full object-cover object-center';

export const BLOG_EXCERPT_CALLOUT_CLASS =
  'rounded-2xl border border-teal-200/50 bg-teal-50/40 px-5 py-4 text-base italic leading-relaxed text-gray-700 backdrop-blur-md';
