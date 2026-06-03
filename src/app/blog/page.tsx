import { BlogPageView } from '../../features/blog/components/BlogPageView';
import { loadBlogPageCopy } from '../../features/blog/load-blog-page-copy';
import { getCachedPublishedBlogPosts } from '../../lib/blog/blog-posts-cache';
import { getServerLanguage } from '../../lib/language-server';

export const revalidate = 300;

export default async function BlogPage() {
  const locale = await getServerLanguage();
  const posts = await getCachedPublishedBlogPosts(locale);
  const copy = loadBlogPageCopy(locale);

  return (
    <BlogPageView initialPosts={posts} initialLocale={locale} copy={copy} />
  );
}
