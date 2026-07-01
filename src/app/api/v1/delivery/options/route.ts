import { NextResponse } from "next/server";
import { adminService } from "@/lib/services/admin.service";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/v1/delivery/options
 * Public delivery countries/zones for checkout.
 */
export async function GET() {
  try {
    const options = await adminService.getDeliveryOptions();
    return NextResponse.json(options);
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      type?: string;
      title?: string;
      status?: number;
      detail?: string;
    };

    logger.error("Delivery options error", {
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
      },
      { status: err?.status ?? 500 },
    );
  }
}
