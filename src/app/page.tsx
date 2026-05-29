import {
  AboutSection,
  CategoryPosters,
  FeaturedProducts,
  HomeFooter,
  HomeHero,
  PromoPoster,
  WhyChooseUs,
} from '../components/home';

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <HomeHero />

      <div className="relative mx-auto mt-10 w-full lg:-mt-[30px]">
        <CategoryPosters />
      </div>

      <div className="relative mx-auto w-full">
        <div className="absolute inset-0 -z-10 rounded-[28px] md:rounded-[44px] lg:rounded-[70px] bg-pastel-arc" />
        <FeaturedProducts />
        <PromoPoster />
        <WhyChooseUs />
      </div>

      <AboutSection />
      <HomeFooter />
    </div>
  );
}
