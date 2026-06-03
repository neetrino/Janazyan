import Link from 'next/link';
import { BLOG_CARD_CLASS } from '../blog-layout-styles';
import { formatBlogDate } from '../format-blog-date';
import type { BlogPostSummary } from '../types';
import { BlogCardImageFrame } from './BlogCardImageFrame';

type BlogPostCardProps = {
  post: BlogPostSummary;
  locale: string;
};

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const formattedDate = formatBlogDate(post.publishedAt, locale);

  return (
    <article className="h-full">
      <Link href={`/blog/${post.slug}`} className={`group ${BLOG_CARD_CLASS}`}>
        <BlogCardImageFrame src={post.coverImage} alt={post.title} hoverZoom />

        <div className="flex flex-1 flex-col gap-3 p-6">
          {formattedDate ? (
            <time
              dateTime={post.publishedAt ?? undefined}
              className="text-sm text-gray-500"
            >
              {formattedDate}
            </time>
          ) : null}

          <h2 className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#7CB342] md:text-xl">
            {post.title}
          </h2>

          {post.excerpt ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 md:text-base">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
