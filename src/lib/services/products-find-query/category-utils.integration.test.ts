import { describe, expect, it } from 'vitest';
import { findCategoryIdsBySlug } from '@/lib/services/products-find-query/category-utils';

const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());

describe.skipIf(!hasDatabase)('findCategoryIdsBySlug (integration)', () => {
  it('resolves body shop slug to the Armenian body care category', async () => {
    const ids = await findCategoryIdsBySlug('body', 'hy');
    expect(ids.length).toBeGreaterThan(0);
  });
});
