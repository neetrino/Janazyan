import Link from 'next/link';
import { Suspense } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
} from '../../app/products/products-page-layout.constants';
import type { LanguageCode } from '../../lib/language';
import { t } from '../../lib/i18n';
import { CategoryNavigationServer } from '../CategoryNavigation/CategoryNavigationServer';
import { ProductsToolbarControls } from './ProductsToolbarControls';

type ProductsShopHeroToolbarProps = {
  language: LanguageCode;
  activeCategorySlug?: string;
};

function ProductsShopBreadcrumb({ language }: { language: LanguageCode }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-base capitalize leading-[18px] lg:mb-6 lg:text-white"
    >
      <Link
        href="/"
        className="font-normal text-ink-600 transition-colors hover:text-ink-900 lg:text-white/65 lg:hover:text-white"
      >
        {t(language, 'common.navigation.home')}
      </Link>
      <span className="font-bold text-ink-900 lg:text-white">
        {' / '}
        {t(language, 'common.footer.shop')}
      </span>
    </nav>
  );
}

/**
 * Figma shop hero toolbar — breadcrumb, category pills, view + sort controls.
 */
export function ProductsShopHeroToolbar({
  language,
  activeCategorySlug,
}: ProductsShopHeroToolbarProps) {
  return (
    <div className="pb-1">
      <ProductsShopBreadcrumb language={language} />
      <div className="hidden flex-col gap-3 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-[11px]">
        <Suspense
          fallback={
            <div className={`${PRODUCTS_PAGE_CATEGORY_ROW_CLASS} min-h-16`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 w-[128px] shrink-0 animate-pulse rounded-full bg-white/50"
                />
              ))}
            </div>
          }
        >
          <CategoryNavigationServer
            language={language}
            activeCategorySlug={activeCategorySlug}
            variant="pills"
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex shrink-0 items-center gap-3">
              <div
                className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[182px] animate-pulse bg-white/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
              />
              <div
                className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[231px] animate-pulse bg-sky-deep/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
              />
            </div>
          }
        >
          <ProductsToolbarControls />
        </Suspense>
      </div>
    </div>
  );
}
