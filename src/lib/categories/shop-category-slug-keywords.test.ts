import { describe, expect, it } from 'vitest';
import { titleMatchesShopCategorySlug } from './shop-category-slug-keywords';

describe('titleMatchesShopCategorySlug', () => {
  it('matches Armenian body care genitive title for body slug', () => {
    expect(titleMatchesShopCategorySlug('Մարմնի Խնամք', 'body')).toBe(true);
  });

  it('matches Armenian nominative body title for body slug', () => {
    expect(titleMatchesShopCategorySlug('Մարմին', 'body')).toBe(true);
  });

  it('does not match face care title for body slug', () => {
    expect(titleMatchesShopCategorySlug('Դեմքի Խնամք', 'body')).toBe(false);
  });
});
