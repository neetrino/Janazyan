'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../../lib/currency';
import type { CurrencyCode } from '../../lib/currency';
import type { CartItem } from '../../app/cart/types';

const DRAWER_ITEM_IMAGE_SIZE_PX = 72;

interface CartDrawerItemRowProps {
  item: CartItem;
  currency: CurrencyCode;
  isUpdating: boolean;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  t: (key: string) => string;
}

/**
 * Compact cart line for the right-side drawer.
 */
export function CartDrawerItemRow({
  item,
  currency,
  isUpdating,
  onRemove,
  onUpdateQuantity,
  t,
}: CartDrawerItemRowProps) {
  const productHref = `/products/${item.variant.product.slug}`;

  return (
    <article className="flex gap-3 border-b border-gray-100 py-4 last:border-b-0">
      <Link
        href={productHref}
        className="block h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5"
        onClick={() => {
          /* navigation closes drawer via route change — optional */
        }}
      >
        <div className="relative h-full w-full">
          {item.variant.product.image ? (
            <Image
              src={item.variant.product.image}
              alt={item.variant.product.title}
              fill
              className="object-contain"
              sizes={`${DRAWER_ITEM_IMAGE_SIZE_PX}px`}
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-50 text-gray-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={productHref}
            className="line-clamp-2 text-sm font-medium leading-snug text-ink-800 hover:text-sky-700"
          >
            {item.variant.product.title}
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={t('common.buttons.remove')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-ink-800">{formatPrice(item.total, currency)}</p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={isUpdating}
              className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              aria-label={t('common.ariaLabels.decreaseQuantity')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold text-ink-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={
                isUpdating ||
                (item.variant.stock !== undefined && item.quantity >= item.variant.stock)
              }
              className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              aria-label={t('common.ariaLabels.increaseQuantity')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
