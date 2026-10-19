import type { LanguageCode } from '@/lib/language';
import {
  pickProductTranslation,
  type ProductContentTranslation,
} from '@/lib/products/product-translations';
import { toSlug } from '@/lib/utils/slug';
import { generateSlug } from './productUtils';

interface TranslationFormSlice {
  title: string;
  slug: string;
  descriptionHtml: string;
  skuSourceLocale: LanguageCode;
  translations: ProductContentTranslation[];
}

/**
 * Title and description belong to one language.
 * Slug is one Latin value shared by every language.
 */
export function updateProductFormTranslation<T extends TranslationFormSlice>(
  prev: T,
  locale: LanguageCode,
  patch: Partial<Pick<ProductContentTranslation, 'title' | 'slug' | 'descriptionHtml'>>,
): T {
  const edited = prev.translations.find((row) => row.locale === locale);
  const previousTitle = edited?.title ?? '';
  const slugFollowsTitle = !prev.slug.trim() || prev.slug === generateSlug(previousTitle);
  const sharedSlug =
    patch.slug !== undefined
      ? toSlug(patch.slug)
      : patch.title !== undefined && slugFollowsTitle
        ? generateSlug(patch.title)
        : prev.slug;

  const translations = prev.translations.map((row) => {
    const next = { ...row, slug: sharedSlug };
    if (row.locale !== locale) {
      return next;
    }
    return {
      ...next,
      title: patch.title ?? row.title,
      descriptionHtml: patch.descriptionHtml ?? row.descriptionHtml,
    };
  });

  const currentSource = translations.find((row) => row.locale === prev.skuSourceLocale);
  const skuSourceLocale = currentSource?.title.trim()
    ? prev.skuSourceLocale
    : (pickProductTranslation(translations, locale)?.locale ?? prev.skuSourceLocale);

  return {
    ...prev,
    translations,
    skuSourceLocale,
    slug: sharedSlug,
    title: prev.title.trim() ? prev.title : (patch.title ?? prev.title),
  };
}
