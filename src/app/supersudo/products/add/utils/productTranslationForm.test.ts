import { describe, expect, it } from 'vitest';
import { emptyProductContentTranslations } from '@/lib/products/product-translations';
import { updateProductFormTranslation } from './productTranslationForm';

function blankForm() {
  return {
    title: '',
    slug: '',
    descriptionHtml: '',
    skuSourceLocale: 'hy' as const,
    translations: emptyProductContentTranslations(),
  };
}

describe('updateProductFormTranslation slug', () => {
  it('writes a latin slug as the title is typed', () => {
    const first = updateProductFormTranslation(blankForm(), 'hy', { title: 'Ա' });
    const next = updateProductFormTranslation(first, 'hy', { title: 'Աթոռ' });
    expect(next.slug).toBe('ator');
    expect(next.translations.every((row) => row.slug === 'ator')).toBe(true);
  });

  it('keeps the slug when another language title is typed', () => {
    const withSlug = updateProductFormTranslation(blankForm(), 'hy', { title: 'Աթոռ' });
    const english = updateProductFormTranslation(withSlug, 'en', { title: 'Chair' });
    expect(english.slug).toBe('ator');
    expect(english.translations.find((row) => row.locale === 'en')?.title).toBe('Chair');
  });

  it('transliterates a manually typed slug to latin', () => {
    const next = updateProductFormTranslation(blankForm(), 'hy', { slug: 'Սեղան' });
    expect(next.slug).toBe('seghan');
  });
});
