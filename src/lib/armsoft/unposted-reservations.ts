import { db } from "@white-shop/db";
import {
  ARMSOFT_STOCK_HELD_EVENT,
  ARMSOFT_STOCK_POSTED_EVENT,
  ARMSOFT_STOCK_RELEASED_EVENT,
} from "./constants";
import { isArmsoftOrderWritebackEnabled } from "./push-order-stock";

/**
 * Quantities already taken from shop stock but not yet posted to ArmSoft.
 * Sync must keep these units out of the sellable quantity.
 */
export async function loadHeldUnpostedQtyByVariant(): Promise<Map<string, number>> {
  const reserved = new Map<string, number>();
  if (!isArmsoftOrderWritebackEnabled()) {
    return reserved;
  }

  const orders = await db.order.findMany({
    where: {
      status: { not: "cancelled" },
      paymentStatus: { in: ["pending", "paid"] },
      AND: [
        { events: { some: { type: ARMSOFT_STOCK_HELD_EVENT } } },
        { events: { none: { type: ARMSOFT_STOCK_POSTED_EVENT } } },
        { events: { none: { type: ARMSOFT_STOCK_RELEASED_EVENT } } },
      ],
    },
    select: {
      items: { select: { variantId: true, quantity: true } },
    },
  });

  for (const order of orders) {
    for (const item of order.items) {
      if (!item.variantId || item.quantity <= 0) {
        continue;
      }
      reserved.set(item.variantId, (reserved.get(item.variantId) ?? 0) + item.quantity);
    }
  }

  return reserved;
}
