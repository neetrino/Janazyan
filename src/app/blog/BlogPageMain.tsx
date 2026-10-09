import { BlogPageView } from '../../features/blog/components/BlogPageView';
import type { BlogPageCopy } from '../../features/blog/load-blog-page-copy';
import type { BlogPostSummary } from '../../features/blog/types';
import type { LanguageCode } from '../../lib/language';

type BlogPageMainProps = {
  postsPromise: Promise<BlogPostSummary[]>;
  locale: LanguageCode;
  copy: BlogPageCopy;
};

/** Streams the post grid after the hero shell + copy header can paint. */
export async function BlogPageMain({
  postsPromise,
  locale,
  copy,
}: BlogPageMainProps) {
  const posts = await postsPromise;
  return (
    <BlogPageView initialPosts={posts} initialLocale={locale} copy={copy} />
  );
}
