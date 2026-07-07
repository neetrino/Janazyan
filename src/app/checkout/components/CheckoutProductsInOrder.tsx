'use client';

import Image from 'next/image';
import { useTranslation } from '@/lib/i18n-client';
import { formatTitleCaseWords } from '@/lib/format/format-title-case';
import { CheckoutGlassCard } from './CheckoutGlassCard';
import type { Cart } from '../types';

const PRODUCT_PREVIEW_IMAGE_SIZE_MOBILE_PX = 64;
const PRODUCT_PREVIEW_IMAGE_SIZE_DESKTOP_PX = 88;

const CHECKOUT_PRODUCTS_IN_ORDER_TITLE_CLASS =
  'text-xs font-bold uppercase tracking-wide text-gray-900 desktop:text-sm';

const CHECKOUT_PRODUCTS_IN_ORDER_COUNT_CLASS =
  'shrink-0 text-xs font-semibold text-gray-700 desktop:text-sm';

const CHECKOUT_PRODUCTS_IN_ORDER_ITEM_CLASS = 'relative w-20 shrink-0 desktop:w-[5.5rem]';

const CHECKOUT_PRODUCTS_IN_ORDER_REMOVE_BUTTON_CLASS =
  'absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full border border-white/80 bg-white text-gray-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 desktop:h-7 desktop:w-7';

const CHECKOUT_PRODUCTS_IN_ORDER_IMAGE_WRAPPER_CLASS =
  'relative h-16 w-16 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-1.5 shadow-sm desktop:h-[5.5rem] desktop:w-[5.5rem]';

const CHECKOUT_PRODUCTS_IN_ORDER_PRODUCT_TITLE_CLASS =
  'mt-2 line-clamp-2 text-[10px] font-medium leading-tight text-gray-700 sm:text-[11px] desktop:text-xs';

const CHECKOUT_PRODUCTS_IN_ORDER_LIST_CLASS =
  'flex gap-6 overflow-x-auto pb-1 desktop:gap-8';

function formatItemCount(count: number, t: (key: string) => string): string {
  const key = count === 1 ? 'checkout.productsInOrder.itemCountOne' : 'checkout.productsInOrder.itemCountMany';
  return t(key).replace('{count}', count.toString());
}

type CheckoutProductsInOrderProps = {
  cart: Cart;
  onRemoveItem: (itemId: string) => void;
  removingItemIds: Set<string>;
};

export function CheckoutProductsInOrder({
  cart,
  onRemoveItem,
  removingItemIds,
}: CheckoutProductsInOrderProps) {
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
          const isRemoving = removingItemIds.has(item.id);
          const displayTitle = formatTitleCaseWords(product.title);

          return (
            <article key={item.id} className={CHECKOUT_PRODUCTS_IN_ORDER_ITEM_CLASS}>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                disabled={isRemoving}
                className={CHECKOUT_PRODUCTS_IN_ORDER_REMOVE_BUTTON_CLASS}
                aria-label={t('common.buttons.remove')}
              >
                <svg className="h-3.5 w-3.5 desktop:h-4 desktop:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className={CHECKOUT_PRODUCTS_IN_ORDER_IMAGE_WRAPPER_CLASS}>
                <div className="relative h-full w-full">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={displayTitle}
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
                {displayTitle}
              </p>
            </article>
          );
        })}
      </div>
    </CheckoutGlassCard>
  );
}
