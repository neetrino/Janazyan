'use client';

import { formatPrice } from '../../lib/currency';
import { useCurrency } from '../hooks/useCurrency';

type FeaturedProductCardPriceProps = {
  price: number;
  comparePrice: number | null;
};

export function FeaturedProductCardPrice({
  price,
  comparePrice,
}: FeaturedProductCardPriceProps) {
  const currency = useCurrency();
  const priceLabel = formatPrice(price, currency);
  const comparePriceLabel =
    comparePrice != null ? formatPrice(comparePrice, currency) : null;

  return (
    <>
      <p className="absolute left-[5.3%] top-[86.66%] z-20 text-[23px] font-black leading-7 tracking-[-0.45px] text-ink-800">
        {priceLabel}
      </p>

      {comparePriceLabel ? (
        <p className="absolute left-[42.4%] top-[87.33%] z-20 text-[16px] leading-7 text-ink-800/70 line-through">
          {comparePriceLabel}
        </p>
      ) : null}
    </>
  );
}
