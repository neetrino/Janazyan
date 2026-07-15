import type { CSSProperties } from 'react';
import { Suspense } from 'react';
import {
  AboutSection,
  CategoryPosters,
  HomeHero,
  HomeMobileFigma,
  PromoPoster,
  WhyChooseUs,
} from '../components/home';
import { Header } from '../components/Header';
import {
  DesktopFeaturedAsync,
  HomeMobileFeaturedAsync,
} from '../components/home/HomeFeaturedAsync';
import { CategoryNavigationServer } from '../components/CategoryNavigation/CategoryNavigationServer';
import { HEADER_SHELL_STICKY_OVERLAP_PX } from '../components/header/header-shell-shape.constants';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
} from './products/products-page-layout.constants';
import { HOME_HERO_BLEED_CLASS } from '../lib/layout/hero-frame.constants';
import {
  STOREFRONT_ARC_SHELL_CLASS,
  STOREFRONT_CONTENT_SHELL_CLASS,
  STOREFRONT_DESKTOP_ONLY_CLASS,
} from '../lib/layout/storefront-layout.constants';
import { getServerLanguage } from '../lib/language-server';
import { warmDefaultProductsCatalogCache } from '../lib/products/warm-products-catalog-cache';
import { after } from 'next/server';

const HOME_MOBILE_CATEGORY_FILTERS_SKELETON_COUNT = 5;

function HomeMobileCategoryFiltersFallback() {
  return (
    <div className={`${PRODUCTS_PAGE_CATEGORY_ROW_CLASS} ${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS}`}>
      {Array.from({ length: HOME_MOBILE_CATEGORY_FILTERS_SKELETON_COUNT }).map((_, index) => (
        <div
          key={index}
          className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-20 shrink-0 animate-pulse bg-white/50 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
        />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const language = await getServerLanguage();

  after(async () => {
    await warmDefaultProductsCatalogCache(language);
  });

  return (
    <div className="relative isolate overflow-x-clip desktop:bg-white">
      <HomeMobileFigma
        featuredSlot={<HomeMobileFeaturedAsync />}
        categoryFiltersSlot={
          <Suspense fallback={<HomeMobileCategoryFiltersFallback />}>
            <CategoryNavigationServer language={language} variant="pills" />
          </Suspense>
        }
      />

      <div className={STOREFRONT_DESKTOP_ONLY_CLASS}>
        <Header embedded />
        <div
          className="-mt-[var(--header-sticky-overlap)]"
          style={{ '--header-sticky-overlap': `${HEADER_SHELL_STICKY_OVERLAP_PX}px` } as CSSProperties}
        >
          <div className={STOREFRONT_CONTENT_SHELL_CLASS}>
            <div className={HOME_HERO_BLEED_CLASS}>
              <HomeHero />
            </div>
            <div className="relative desktop:-mt-[30px]">
              <CategoryPosters />
            </div>
          </div>

          <div className="relative w-full overflow-x-clip rounded-[70px]">
            <div className="absolute inset-0 -z-10 rounded-[70px] bg-pastel-arc" />
            <div className={STOREFRONT_ARC_SHELL_CLASS}>
              <DesktopFeaturedAsync />
              <PromoPoster />
              <WhyChooseUs />
            </div>
          </div>

          <AboutSection />
        </div>
      </div>
    </div>
  );
}
