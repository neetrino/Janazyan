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
      <p className="absolute left-[15px] top-[307px] z-10 text-[23px] font-black leading-7 tracking-[-0.45px] text-ink-800">
        {priceLabel}
      </p>

      {comparePriceLabel ? (
        <p className="absolute left-[120px] top-[309px] z-10 text-[16px] leading-7 text-ink-800/70 line-through">
          {comparePriceLabel}
        </p>
      ) : null}
    </>
  );
}
