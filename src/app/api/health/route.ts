import { getHealthResponse } from "@/lib/server/health-handler";

/**
 * GET /api/health
 * App + DATABASE_URL presence + PostgreSQL / Prisma connectivity.
 */
export async function GET() {
  return getHealthResponse();
}
