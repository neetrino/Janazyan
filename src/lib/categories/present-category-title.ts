import { writeInContentLocale } from '@/lib/i18n/locale-script';

type TitledNode = {
  title: string;
  children?: TitledNode[];
};

type CategoryTitleRecord = {
  title?: string;
  categories?: Array<{ title?: string }>;
};

/** Category title in the script of the requested locale. */
export function presentCategoryTitle(title: string, locale: string): string {
  return writeInContentLocale(title, locale);
}

export function localizeCategoryNodes<T extends TitledNode>(nodes: T[], locale: string): T[] {
  return nodes.map((node) => ({
    ...node,
    title: presentCategoryTitle(node.title, locale),
    children: node.children ? localizeCategoryNodes(node.children, locale) : node.children,
  }));
}

export function localizeTitledList<T extends { title: string }>(rows: T[], locale: string): T[] {
  return rows.map((row) => ({ ...row, title: presentCategoryTitle(row.title, locale) }));
}

type CategoryDetail = {
  title: string;
  seo?: { title?: string | null };
  parent?: { title: string } | null;
};

export function localizeCategoryDetail<T extends CategoryDetail>(detail: T, locale: string): T {
  return {
    ...detail,
    title: presentCategoryTitle(detail.title, locale),
    seo: detail.seo
      ? {
          ...detail.seo,
          title: detail.seo.title ? presentCategoryTitle(detail.seo.title, locale) : detail.seo.title,
        }
      : detail.seo,
    parent: detail.parent
      ? { ...detail.parent, title: presentCategoryTitle(detail.parent.title, locale) }
      : detail.parent,
  };
}

export function localizeRecordCategoryTitles<T extends CategoryTitleRecord>(
  record: T,
  locale: string,
): T {
  if (!record.categories) {
    return record;
  }
  return {
    ...record,
    categories: record.categories.map((category) => ({
      ...category,
      title: category.title ? presentCategoryTitle(category.title, locale) : category.title,
    })),
  };
}
