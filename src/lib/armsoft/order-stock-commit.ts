import { Prisma, db } from "@white-shop/db";
import { logger } from "@/lib/utils/logger";
import {
  ARMSOFT_DEFERRED_PAYMENT_METHODS,
  ARMSOFT_STOCK_HELD_EVENT,
  ARMSOFT_STOCK_POSTED_EVENT,
  ARMSOFT_STOCK_RELEASED_EVENT,
} from "./constants";
import {
  isArmsoftOrderWritebackEnabled,
  pushOrderStockToArmsoft,
} from "./push-order-stock";

type StockEvent = { type: string };

/**
 * Cash on delivery is committed at checkout.
 * Card payments wait until paymentStatus becomes paid.
 */
export function postsArmsoftStockOnCheckout(paymentMethod: string): boolean {
  return !ARMSOFT_DEFERRED_PAYMENT_METHODS.includes(
    paymentMethod as (typeof ARMSOFT_DEFERRED_PAYMENT_METHODS)[number],
  );
}

function hasEvent(events: StockEvent[], type: string): boolean {
  return events.some((event) => event.type === type);
}

/**
 * Creates the ArmSoft stock-out once. Safe to call again after payment retries.
 */
export async function commitOrderStockToArmsoft(orderId: string): Promise<void> {
  if (!isArmsoftOrderWritebackEnabled()) {
    return;
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      number: true,
      events: { select: { type: true } },
      items: { select: { sku: true, quantity: true, price: true } },
    },
  });
  if (!order || hasEvent(order.events, ARMSOFT_STOCK_POSTED_EVENT)) {
    return;
  }
  if (hasEvent(order.events, ARMSOFT_STOCK_RELEASED_EVENT)) {
    return;
  }

  const result = await pushOrderStockToArmsoft({
    orderNumber: order.number,
    lines: order.items.map((item) => ({
      sku: item.sku,
      quantity: item.quantity,
      priceUsd: item.price,
    })),
  });
  if (!result.ok || result.skipped) {
    return;
  }

  await db.orderEvent.create({
    data: {
      orderId,
      type: ARMSOFT_STOCK_POSTED_EVENT,
      data: { isn: result.isn ?? null },
    },
  });
}

async function returnItemStock(
  tx: Prisma.TransactionClient,
  variantId: string,
  quantity: number,
): Promise<void> {
  await tx.$executeRaw(
    Prisma.sql`UPDATE product_variants SET stock = stock + ${quantity} WHERE id = ${variantId}`,
  );
}

/**
 * Returns shop stock when an online sale is not completed and ArmSoft was not posted.
 */
export async function releaseUnpostedOrderStock(orderId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        events: { select: { type: true } },
        items: { select: { variantId: true, quantity: true } },
      },
    });
    if (!order || !hasEvent(order.events, ARMSOFT_STOCK_HELD_EVENT)) {
      return;
    }
    if (hasEvent(order.events, ARMSOFT_STOCK_POSTED_EVENT)) {
      return;
    }
    if (hasEvent(order.events, ARMSOFT_STOCK_RELEASED_EVENT)) {
      return;
    }

    for (const item of order.items) {
      if (!item.variantId || item.quantity <= 0) {
        continue;
      }
      await returnItemStock(tx, item.variantId, item.quantity);
    }

    await tx.orderEvent.create({
      data: {
        orderId,
        type: ARMSOFT_STOCK_RELEASED_EVENT,
        data: {},
      },
    });
  });
}

export function logArmsoftStockError(action: string, orderId: string, error: unknown): void {
  logger.error(action, { orderId, error });
}
