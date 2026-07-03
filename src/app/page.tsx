import type { CSSProperties } from 'react';
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
import { HEADER_SHELL_STICKY_OVERLAP_PX } from '../components/header/header-shell-shape.constants';
import { HOME_HERO_BLEED_CLASS } from '../lib/layout/hero-frame.constants';
import {
  STOREFRONT_ARC_SHELL_CLASS,
  STOREFRONT_CONTENT_SHELL_CLASS,
  STOREFRONT_DESKTOP_ONLY_CLASS,
} from '../lib/layout/storefront-layout.constants';
import { getServerLanguage } from '../lib/language-server';
import { warmDefaultProductsCatalogCache } from '../lib/products/warm-products-catalog-cache';
import { after } from 'next/server';

export default async function HomePage() {
  after(async () => {
    const language = await getServerLanguage();
    await warmDefaultProductsCatalogCache(language);
  });

  return (
    <div className="relative isolate overflow-x-clip desktop:bg-white">
      <HomeMobileFigma featuredSlot={<HomeMobileFeaturedAsync />} />

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
