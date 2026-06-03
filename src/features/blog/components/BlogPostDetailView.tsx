'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredLanguage, type LanguageCode } from '../../../lib/language';
import {
  BLOG_DETAIL_CONTAINER_CLASS,
  BLOG_EXCERPT_CALLOUT_CLASS,
  BLOG_GALLERY_IMAGE_BOX_CLASS,
  BLOG_GALLERY_IMAGE_CLASS,
  BLOG_GLASS_ARTICLE_CLASS,
  BLOG_HERO_IMAGE_BOX_CLASS,
  BLOG_HERO_IMAGE_CLASS,
} from '../blog-layout-styles';
import { fetchBlogPostBySlug } from '../fetch-blog-posts';
import { formatBlogDate } from '../format-blog-date';
import { loadBlogDetailCopy, type BlogDetailCopy } from '../load-blog-page-copy';
import type { BlogPostDetail } from '../types';
import { BlogCoverImage } from './BlogCoverImage';

type BlogPostDetailViewProps = {
  slug: string;
  initialPost: BlogPostDetail | null;
  initialLocale: LanguageCode;
  copy: BlogDetailCopy;
};

function BlogBackLink({ label }: { label: string }) {
  return (
    <Link
      href="/blog"
      className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
    >
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
}

function BlogDetailSkeleton() {
  return (
    <div className={`${BLOG_DETAIL_CONTAINER_CLASS} animate-pulse py-10 md:py-14`}>
      <div className="mb-8 h-4 w-28 rounded bg-white/60" />
      <div className={`${BLOG_HERO_IMAGE_BOX_CLASS} bg-white/50`} />
      <div className={`${BLOG_GLASS_ARTICLE_CLASS} mt-8 p-6 sm:p-8`}>
        <div className="h-10 w-4/5 rounded bg-white/60" />
        <div className="mt-3 h-4 w-32 rounded bg-white/60" />
        <div className="mt-8 h-24 rounded-2xl bg-teal-50/40" />
        <div className="mt-8 space-y-3">
          <div className="h-4 rounded bg-white/60" />
          <div className="h-4 rounded bg-white/60" />
          <div className="h-4 w-5/6 rounded bg-white/60" />
        </div>
      </div>
    </div>
  );
}

export function BlogPostDetailView({
  slug,
  initialPost,
  initialLocale,
  copy: initialCopy,
}: BlogPostDetailViewProps) {
  const [post, setPost] = useState<BlogPostDetail | null>(initialPost);
  const [locale, setLocale] = useState(initialLocale);
  const [copy, setCopy] = useState(initialCopy);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const onLanguageUpdated = () => {
      const refresh = async () => {
        const lang = getStoredLanguage();
        setIsRefreshing(true);
        try {
          const data = await fetchBlogPostBySlug(slug, lang);
          setPost(data);
          setLocale(lang);
          setCopy(loadBlogDetailCopy(lang));
        } catch {
          setPost(null);
        } finally {
          setIsRefreshing(false);
        }
      };
      void refresh();
    };

    window.addEventListener('language-updated', onLanguageUpdated);
    return () => window.removeEventListener('language-updated', onLanguageUpdated);
  }, [slug]);

  if (isRefreshing) {
    return <BlogDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className={`${BLOG_DETAIL_CONTAINER_CLASS} py-20 text-center`}>
        <div className={`${BLOG_GLASS_ARTICLE_CLASS} px-6 py-12 sm:px-10`}>
          <h1 className="text-2xl font-bold text-gray-900">{copy.notFoundTitle}</h1>
          <p className="mt-2 text-gray-600">{copy.notFoundDescription}</p>
          <div className="mt-6 flex justify-center">
            <BlogBackLink label={copy.backToBlog} />
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = formatBlogDate(post.publishedAt, locale);
  const extraImages = post.images.slice(1);

  return (
    <article className="pb-14 md:pb-20">
      <div className={`${BLOG_DETAIL_CONTAINER_CLASS} py-10 md:py-14`}>
        <BlogBackLink label={copy.backToBlog} />

        {post.coverImage ? (
          <div className={BLOG_HERO_IMAGE_BOX_CLASS}>
            <BlogCoverImage
              src={post.coverImage}
              alt={post.title}
              loading="eager"
              className={BLOG_HERO_IMAGE_CLASS}
            />
          </div>
        ) : null}

        <div
          className={`${BLOG_GLASS_ARTICLE_CLASS} ${post.coverImage ? 'mt-8' : ''} p-6 sm:p-8 md:p-10`}
        >
          <header>
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[2.5rem]">
              {post.title}
            </h1>

            {formattedDate ? (
              <time
                dateTime={post.publishedAt ?? undefined}
                className="mt-3 block text-sm text-gray-500"
              >
                {formattedDate}
              </time>
            ) : null}
          </header>

          {post.excerpt ? (
            <blockquote className={`mt-8 ${BLOG_EXCERPT_CALLOUT_CLASS}`}>
              {post.excerpt}
            </blockquote>
          ) : null}

          <div
            className="blog-content mt-8 max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {extraImages.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {extraImages.map((imageUrl, index) => (
                <div key={`${imageUrl}-${index}`} className={BLOG_GALLERY_IMAGE_BOX_CLASS}>
                  <BlogCoverImage
                    src={imageUrl}
                    alt=""
                    className={BLOG_GALLERY_IMAGE_CLASS}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
