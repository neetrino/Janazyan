import { BlogPostDetailView } from '../../../features/blog/components/BlogPostDetailView';
import { loadBlogDetailCopy } from '../../../features/blog/load-blog-page-copy';
import { getCachedPublishedBlogPostBySlug } from '../../../lib/blog/blog-posts-cache';
import { getServerLanguage } from '../../../lib/language-server';

export const revalidate = 300;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getServerLanguage();
  const [post, copy] = await Promise.all([
    getCachedPublishedBlogPostBySlug(slug, locale),
    Promise.resolve(loadBlogDetailCopy(locale)),
  ]);

  return (
    <BlogPostDetailView
      slug={slug}
      initialPost={post}
      initialLocale={locale}
      copy={copy}
    />
  );
}
