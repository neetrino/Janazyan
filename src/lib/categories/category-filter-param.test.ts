import { describe, expect, it } from 'vitest';
import {
  isCategoryFilterParamActive,
  isCategoryIdFilterParam,
  resolveCategoryFilterParam,
  resolveShopCategorySlugFromTitle,
} from './category-filter-param';

describe('resolveCategoryFilterParam', () => {
  it('prefers a non-empty translation slug', () => {
    expect(
      resolveCategoryFilterParam({
        id: 'cmr3mn0n60004gnhdtfo1r9dn',
        slug: 'shampoo',
        title: 'Շամպուն',
      }),
    ).toBe('shampoo');
  });

  it('falls back to shop slug from title when slug is empty', () => {
    expect(
      resolveCategoryFilterParam({
        id: 'cmr1sogc',
        slug: '',
        title: 'Դեմքի Խնամք',
      }),
    ).toBe('face');
  });

  it('falls back to category id for subcategories without slug', () => {
    const id = 'cmr3mn0n60004gnhdtfo1r9dn';
    expect(
      resolveCategoryFilterParam({
        id,
        slug: '',
        title: 'Խոնավացնող կաթիկ',
      }),
    ).toBe(id);
  });

  it('does not map subcategory titles with parent keywords to shop slugs', () => {
    const id = 'cmr3mn0n60004gnhdtfo1r9dn';
    expect(
      resolveCategoryFilterParam(
        {
          id,
          slug: '',
          title: 'Շամպուն նորմալ և չոր մազերի համար',
        },
        { allowShopSlugFromTitle: false },
      ),
    ).toBe(id);
  });
});

describe('isCategoryIdFilterParam', () => {
  it('detects Prisma cuids', () => {
    expect(isCategoryIdFilterParam('cmr3mn0n60004gnhdtfo1r9dn')).toBe(true);
    expect(isCategoryIdFilterParam('hair')).toBe(false);
  });
});

describe('isCategoryFilterParamActive', () => {
  it('matches resolved param and raw id', () => {
    const category = {
      id: 'cmr3mn0n60004gnhdtfo1r9dn',
      slug: '',
      title: 'Խոնավացնող կաթիկ',
    };

    expect(isCategoryFilterParamActive(category, category.id)).toBe(true);
    expect(isCategoryFilterParamActive(category, 'kids')).toBe(false);
  });

  it('matches subcategory id when parent keyword is in title', () => {
    const category = {
      id: 'cmr3mn0n60004gnhdtfo1r9dn',
      slug: '',
      title: 'Շամպուն նորմալ և չոր մազերի համար',
    };

    expect(
      isCategoryFilterParamActive(category, category.id, { allowShopSlugFromTitle: false }),
    ).toBe(true);
    expect(
      isCategoryFilterParamActive(category, 'hair', { allowShopSlugFromTitle: false }),
    ).toBe(false);
  });
});

describe('resolveShopCategorySlugFromTitle', () => {
  it('maps Armenian hair care title to hair slug', () => {
    expect(resolveShopCategorySlugFromTitle('Մազերի Խնամք')).toBe('hair');
  });
});
