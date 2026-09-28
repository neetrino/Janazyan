import { db } from "@white-shop/db";
import { Prisma } from "@white-shop/db";
import { logger } from "@/lib/utils/logger";
import { arcaClient, toArcaAmountMinorUnits } from "@/lib/payments/arca/client";
import { buildArcaReturnUrl, getArcaConfig } from "@/lib/payments/arca/config";
import { convertPrice } from "@/lib/currency";
import { DEFAULT_LANGUAGE } from "@/lib/language";
import {
  logArmsoftStockError,
  releaseUnpostedOrderStock,
} from "@/lib/armsoft/order-stock-commit";

export type ArcaCheckoutPayment = {
  order: { id: string; number: string; total: number; customerLocale: string | null };
  payment: { id: string };
};

/**
 * Registers the checkout order with ArCa and stores the provider transaction id.
 * On failure, marks the payment and order as failed and releases held stock.
 */
export async function registerArcaPayment(
  orderAndPayment: ArcaCheckoutPayment,
): Promise<string> {
  try {
    const arcaConfig = getArcaConfig();
    const amountInArcaCurrency = arcaConfig.currency === '051'
      ? convertPrice(orderAndPayment.order.total, 'USD', 'AMD')
      : orderAndPayment.order.total;
    const returnUrl = buildArcaReturnUrl(orderAndPayment.order.number);
    const registration = await arcaClient.registerOrder({
      orderNumber: orderAndPayment.order.number,
      amountMinorUnits: toArcaAmountMinorUnits(amountInArcaCurrency, arcaConfig.currency),
      returnUrl,
      description: `Order #${orderAndPayment.order.number}`,
      language: orderAndPayment.order.customerLocale || DEFAULT_LANGUAGE,
    });

    await db.payment.update({
      where: { id: orderAndPayment.payment.id },
      data: {
        providerTransactionId: registration.orderId,
        providerResponse: registration.rawResponse as Prisma.InputJsonValue,
      },
    });

    return registration.formUrl;
  } catch (error: unknown) {
    logger.error('ArCa register failed during checkout', {
      orderId: orderAndPayment.order.id,
      paymentId: orderAndPayment.payment.id,
      error,
    });

    const paymentErrorMessage = error instanceof Error
      ? error.message
      : 'Failed to initialize ArCa payment';

    await db.$transaction([
      db.payment.update({
        where: { id: orderAndPayment.payment.id },
        data: {
          status: 'failed',
          errorMessage: paymentErrorMessage,
          failedAt: new Date(),
        },
      }),
      db.order.update({
        where: { id: orderAndPayment.order.id },
        data: {
          paymentStatus: 'failed',
        },
      }),
      db.orderEvent.create({
        data: {
          orderId: orderAndPayment.order.id,
          type: 'payment_init_failed',
          data: {
            provider: 'arca',
            message: paymentErrorMessage,
          },
        },
      }),
    ]);

    await releaseUnpostedOrderStock(orderAndPayment.order.id).catch((releaseError: unknown) => {
      logArmsoftStockError(
        "Failed to release stock after ArCa init error",
        orderAndPayment.order.id,
        releaseError,
      );
    });

    throw {
      status: 502,
      type: "https://api.shop.am/problems/payment-provider-error",
      title: "ArCa unavailable",
      detail: "Failed to initialize ArCa payment. Please try again.",
    };
  }
}
