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

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <HomeMobileFigma featuredSlot={<HomeMobileFeaturedAsync />} />

      <div className="hidden lg:block">
        <HomeHero />
      </div>

      <div className="hidden lg:block relative mx-auto w-full max-w-[1416px] lg:-mt-[30px]">
        <CategoryPosters />
      </div>

      <div className="hidden lg:block relative mx-auto w-full max-w-[1475px] overflow-visible">
        <div className="absolute inset-0 -z-10 rounded-[70px] bg-pastel-arc" />
        <DesktopFeaturedAsync />
        <PromoPoster />
        <WhyChooseUs />
      </div>

      <AboutSection />
    </div>
  );
}
