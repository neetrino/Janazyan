import { Suspense } from 'react';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { loadBlogPageCopy } from '../../features/blog/load-blog-page-copy';
import { getCachedPublishedBlogPosts } from '../../lib/blog/blog-posts-cache';
import { getServerLanguage } from '../../lib/language-server';
import { BlogPageMain } from './BlogPageMain';
import { BlogPageSkeleton } from './BlogPageSkeleton';

export const revalidate = 300;

/**
 * Blog — shell + copy paint immediately; post grid streams via Suspense.
 */
export default async function BlogPage() {
  const locale = await getServerLanguage();
  const copy = loadBlogPageCopy(locale);
  const postsPromise = getCachedPublishedBlogPosts(locale);

  return (
    <ProductsHeroShell
      sectionAriaLabel="Blog"
      catalog={
        <Suspense fallback={<BlogPageSkeleton copy={copy} />}>
          <BlogPageMain postsPromise={postsPromise} locale={locale} copy={copy} />
        </Suspense>
      }
    />
  );
}
