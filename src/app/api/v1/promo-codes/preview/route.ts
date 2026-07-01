import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/lib/middleware/auth";
import { resolveCheckoutPromo } from "@/lib/promo-codes/resolve-checkout-promo";
import { toApiError } from "@/lib/types/errors";

type PreviewBody = {
  code?: string;
  subtotal?: number;
};

function badRequest(detail: string) {
  return {
    status: 400,
    type: "https://api.shop.am/problems/validation-error",
    title: "Validation Error",
    detail,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PreviewBody;
    const user = await authenticateToken(req);

    const code = typeof body.code === "string" ? body.code : "";
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : Number.NaN;
    if (!Number.isFinite(subtotal)) {
      throw badRequest("Subtotal is required");
    }

    const resolved = await resolveCheckoutPromo({
      code,
      subtotal,
      userId: user?.id ?? null,
    });

    if (!resolved.ok) {
      throw badRequest(resolved.detail);
    }

    return NextResponse.json({
      code: resolved.promo.code,
      discountAmount: resolved.promo.discountAmount,
    });
  } catch (error: unknown) {
    const apiError = toApiError(error, req.url);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
