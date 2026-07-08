'use client';

import { useEffect, useState } from 'react';
import { MIRAGE_PAGE_HEADING_CLASS } from '../../../components/home/mirage-heading-styles';
import { STOREFRONT_PAGE_HEADER_SECTION_CLASS } from '../../../lib/layout/storefront-mobile-layout.constants';
import { getStoredLanguage, type LanguageCode } from '../../../lib/language';
import { BLOG_CARD_SKELETON_CLASS, BLOG_GLASS_EMPTY_CLASS } from '../blog-layout-styles';
import { fetchBlogPosts } from '../fetch-blog-posts';
import type { BlogPageCopy } from '../load-blog-page-copy';
import { loadBlogPageCopy } from '../load-blog-page-copy';
import type { BlogPostSummary } from '../types';
import { BlogPostCard } from './BlogPostCard';

const BLOG_LIST_IMAGE_EAGER_COUNT = 3;

type BlogPageViewProps = {
  initialPosts: BlogPostSummary[];
  initialLocale: LanguageCode;
  copy: BlogPageCopy;
};

export function BlogPageView({
  initialPosts,
  initialLocale,
  copy: initialCopy,
}: BlogPageViewProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [locale, setLocale] = useState(initialLocale);
  const [copy, setCopy] = useState(initialCopy);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const onLanguageUpdated = () => {
      const refresh = async () => {
        const lang = getStoredLanguage();
        setIsRefreshing(true);
        try {
          const data = await fetchBlogPosts(lang);
          setPosts(data);
          setLocale(lang);
          setCopy(loadBlogPageCopy(lang));
        } catch {
          setPosts([]);
        } finally {
          setIsRefreshing(false);
        }
      };
      void refresh();
    };

    window.addEventListener('language-updated', onLanguageUpdated);
    return () => window.removeEventListener('language-updated', onLanguageUpdated);
  }, []);

  const showEmpty = !isRefreshing && posts.length === 0;

  return (
    <div className={`mx-auto max-w-7xl ${STOREFRONT_PAGE_HEADER_SECTION_CLASS}`}>
      <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <h1 className={MIRAGE_PAGE_HEADING_CLASS}>
          {copy.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
          {copy.description}
        </p>
      </header>

      {isRefreshing ? (
        <div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={BLOG_CARD_SKELETON_CLASS} aria-hidden />
          ))}
        </div>
      ) : showEmpty ? (
        <div className={BLOG_GLASS_EMPTY_CLASS}>
          <p className="text-lg font-medium text-gray-900">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm text-gray-600">{copy.emptyDescription}</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogPostCard
              key={post.id}
              post={post}
              locale={locale}
              priorityImage={index < BLOG_LIST_IMAGE_EAGER_COUNT}
            />
          ))}
        </div>
      )}
    </div>
  );
}
