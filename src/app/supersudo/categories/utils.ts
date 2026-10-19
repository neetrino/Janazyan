import { CONTENT_LOCALES } from '@/lib/i18n/localized-text';
import { presentCategoryTitle } from '@/lib/categories/present-category-title';
import type { Category, CategoryWithLevel } from './types';

export function categoryLocaleTitle(
  category: Pick<Category, 'title' | 'translations'>,
  locale: string,
): string {
  const saved = category.translations?.find((row) => row.locale === locale)?.title.trim() ?? '';
  if (saved) {
    return presentCategoryTitle(saved, locale);
  }
  const fallback = category.title.trim();
  return fallback ? presentCategoryTitle(fallback, locale) : '';
}

export function categoryTitlesLabel(category: Pick<Category, 'title' | 'translations'>): string {
  const parts = CONTENT_LOCALES.map((locale) => categoryLocaleTitle(category, locale)).filter(Boolean);
  return parts.join(' · ') || category.title;
}

export function categoryMatchesSearch(category: Category, normalizedSearch: string): boolean {
  const haystack = [
    category.title,
    category.slug,
    ...(category.translations?.map((row) => row.title) ?? []),
  ].join(' ').toLowerCase();
  return haystack.includes(normalizedSearch);
}

/**
 * Build category tree with hierarchy levels
 */
export function buildCategoryTree(categories: Category[]): CategoryWithLevel[] {
  type CategoryWithLevelInternal = Category & { level: number; children?: CategoryWithLevelInternal[] };
  
  const categoryMap = new Map<string, CategoryWithLevelInternal>();
  const rootCategories: CategoryWithLevelInternal[] = [];

  // First pass: create map
  categories.forEach(cat => {
    const { children, ...catWithoutChildren } = cat;
    categoryMap.set(cat.id, { ...catWithoutChildren, level: 0 });
  });

  // Second pass: build tree
  categories.forEach(cat => {
    const categoryNode = categoryMap.get(cat.id)!;
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId)!;
      if (!parent.children) {
        parent.children = [];
      }
      categoryNode.level = (parent.level || 0) + 1;
      parent.children.push(categoryNode);
    } else {
      rootCategories.push(categoryNode);
    }
  });

  // Flatten tree for display
  const flattenTree = (
    nodes: CategoryWithLevelInternal[], 
    result: CategoryWithLevel[] = []
  ): CategoryWithLevel[] => {
    nodes.forEach(node => {
      result.push({ ...node, level: node.level });
      if (node.children) {
        flattenTree(node.children, result);
      }
    });
    return result;
  };

  return flattenTree(rootCategories);
}




