import { unstable_cache } from 'next/cache';
import { categoriesService } from '../services/categories.service';
import type { CategoryTreeNode } from './category-tree';

const CATEGORIES_TREE_REVALIDATE_SECONDS = 300;

type CategoriesTreeResponse = {
  data: CategoryTreeNode[];
};

export const getCategoriesTreeCached = unstable_cache(
  async (lang: string): Promise<CategoriesTreeResponse> => {
    const result = await categoriesService.getTree(lang);
    return { data: (result?.data ?? []) as CategoryTreeNode[] };
  },
  ['storefront-categories-tree-v3'],
  { revalidate: CATEGORIES_TREE_REVALIDATE_SECONDS, tags: ['categories'] },
);
