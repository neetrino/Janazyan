import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';
import { FEATURED_PRODUCTS, type FeaturedProduct } from './constants';

export function FeaturedProducts() {
  return (
    <section
      aria-label="Featured products"
      className="relative w-full px-4 py-14 sm:px-6 md:px-8 lg:px-[58px] md:py-20 lg:py-[62px]"
    >
      <div className="mx-auto w-full">
        <h2 className="text-center font-display text-ink-800 text-[clamp(34px,5vw,66px)] leading-[0.95] tracking-[0.005em]">
          Առաջարկվող Արտադրանք
        </h2>

        <div className="mt-10 grid justify-center gap-6 sm:gap-8 md:mt-14 md:grid-cols-2 lg:flex lg:items-center lg:justify-between lg:gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-14">
          <Link
            href="/products"
            className="group inline-flex h-[52px] md:h-[56px] items-center gap-1 rounded-[72px] bg-white px-6 text-[18px] font-bold text-[#93B6E3] shadow-card transition-transform duration-200 hover:-translate-y-0.5"
          >
            Continue
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <article className="group relative mx-auto h-[510px] w-full max-w-[420px] overflow-visible lg:mx-0 lg:w-[420px] lg:shrink-0">
      <div className="relative h-full w-full">
        <div className="absolute left-0 top-[50px] h-[460px] w-full overflow-hidden rounded-[28px] bg-cream transition-transform duration-300 group-hover:-translate-y-1">
          <div className="absolute bottom-0 right-0 h-[118px] w-[112px] rounded-tl-[40px] rounded-br-[28px] bg-white" />
        </div>

        <button
          type="button"
          aria-label="Add to cart"
          className="absolute right-[16px] top-[362px] grid h-[55px] w-[55px] place-items-center rounded-full text-ink-800 transition-transform duration-200 hover:scale-105"
        >
          <ShoppingCart className="h-[42px] w-[42px]" strokeWidth={4} />
        </button>

        <div className="absolute left-1/2 top-[-2px] h-[368px] w-[270px] max-w-full -translate-x-1/2 lg:left-[75px] lg:translate-x-0">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="270px"
            className="object-cover transition-transform duration-300 group-hover:-translate-y-1"
          />
        </div>

        <div className="absolute left-5 top-[368px] w-[262px]">
          <p className="font-armenian text-[18px] font-semibold leading-[28px] text-ink-800">
            {product.title}
          </p>
        </div>

        <div className="absolute left-5 top-[431px] flex items-center gap-2">
          <Star className="h-[27px] w-[27px] fill-[#FFB339] text-[#FFB339]" strokeWidth={0} />
          <span className="text-[16px] leading-5 tracking-[-0.0094em] text-ink-800">
            {product.rating}
          </span>
        </div>

        <div className="absolute left-[22px] top-[464px] font-armenian text-[29px] font-black leading-[28px] tracking-[-0.0155em] text-ink-800">
          {product.price}
        </div>
      </div>
    </article>
  );
}
