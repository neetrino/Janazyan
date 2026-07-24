import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { reverseGeocodePartnerStorePlace } from '@/lib/partner-stores/reverse-geocode-place';
import { validatePartnerStoreCoordinates } from '@/lib/services/admin/partner-store-validators';

/**
 * POST /api/v1/admin/partner-stores/reverse-geocode
 * Resolve map pin coordinates to region/area name candidates.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/forbidden',
          title: 'Forbidden',
          status: 403,
          detail: 'Admin access required',
          instance: req.url,
        },
        { status: 403 },
      );
    }

    const body = (await req.json()) as { lat?: unknown; lng?: unknown };
    const lat = typeof body.lat === 'number' ? body.lat : Number(body.lat);
    const lng = typeof body.lng === 'number' ? body.lng : Number(body.lng);

    try {
      validatePartnerStoreCoordinates(lat, lng);
    } catch (validationError: unknown) {
      const err = validationError as {
        status?: number;
        type?: string;
        title?: string;
        detail?: string;
      };
      return NextResponse.json(
        {
          type: err.type ?? 'https://api.shop.am/problems/validation-error',
          title: err.title ?? 'Validation Error',
          status: err.status ?? 400,
          detail: err.detail ?? 'Invalid coordinates',
          instance: req.url,
        },
        { status: err.status ?? 400 },
      );
    }

    const place = await reverseGeocodePartnerStorePlace(lat, lng);
    return NextResponse.json({ data: place });
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      type?: string;
      title?: string;
      detail?: string;
      message?: string;
    };
    return NextResponse.json(
      {
        type: err.type ?? 'https://api.shop.am/problems/internal-error',
        title: err.title ?? 'Internal Server Error',
        status: err.status ?? 500,
        detail: err.detail ?? err.message ?? 'An error occurred',
        instance: req.url,
      },
      { status: err.status ?? 500 },
    );
  }
}
