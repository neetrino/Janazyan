'use client';

import Image from 'next/image';
import { useTranslation } from '@/lib/i18n-client';
import { CheckoutGlassCard } from './CheckoutGlassCard';
import type { Cart } from '../types';

const PRODUCT_PREVIEW_IMAGE_SIZE_PX = 64;

function formatItemCount(count: number, t: (key: string) => string): string {
  const key = count === 1 ? 'checkout.productsInOrder.itemCountOne' : 'checkout.productsInOrder.itemCountMany';
  return t(key).replace('{count}', count.toString());
}

type CheckoutProductsInOrderProps = {
  cart: Cart;
};

export function CheckoutProductsInOrder({ cart }: CheckoutProductsInOrderProps) {
  const { t } = useTranslation();
  const itemCount = cart.itemsCount;

  return (
    <CheckoutGlassCard className="py-4 sm:py-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-900">
          {t('checkout.productsInOrder.title')}
        </h2>
        <span className="shrink-0 text-sm font-semibold text-gray-700">
          {formatItemCount(itemCount, t)}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        {cart.items.map((item) => {
          const product = item.variant.product;

          return (
            <article key={item.id} className="w-20 shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-1.5 shadow-sm">
                <div className="relative h-full w-full">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes={`${PRODUCT_PREVIEW_IMAGE_SIZE_PX}px`}
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-semibold uppercase leading-tight text-gray-700">
                {product.title}
              </p>
            </article>
          );
        })}
      </div>
    </CheckoutGlassCard>
  );
}
