import {
  AboutSection,
  CategoryPosters,
  HomeHero,
  HomeMobileFigma,
  PromoPoster,
  WhyChooseUs,
} from '../components/home';
import {
  DesktopFeaturedAsync,
  HomeMobileFeaturedAsync,
} from '../components/home/HomeFeaturedAsync';
import {
  STOREFRONT_ARC_SHELL_CLASS,
  STOREFRONT_CONTENT_SHELL_CLASS,
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
    <div className="relative isolate overflow-hidden lg:bg-white">
      <HomeMobileFigma featuredSlot={<HomeMobileFeaturedAsync />} />

      <div className="hidden lg:block">
        <div className={STOREFRONT_CONTENT_SHELL_CLASS}>
          <HomeHero />
          <div className="relative lg:-mt-[30px]">
            <CategoryPosters />
          </div>
        </div>

        <div className="relative w-full overflow-x-hidden rounded-[70px]">
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
  );
}
