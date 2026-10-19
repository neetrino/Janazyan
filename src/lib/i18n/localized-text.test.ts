import { describe, expect, it } from 'vitest';
import { applyLocalizedTextChange, emptyLocalizedTexts, pickLocalizedText } from './localized-text';

describe('applyLocalizedTextChange', () => {
  it('writes a latin slug from the title and keeps it across languages', () => {
    const start = { texts: emptyLocalizedTexts(), slug: '' };
    const armenian = applyLocalizedTextChange(start, 'hy', { text: 'Աթոռ' });
    const english = applyLocalizedTextChange(armenian, 'en', { text: 'Chair' });
    expect(armenian.slug).toBe('ator');
    expect(english.slug).toBe('ator');
    expect(english.texts.find((row) => row.locale === 'en')?.text).toBe('Chair');
  });
});

describe('pickLocalizedText', () => {
  it('falls back to a saved language', () => {
    const rows = [
      { locale: 'hy', title: '' },
      { locale: 'en', title: 'Chairs' },
    ];
    expect(pickLocalizedText(rows, 'hy', (row) => row.title)?.title).toBe('Chairs');
  });
});
