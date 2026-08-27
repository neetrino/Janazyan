import { convertPrice } from '@/lib/currency';

/** Order monetary fields as persisted in Prisma. */
export interface OrderAmountFields {
  total: number;
  subtotal?: number | null;
  discountAmount?: number | null;
  shippingAmount?: number | null;
  taxAmount?: number | null;
}

/**
 * Resolves the full order total in AMD.
 * Subtotal, discount, and tax are stored in USD; shipping and `total` are in AMD.
 */
export function resolveOrderTotalAmd(order: OrderAmountFields): number {
  if (
    order.subtotal != null &&
    order.discountAmount != null &&
    order.taxAmount != null
  ) {
    const subtotalAmd = convertPrice(order.subtotal, 'USD', 'AMD');
    const discountAmd = convertPrice(order.discountAmount, 'USD', 'AMD');
    const taxAmd = convertPrice(order.taxAmount, 'USD', 'AMD');
    return subtotalAmd - discountAmd + (order.shippingAmount ?? 0) + taxAmd;
  }

  return order.total;
}

/**
 * Merchandise value in AMD (excludes shipping) — matches admin orders list column.
 */
export function resolveOrderMerchandiseAmd(order: OrderAmountFields): number {
  if (
    order.subtotal != null &&
    order.discountAmount != null &&
    order.taxAmount != null
  ) {
    const subtotalAmd = convertPrice(order.subtotal, 'USD', 'AMD');
    const discountAmd = convertPrice(order.discountAmount, 'USD', 'AMD');
    const taxAmd = convertPrice(order.taxAmount, 'USD', 'AMD');
    return subtotalAmd - discountAmd + taxAmd;
  }

  const shippingAmd = order.shippingAmount ?? 0;
  return Math.max(0, order.total - shippingAmd);
}

/** Orders that should contribute to dashboard revenue. */
export const DASHBOARD_REVENUE_ORDER_WHERE = {
  OR: [{ status: 'completed' as const }, { paymentStatus: 'paid' as const }],
};
