'use client';

import Image from 'next/image';
import { useTranslation } from '@/lib/i18n-client';
import { CheckoutGlassCard } from './CheckoutGlassCard';
import type { Cart } from '../types';

const PRODUCT_PREVIEW_IMAGE_SIZE_MOBILE_PX = 64;
const PRODUCT_PREVIEW_IMAGE_SIZE_DESKTOP_PX = 88;

const CHECKOUT_PRODUCTS_IN_ORDER_TITLE_CLASS =
  'text-xs font-bold uppercase tracking-wide text-gray-900 desktop:text-sm';

const CHECKOUT_PRODUCTS_IN_ORDER_COUNT_CLASS =
  'shrink-0 text-xs font-semibold text-gray-700 desktop:text-sm';

const CHECKOUT_PRODUCTS_IN_ORDER_ITEM_CLASS = 'w-20 shrink-0 desktop:w-[5.5rem]';

const CHECKOUT_PRODUCTS_IN_ORDER_IMAGE_WRAPPER_CLASS =
  'relative h-16 w-16 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-1.5 shadow-sm desktop:h-[5.5rem] desktop:w-[5.5rem]';

const CHECKOUT_PRODUCTS_IN_ORDER_PRODUCT_TITLE_CLASS =
  'mt-2 line-clamp-2 text-[10px] font-medium uppercase leading-tight text-gray-700 sm:text-[11px] desktop:text-xs';

const CHECKOUT_PRODUCTS_IN_ORDER_LIST_CLASS =
  'flex gap-6 overflow-x-auto pb-1 desktop:gap-8';

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
        <h2 className={CHECKOUT_PRODUCTS_IN_ORDER_TITLE_CLASS}>
          {t('checkout.productsInOrder.title')}
        </h2>
        <span className={CHECKOUT_PRODUCTS_IN_ORDER_COUNT_CLASS}>
          {formatItemCount(itemCount, t)}
        </span>
      </div>

      <div className={CHECKOUT_PRODUCTS_IN_ORDER_LIST_CLASS}>
        {cart.items.map((item) => {
          const product = item.variant.product;

          return (
            <article key={item.id} className={CHECKOUT_PRODUCTS_IN_ORDER_ITEM_CLASS}>
              <div className={CHECKOUT_PRODUCTS_IN_ORDER_IMAGE_WRAPPER_CLASS}>
                <div className="relative h-full w-full">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes={`(max-width: 1299px) ${PRODUCT_PREVIEW_IMAGE_SIZE_MOBILE_PX}px, ${PRODUCT_PREVIEW_IMAGE_SIZE_DESKTOP_PX}px`}
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
              <p className={CHECKOUT_PRODUCTS_IN_ORDER_PRODUCT_TITLE_CLASS}>
                {product.title}
              </p>
            </article>
          );
        })}
      </div>
    </CheckoutGlassCard>
  );
}
