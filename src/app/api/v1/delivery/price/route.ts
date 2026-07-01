import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/services/admin.service";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/v1/delivery/price
 * Get delivery price for a zone and order subtotal.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const zone = searchParams.get('zone') ?? searchParams.get('city');
    const country = searchParams.get('country') || 'Armenia';
    const subtotalParam = searchParams.get('subtotal');
    const orderSubtotalAmd = subtotalParam ? Number(subtotalParam) : 0;

    if (!zone) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/validation-error",
          title: "Validation Error",
          status: 400,
          detail: "Zone parameter is required",
        },
        { status: 400 },
      );
    }

    logger.debug("Delivery price request", { zone, country, orderSubtotalAmd });
    const price = await adminService.getDeliveryPrice(
      zone,
      country,
      Number.isFinite(orderSubtotalAmd) ? orderSubtotalAmd : 0,
    );

    return NextResponse.json({ price });
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      type?: string;
      title?: string;
      status?: number;
      detail?: string;
    };

    logger.error("Delivery price error", {
      message: err?.message,
      type: err?.type,
      status: err?.status,
    });

    return NextResponse.json(
      {
        type: err?.type ?? "https://api.shop.am/problems/internal-error",
        title: err?.title ?? "Internal Server Error",
        status: err?.status ?? 500,
        detail: err?.detail ?? err?.message ?? "An error occurred",
        instance: req.url,
      },
      { status: err?.status ?? 500 },
    );
  }
}
