import { describe, expect, it } from 'vitest';
import { presentCategoryTitle } from './present-category-title';

const ARMENIAN = /[\u0531-\u0587]/;
const CYRILLIC = /[\u0400-\u04FF]/;

describe('presentCategoryTitle', () => {
  it('keeps Armenian and writes English and Russian in their scripts', () => {
    const source = 'Մազերի Խնամք';
    expect(presentCategoryTitle(source, 'hy')).toBe(source);
    expect(presentCategoryTitle(source, 'en')).not.toMatch(ARMENIAN);
    expect(presentCategoryTitle(source, 'ru')).toMatch(CYRILLIC);
    expect(presentCategoryTitle(source, 'ru')).not.toMatch(ARMENIAN);
    expect(presentCategoryTitle('Hair Care', 'en')).toBe('Hair Care');
  });
});