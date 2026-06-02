import {
  AboutSection,
  CategoryPosters,
  FeaturedProducts,
  HomeHero,
  HomeMobileFigma,
  PromoPoster,
  WhyChooseUs,
} from '../components/home';
import { getHomeFeaturedProducts } from '../lib/home/featured-products-data';

export default async function HomePage() {
  const featuredProducts = await getHomeFeaturedProducts();

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <HomeMobileFigma featuredProducts={featuredProducts} />

      <div className="hidden lg:block">
        <HomeHero />
      </div>

      <div className="hidden lg:block relative mx-auto w-full max-w-[1472px] lg:-mt-[30px]">
        <CategoryPosters />
      </div>

      <div className="hidden lg:block relative mx-auto w-full max-w-[1475px] overflow-visible">
        <div className="absolute inset-0 -z-10 rounded-[70px] bg-pastel-arc" />
        <FeaturedProducts products={featuredProducts} />
        <PromoPoster />
        <WhyChooseUs />
      </div>

      <AboutSection />
    </div>
  );
}
