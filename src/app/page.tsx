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

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
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
