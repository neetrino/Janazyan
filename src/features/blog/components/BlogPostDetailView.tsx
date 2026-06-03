'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../../lib/i18n-client';
import { getStoredLanguage } from '../../../lib/language';
import {
  BLOG_DETAIL_CONTAINER_CLASS,
  BLOG_EXCERPT_CALLOUT_CLASS,
  BLOG_GALLERY_IMAGE_BOX_CLASS,
  BLOG_GALLERY_IMAGE_CLASS,
  BLOG_HERO_IMAGE_BOX_CLASS,
  BLOG_HERO_IMAGE_CLASS,
  BLOG_PAGE_BG_CLASS,
} from '../blog-layout-styles';
import { fetchBlogPostBySlug } from '../fetch-blog-posts';
import { formatBlogDate } from '../format-blog-date';
import type { BlogPostDetail } from '../types';
import { BlogCoverImage } from './BlogCoverImage';

type BlogPostDetailViewProps = {
  slug: string;
};

function BlogBackLink() {
  const { t } = useTranslation();

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
      {t('blog.backToBlog')}
    </Link>
  );
}

function BlogDetailSkeleton() {
  return (
    <div className={BLOG_PAGE_BG_CLASS}>
      <div className={`${BLOG_DETAIL_CONTAINER_CLASS} animate-pulse py-10 md:py-14`}>
        <div className="mb-8 h-4 w-28 rounded bg-gray-200" />
        <div className={`${BLOG_HERO_IMAGE_BOX_CLASS} bg-gray-200`} />
        <div className="mt-8 h-10 w-4/5 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
        <div className="mt-8 h-24 rounded-lg bg-[#eef6fb]" />
        <div className="mt-8 space-y-3">
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function BlogPostDetailView({ slug }: BlogPostDetailViewProps) {
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const load = async () => {
      const lang = getStoredLanguage();
      setLocale(lang);
      setLoading(true);
      try {
        const data = await fetchBlogPostBySlug(slug, lang);
        setPost(data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
    const onLanguageUpdated = () => {
      void load();
    };
    window.addEventListener('language-updated', onLanguageUpdated);
    return () => window.removeEventListener('language-updated', onLanguageUpdated);
  }, [slug]);

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className={BLOG_PAGE_BG_CLASS}>
        <div className={`${BLOG_DETAIL_CONTAINER_CLASS} py-20 text-center`}>
          <h1 className="text-2xl font-bold text-gray-900">{t('blog.notFoundTitle')}</h1>
          <p className="mt-2 text-gray-600">{t('blog.notFoundDescription')}</p>
          <div className="mt-6 flex justify-center">
            <BlogBackLink />
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = formatBlogDate(post.publishedAt, locale);
  const extraImages = post.images.slice(1);

  return (
    <div className={BLOG_PAGE_BG_CLASS}>
      <article className="pb-14 md:pb-20">
        <div className={`${BLOG_DETAIL_CONTAINER_CLASS} py-10 md:py-14`}>
          <BlogBackLink />

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

          <header className={post.coverImage ? 'mt-8' : ''}>
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
      </article>
    </div>
  );
}
