import { describe, expect, it } from 'vitest';
import { buildCategoryFilterHrefFromParams } from './category-products-href';

describe('buildCategoryFilterHrefFromParams', () => {
  it('clears category while preserving sort for All', () => {
    const params = new URLSearchParams('category=hair&sort=price-asc&page=2');
    expect(
      buildCategoryFilterHrefFromParams(
        { id: 'shop-toolbar-all', slug: 'all', title: 'All' },
        params,
      ),
    ).toBe('/products?sort=price-asc');
  });

  it('sets category param while preserving sort', () => {
    const params = new URLSearchParams('sort=name-asc');
    expect(
      buildCategoryFilterHrefFromParams(
        { id: 'cmr1', slug: 'hair', title: 'Hair' },
        params,
      ),
    ).toBe('/products?sort=name-asc&category=hair');
  });
});
