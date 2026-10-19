import { describe, expect, it } from 'vitest';
import {
  filledProductContentTranslations,
  pickProductDescriptionHtml,
  pickProductTranslation,
} from './product-translations';

describe('pickProductTranslation', () => {
  const rows = [
    { locale: 'hy', title: 'Աթոռ', descriptionHtml: '<p>Հայ</p>' },
    { locale: 'en', title: 'Chair', descriptionHtml: '<p>En</p>' },
    { locale: 'ru', title: '', descriptionHtml: '' },
  ];

  it('uses the requested language when that title exists', () => {
    expect(pickProductTranslation(rows, 'en')?.title).toBe('Chair');
  });

  it('falls back to a saved language when the requested one is empty', () => {
    expect(pickProductTranslation(rows, 'ru')?.title).toBe('Աթոռ');
  });

  it('falls back to the only saved language', () => {
    const englishOnly = [
      { locale: 'hy', title: '' },
      { locale: 'en', title: 'Chair' },
    ];
    expect(pickProductTranslation(englishOnly, 'hy')?.title).toBe('Chair');
  });
});

describe('pickProductDescriptionHtml', () => {
  it('keeps the description of the visible language', () => {
    const rows = [
      { locale: 'hy', title: 'Աթոռ', descriptionHtml: '<p>Հայ</p>' },
      { locale: 'en', title: 'Chair', descriptionHtml: '<p><strong>Rich</strong></p>' },
    ];
    expect(pickProductDescriptionHtml(rows, 'hy')).toBe('<p>Հայ</p>');
  });

  it('uses another language when the visible one has no description', () => {
    const rows = [
      { locale: 'hy', title: 'Աթոռ', descriptionHtml: '' },
      { locale: 'en', title: 'Chair', descriptionHtml: '<p>En</p>' },
    ];
    expect(pickProductDescriptionHtml(rows, 'hy')).toBe('<p>En</p>');
  });
});

describe('filled translations', () => {
  it('uses one latin slug for every language', () => {
    const filled = filledProductContentTranslations(
      [
        { locale: 'hy', title: 'Աթոռ', slug: 'ator', descriptionHtml: '' },
        { locale: 'en', title: '  ', slug: 'ignored', descriptionHtml: '' },
        { locale: 'ru', title: 'Стул', slug: 'stul', descriptionHtml: '<p>Ru</p>' },
      ],
      'chair',
    );
    expect(filled.map((row) => row.locale)).toEqual(['hy', 'ru']);
    expect(filled.every((row) => row.slug === 'chair')).toBe(true);
  });
});
