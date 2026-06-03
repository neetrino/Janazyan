const LEGACY_BLOG_IMAGE_PREFIX = '/blog/';
const BLOG_IMAGE_PUBLIC_PREFIX = '/blog-media/';

/**
 * Rewrites legacy `/blog/*.png` paths that conflict with the `/blog/[slug]` route.
 */
export function normalizeBlogImageUrl(url: string): string {
  const trimmed = url.trim();
  if (
    trimmed.startsWith(LEGACY_BLOG_IMAGE_PREFIX) &&
    !trimmed.startsWith(BLOG_IMAGE_PUBLIC_PREFIX) &&
    /\.(png|jpe?g|gif|webp|svg)$/i.test(trimmed)
  ) {
    return `${BLOG_IMAGE_PUBLIC_PREFIX}${trimmed.slice(LEGACY_BLOG_IMAGE_PREFIX.length)}`;
  }
  return trimmed;
}

export function normalizeBlogImageUrls(urls: string[] | undefined): string[] {
  if (!urls?.length) {
    return [];
  }
  return urls.map(normalizeBlogImageUrl);
}
