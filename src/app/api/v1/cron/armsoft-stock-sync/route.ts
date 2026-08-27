import { NextRequest, NextResponse } from "next/server";
import { syncArmsoftStockToDb } from "@/lib/armsoft/sync-stock";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorizedCron(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return false;
  }

  const authHeader = req.headers.get("authorization")?.trim() ?? "";
  return authHeader === `Bearer ${cronSecret}`;
}

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
 * Vercel Cron (every 15m): sync ArmSoft stock, price, name → shop by SKU.
 * Auth: Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json(
      {
        type: "https://api.shop.am/problems/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Valid CRON_SECRET bearer token required",
        instance: req.url,
      },
      { status: 401 },
    );
  }

  try {
    const result = await syncArmsoftStockToDb();
    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    logger.error("ArmSoft cron catalog sync failed", error);
    const { status, body } = toErrorPayload(error, req.url);
    return NextResponse.json(body, { status });
  }
}
