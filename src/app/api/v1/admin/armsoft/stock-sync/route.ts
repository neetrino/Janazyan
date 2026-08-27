import { NextRequest, NextResponse } from "next/server";
import { authenticateToken, requireAdmin } from "@/lib/middleware/auth";
import { syncArmsoftStockToDb } from "@/lib/armsoft/sync-stock";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function toErrorPayload(error: unknown, instance: string) {
  if (error && typeof error === "object") {
    const problem = error as {
      status?: number;
      type?: string;
      title?: string;
      detail?: string;
      message?: string;
    };
    return {
      status: problem.status || 500,
      body: {
        type: problem.type || "https://api.shop.am/problems/internal-error",
        title: problem.title || "Internal Server Error",
        status: problem.status || 500,
        detail: problem.detail || problem.message || "An error occurred",
        instance,
      },
    };
  }

  return {
    status: 500,
    body: {
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      status: 500,
      detail: "An error occurred",
      instance,
    },
  };
}

/**
 * Admin: pull ArmSoft remainders (stock, price, hy name) into shop by SKU.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/forbidden",
          title: "Forbidden",
          status: 403,
          detail: "Admin access required",
          instance: req.url,
        },
        { status: 403 },
      );
    }

    const result = await syncArmsoftStockToDb();
    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    logger.error("ArmSoft admin catalog sync failed", error);
    const { status, body } = toErrorPayload(error, req.url);
    return NextResponse.json(body, { status });
  }
}
