import { NextRequest, NextResponse } from "next/server";
import { Prisma, db } from "@white-shop/db";
import { arcaClient } from "@/lib/payments/arca/client";
import { logger } from "@/lib/utils/logger";

function buildRedirectUrl(req: NextRequest, path: string): URL {
  return new URL(path, req.url);
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function GET(req: NextRequest) {
  const arcaOrderIdFromQuery = req.nextUrl.searchParams.get("orderId")?.trim() ?? "";
  const orderNumberFromQuery = req.nextUrl.searchParams.get("order")?.trim() ?? "";

  if (!arcaOrderIdFromQuery && !orderNumberFromQuery) {
    return NextResponse.redirect(buildRedirectUrl(req, "/checkout?payment=failed"));
  }

  const payment = await db.payment.findFirst({
    where: orderNumberFromQuery
      ? {
          provider: "arca",
          order: {
            number: orderNumberFromQuery,
          },
        }
      : {
          provider: "arca",
          providerTransactionId: arcaOrderIdFromQuery,
        },
    include: {
      order: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!payment) {
    logger.warn("ArCa callback: payment not found", {
      orderNumberFromQuery,
      arcaOrderIdFromQuery,
    });
    return NextResponse.redirect(buildRedirectUrl(req, "/checkout?payment=failed"));
  }

  if (payment.order.paymentStatus === "paid") {
    return NextResponse.redirect(
      buildRedirectUrl(req, `/orders/${payment.order.number}?payment=paid`),
    );
  }

  const arcaOrderId = payment.providerTransactionId ?? arcaOrderIdFromQuery;
  if (!arcaOrderId) {
    logger.error("ArCa callback: missing provider transaction id", {
      paymentId: payment.id,
      orderNumber: payment.order.number,
    });
    return NextResponse.redirect(
      buildRedirectUrl(req, `/orders/${payment.order.number}?payment=failed`),
    );
  }

  try {
    const statusResponse = await arcaClient.getOrderStatus(arcaOrderId);
    const isPaid = arcaClient.isPaymentSuccessful(statusResponse);

    if (isPaid) {
      await db.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "paid",
            providerTransactionId: arcaOrderId,
            providerResponse: toJsonValue(statusResponse),
            errorCode: null,
            errorMessage: null,
            completedAt: new Date(),
            failedAt: null,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: "paid",
            paidAt: new Date(),
          },
        });

        await tx.orderEvent.create({
          data: {
            orderId: payment.orderId,
            type: "payment_confirmed",
            data: {
              provider: "arca",
              providerTransactionId: arcaOrderId,
            },
          },
        });

        if (payment.order.userId) {
          await tx.cart.deleteMany({
            where: {
              userId: payment.order.userId,
            },
          });
        }
      });

      return NextResponse.redirect(
        buildRedirectUrl(req, `/orders/${payment.order.number}?payment=paid`),
      );
    }

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          providerTransactionId: arcaOrderId,
          providerResponse: toJsonValue(statusResponse),
          errorCode: String(statusResponse.errorCode ?? ""),
          errorMessage: statusResponse.errorMessage ?? "ArCa payment was not confirmed",
          failedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "failed",
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: payment.orderId,
          type: "payment_failed",
          data: {
            provider: "arca",
            providerTransactionId: arcaOrderId,
            providerErrorCode: statusResponse.errorCode,
            providerErrorMessage: statusResponse.errorMessage,
          },
        },
      });
    });
  } catch (error: unknown) {
    logger.error("ArCa callback verification failed", {
      paymentId: payment.id,
      orderNumber: payment.order.number,
      arcaOrderId,
      error,
    });

    return NextResponse.redirect(
      buildRedirectUrl(req, `/orders/${payment.order.number}?payment=failed`),
    );
  }

  return NextResponse.redirect(
    buildRedirectUrl(req, `/orders/${payment.order.number}?payment=failed`),
  );
}
