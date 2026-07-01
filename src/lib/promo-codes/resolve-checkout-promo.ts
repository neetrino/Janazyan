import { db } from "@white-shop/db";
import { isPromoDiscountType } from "./constants";
import { isPromoAllowedForUser } from "./is-promo-allowed-for-user";

type ResolveCheckoutPromoInput = {
  code: string;
  subtotal: number;
  userId?: string | null;
  now?: Date;
};

export type ResolvedCheckoutPromo = {
  id: string;
  code: string;
  discountAmount: number;
  usageLimit: number | null;
};

type ResolveCheckoutPromoResult =
  | { ok: true; promo: ResolvedCheckoutPromo }
  | { ok: false; detail: string };

function normalizePromoCode(rawCode: string): string {
  return rawCode.trim().toUpperCase();
}

function calculatePromoDiscountAmount(
  subtotal: number,
  discountType: string,
  discountValue: number,
  maxDiscountAmount: number | null,
): number {
  const normalizedSubtotal = Math.max(0, subtotal);
  const normalizedValue = Math.max(0, discountValue);

  let discount = 0;
  if (discountType === "percent") {
    discount = normalizedSubtotal * (normalizedValue / 100);
  } else if (discountType === "fixed") {
    discount = normalizedValue;
  }

  if (maxDiscountAmount !== null) {
    discount = Math.min(discount, Math.max(0, maxDiscountAmount));
  }

  return Math.min(Math.max(0, discount), normalizedSubtotal);
}

export async function resolveCheckoutPromo(
  input: ResolveCheckoutPromoInput,
): Promise<ResolveCheckoutPromoResult> {
  const normalizedCode = normalizePromoCode(input.code);
  const subtotal = Math.max(0, input.subtotal);
  const now = input.now ?? new Date();

  if (!normalizedCode) {
    return { ok: false, detail: "Promo code is required" };
  }

  if (subtotal <= 0) {
    return { ok: false, detail: "Promo code can be used only with non-empty cart" };
  }

  const promo = await db.promoCode.findFirst({
    where: {
      code: normalizedCode,
      deletedAt: null,
    },
    include: {
      allowedUsers: {
        select: { userId: true },
      },
    },
  });

  if (!promo || !promo.active) {
    return { ok: false, detail: "Promo code is invalid or inactive" };
  }

  if (promo.validFrom && promo.validFrom.getTime() > now.getTime()) {
    return { ok: false, detail: "Promo code is not active yet" };
  }

  if (promo.validUntil && promo.validUntil.getTime() < now.getTime()) {
    return { ok: false, detail: "Promo code has expired" };
  }

  if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
    return { ok: false, detail: "Promo code usage limit reached" };
  }

  const allowedUserIds = promo.allowedUsers.map((entry) => entry.userId);
  if (!isPromoAllowedForUser(allowedUserIds, input.userId)) {
    return { ok: false, detail: "Promo code is not available for this account" };
  }

  if (promo.minSubtotal !== null && subtotal < promo.minSubtotal) {
    return { ok: false, detail: `Minimum subtotal is ${promo.minSubtotal}` };
  }

  if (!isPromoDiscountType(promo.discountType)) {
    return { ok: false, detail: "Promo code has unsupported discount type" };
  }

  const discountAmount = calculatePromoDiscountAmount(
    subtotal,
    promo.discountType,
    promo.discountValue,
    promo.maxDiscountAmount,
  );

  if (discountAmount <= 0) {
    return { ok: false, detail: "Promo code does not affect this order" };
  }

  return {
    ok: true,
    promo: {
      id: promo.id,
      code: promo.code,
      discountAmount,
      usageLimit: promo.usageLimit,
    },
  };
}
