import { t } from '../../lib/i18n';
import type { LanguageCode } from '../../lib/language';

export type BlogPageCopy = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  subtitle: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

export type BlogDetailCopy = {
  backToBlog: string;
  notFoundTitle: string;
  notFoundDescription: string;
};

export function loadBlogPageCopy(lang: LanguageCode): BlogPageCopy {
  return {
    breadcrumbHome: t(lang, 'blog.breadcrumbHome'),
    breadcrumbCurrent: t(lang, 'blog.breadcrumbCurrent'),
    subtitle: t(lang, 'blog.subtitle'),
    title: t(lang, 'blog.title'),
    description: t(lang, 'blog.description'),
    emptyTitle: t(lang, 'blog.emptyTitle'),
    emptyDescription: t(lang, 'blog.emptyDescription'),
  };
}

export function loadBlogDetailCopy(lang: LanguageCode): BlogDetailCopy {
  return {
    backToBlog: t(lang, 'blog.backToBlog'),
    notFoundTitle: t(lang, 'blog.notFoundTitle'),
    notFoundDescription: t(lang, 'blog.notFoundDescription'),
  };
}
