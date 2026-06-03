'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../../../lib/i18n-client';
import { getStoredLanguage } from '../../../lib/language';
import { BLOG_CARD_SKELETON_CLASS, BLOG_PAGE_BG_CLASS } from '../blog-layout-styles';
import { fetchBlogPosts } from '../fetch-blog-posts';
import type { BlogPostSummary } from '../types';
import { BlogBreadcrumbs } from './BlogBreadcrumbs';
import { BlogPostCard } from './BlogPostCard';

export function BlogPageView() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const load = async () => {
      const lang = getStoredLanguage();
      setLocale(lang);
      setLoading(true);
      try {
        const data = await fetchBlogPosts(lang);
        setPosts(data);
      } catch {
        setPosts([]);
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
  }, []);

  return (
    <div className={BLOG_PAGE_BG_CLASS}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <BlogBreadcrumbs />

        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
            {t('blog.subtitle')}
          </p>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            {t('blog.title')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
            {t('blog.description')}
          </p>
        </header>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={BLOG_CARD_SKELETON_CLASS} aria-hidden />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl bg-white px-6 py-16 text-center shadow-[0_2px_16px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-medium text-gray-900">{t('blog.emptyTitle')}</p>
            <p className="mt-2 text-sm text-gray-600">{t('blog.emptyDescription')}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
