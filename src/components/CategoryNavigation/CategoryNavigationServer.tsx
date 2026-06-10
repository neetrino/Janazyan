import Link from 'next/link';
import type { LanguageCode } from '../../lib/language';
import { t } from '../../lib/i18n';
import {
  PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS,
  PRODUCTS_PAGE_CATEGORY_PILL_CLASS,
  PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS,
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
} from '../../app/products/products-page-layout.constants';
import { getCategoryNavStripCached } from '../../lib/categories/categories-nav-strip-cache';
import { getShopCategoryFallbackStrip } from '../../lib/categories/shop-category-fallback';
import type { CategoryTreeNode } from '../../lib/categories/category-tree';
import { getCategoryIcon } from './utils';
import { CategoryPillIcon } from './CategoryPillIcon';
import { getCategoryNavHref, getCategoryNavLabel } from './category-nav-label';

type CategoryNavigationVariant = 'strip' | 'pills';

interface CategoryNavigationServerProps {
  language: LanguageCode;
  activeCategorySlug?: string;
  variant?: CategoryNavigationVariant;
}

function CategoryPlaceholderIcon({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 flex items-center justify-center overflow-hidden transition-all ${
        isActive ? 'border-gray-400 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
    </div>
  );
}

function NavCategoryIcon({
  category,
  isActive,
  language,
}: {
  category: CategoryTreeNode;
  isActive: boolean;
  language: LanguageCode;
}) {
  const title = category.title.toLowerCase();
  const slug = category.slug.toLowerCase();
  const translate = (path: string) => t(language, path);

  if (slug === 'all' || title.includes('new') || title.includes('sale')) {
    return <>{getCategoryIcon(category.title, category.slug, isActive, translate)}</>;
  }

  return <CategoryPlaceholderIcon isActive={isActive} />;
}

function isCategoryActive(slug: string, activeCategorySlug?: string): boolean {
  if (slug === 'all' || slug === 'assortment') {
    return !activeCategorySlug;
  }
  return activeCategorySlug === slug;
}

/** Figma "categories" pill row (node 269:894) — horizontal filter buttons. */
function CategoryPillRow({
  categories,
  activeCategorySlug,
  language,
}: {
  categories: CategoryTreeNode[];
  activeCategorySlug?: string;
  language: LanguageCode;
}) {
  return (
    <div className={PRODUCTS_PAGE_CATEGORY_ROW_CLASS}>
      {categories.map((category) => {
        const isActive = isCategoryActive(category.slug, activeCategorySlug);

        return (
          <Link
            key={category.id}
            href={getCategoryNavHref(category.slug)}
            aria-current={isActive ? 'page' : undefined}
            className={`${PRODUCTS_PAGE_CATEGORY_PILL_CLASS} ${
              isActive
                ? PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS
                : PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS
            }`}
          >
            <CategoryPillIcon
              title={category.title}
              slug={category.slug}
              isActive={isActive}
            />
            <span>{getCategoryNavLabel(category, language)}</span>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Server-rendered category navigation for /products (streams in Suspense, no client fetch).
 * `pills` renders the Figma filter buttons; `strip` keeps the legacy circular icon row.
 */
export async function CategoryNavigationServer({
  language,
  activeCategorySlug,
  variant = 'strip',
}: CategoryNavigationServerProps) {
  const dbCategories = await getCategoryNavStripCached(language);
  const displayCategories =
    dbCategories.length > 0 ? dbCategories : getShopCategoryFallbackStrip(language);

  if (variant === 'pills') {
    return (
      <CategoryPillRow
        categories={displayCategories}
        activeCategorySlug={activeCategorySlug}
        language={language}
      />
    );
  }

  return (
    <div className="border-b border-black/5 py-3 sm:py-4 md:py-6 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div
          className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-1 sm:pb-2 pl-2 sm:pl-4 md:pl-6"
        >
          {displayCategories.map((category) => {
            const isActive = activeCategorySlug === category.slug;

            return (
              <Link
                key={category.id}
                href={getCategoryNavHref(category.slug)}
                className="flex flex-col items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[100px] group cursor-pointer transition-all duration-200 hover:opacity-80"
              >
                <NavCategoryIcon
                  category={category}
                  isActive={isActive}
                  language={language}
                />
                <span
                  className={`text-[10px] sm:text-xs text-center font-medium leading-tight transition-colors ${
                    isActive ? 'text-gray-900 underline' : 'text-gray-700'
                  }`}
                >
                  {getCategoryNavLabel(category, language)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
