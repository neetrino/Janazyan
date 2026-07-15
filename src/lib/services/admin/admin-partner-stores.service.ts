import { db } from '@white-shop/db';
import { toSlug } from '@/lib/utils/slug';
import { MAP_DEFAULT_CENTER } from '@/features/stores/constants';
import { resolvePartnerStoreLogoUrl } from '@/lib/partner-stores/resolve-logo-url';
import { resolvePartnerStoreCoordinatesFromAddress } from '@/lib/partner-stores/geocode-partner-store-address';
import type { PartnerStoreTranslationInput } from '@/features/stores/partner-store-locales';
import { adminPartnerStoreHierarchyService } from './admin-partner-store-hierarchy.service';
import {
  getPartnerStoreEnglishAddress,
  validatePartnerStoreCoordinates,
  validatePartnerStoreTranslations,
} from './partner-store-validators';
import { logger } from '@/lib/utils/logger';

const YEREVAN_GEOCODE_MAX_DISTANCE_KM = 18;
const REGION_GEOCODE_MAX_DISTANCE_KM = 60;

type AdminPartnerStoreRow = {
  id: string;
  slug: string;
  regionId: string;
  areaId: string | null;
  logoUrl: string | null;
  lat: number;
  lng: number;
  position: number;
  published: boolean;
  translations: Array<{
    locale: string;
    name: string;
    address: string;
    logoAlt: string | null;
  }>;
};

function mapAdminStore(row: AdminPartnerStoreRow, displayLocale = 'en') {
  const translation =
    row.translations.find((t) => t.locale === displayLocale) ?? row.translations[0];

  return {
    id: row.id,
    slug: row.slug,
    regionId: row.regionId,
    areaId: row.areaId,
    name: translation?.name ?? '',
    address: translation?.address ?? '',
    logoUrl: row.logoUrl,
    lat: row.lat,
    lng: row.lng,
    position: row.position,
    published: Boolean(row.published),
    translations: row.translations.map((t) => ({
      locale: t.locale,
      name: t.name,
      address: t.address,
      logoAlt: t.logoAlt ?? '',
    })),
  };
}

async function generateUniqueSlug(baseName: string, excludeId?: string): Promise<string> {
  const baseSlug = toSlug(baseName) || 'store';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.partnerStore.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
    if (counter > 1000) {
      throw {
        status: 500,
        type: 'https://api.shop.am/problems/internal-error',
        title: 'Unable to generate unique slug',
        detail: 'Could not generate a unique slug for the partner store',
      };
    }
  }
}

async function resolveNextPartnerStorePosition(
  regionId: string,
  areaId: string | null,
): Promise<number> {
  const aggregate = await db.partnerStore.aggregate({
    where: { deletedAt: null, regionId, areaId },
    _max: { position: true },
  });
  return (aggregate._max.position ?? -1) + 1;
}

function ensureResolvedCoordinates(
  coordinates: { lat: number; lng: number } | null,
): { lat: number; lng: number } {
  if (coordinates) {
    return coordinates;
  }

  throw {
    status: 400,
    type: 'https://api.shop.am/problems/validation-error',
    title: 'Validation Error',
    detail: 'Could not resolve coordinates from address. Set map coordinates manually.',
  };
}

async function resolveGeocodePlaceContext(
  regionId: string,
  areaId: string | null,
): Promise<{ regionName: string | null; areaName: string | null }> {
  const [region, area] = await Promise.all([
    db.partnerStoreRegion.findUnique({
      where: { id: regionId },
      include: { translations: true },
    }),
    areaId
      ? db.partnerStoreArea.findUnique({
          where: { id: areaId },
          include: { translations: true },
        })
      : Promise.resolve(null),
  ]);

  const pickEnName = (
    translations: Array<{ locale: string; name: string }> | undefined,
  ): string | null =>
    translations?.find((translation) => translation.locale === 'en')?.name ??
    translations?.[0]?.name ??
    null;

  return {
    regionName: pickEnName(region?.translations),
    areaName: pickEnName(area?.translations ?? undefined),
  };
}

class AdminPartnerStoresService {
  async getPartnerStores() {
    const [stores, hierarchy] = await Promise.all([
      db.partnerStore.findMany({
        where: { deletedAt: null },
        include: { translations: true },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      }),
      adminPartnerStoreHierarchyService.listRegionsAndAreas(),
    ]);

    return {
      data: stores.map((store) => mapAdminStore(store)),
      regions: hierarchy.regions,
      areas: hierarchy.areas,
    };
  }

  async createPartnerStore(data: {
    regionId: string;
    areaId?: string | null;
    translations: PartnerStoreTranslationInput[];
    logoUrl?: string;
    lat?: number;
    lng?: number;
    position?: number;
    published?: boolean;
  }) {
    if (!data.regionId?.trim()) {
      throw {
        status: 400,
        type: 'https://api.shop.am/problems/validation-error',
        title: 'Validation Error',
        detail: 'Region is required',
      };
    }

    const areaId = data.areaId?.trim() || null;
    await adminPartnerStoreHierarchyService.assertRegionAreaLink(data.regionId, areaId);
    validatePartnerStoreTranslations(data.translations);

    const enAddress = getPartnerStoreEnglishAddress(data.translations);
    const placeContext = await resolveGeocodePlaceContext(data.regionId, areaId);
    const isYerevan = placeContext.regionName === 'Yerevan';
    const coordinates =
      data.lat !== undefined && data.lng !== undefined
        ? { lat: data.lat, lng: data.lng }
        : ensureResolvedCoordinates(
            await resolvePartnerStoreCoordinatesFromAddress({
              address: enAddress,
              regionName: placeContext.regionName,
              areaName: placeContext.areaName,
              anchor: isYerevan ? { ...MAP_DEFAULT_CENTER } : null,
              maxDistanceKm: isYerevan
                ? YEREVAN_GEOCODE_MAX_DISTANCE_KM
                : REGION_GEOCODE_MAX_DISTANCE_KM,
            }),
          );
    validatePartnerStoreCoordinates(coordinates.lat, coordinates.lng);

    const enName = data.translations.find((t) => t.locale === 'en')!.name.trim();
    const slug = await generateUniqueSlug(enName);
    const logoUrl = await resolvePartnerStoreLogoUrl(data.logoUrl);
    const position =
      data.position !== undefined
        ? data.position
        : await resolveNextPartnerStorePosition(data.regionId, areaId);

    const store = await db.partnerStore.create({
      data: {
        slug,
        regionId: data.regionId,
        areaId,
        logoUrl: logoUrl ?? undefined,
        lat: coordinates.lat,
        lng: coordinates.lng,
        position,
        published: data.published ?? true,
        translations: {
          create: data.translations
            .filter((t) => t.name.trim() && t.address.trim())
            .map((t) => ({
              locale: t.locale,
              name: t.name.trim(),
              address: t.address.trim(),
              logoAlt: t.logoAlt?.trim() || null,
            })),
        },
      },
      include: { translations: true },
    });

    logger.info('Partner store created', { id: store.id, slug: store.slug });
    return { data: mapAdminStore(store) };
  }

  async updatePartnerStore(
    storeId: string,
    data: {
      regionId?: string;
      areaId?: string | null;
      translations?: PartnerStoreTranslationInput[];
      logoUrl?: string | null;
      lat?: number;
      lng?: number;
      position?: number;
      published?: boolean;
    },
  ) {
    const store = await db.partnerStore.findUnique({
      where: { id: storeId },
      include: { translations: true },
    });

    if (!store || store.deletedAt) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Partner store not found',
        detail: `Partner store with id '${storeId}' does not exist`,
      };
    }

    if (data.translations) {
      validatePartnerStoreTranslations(data.translations);
    }

    const nextRegionId = data.regionId ?? store.regionId;
    const nextAreaId =
      data.areaId !== undefined ? data.areaId?.trim() || null : store.areaId;
    await adminPartnerStoreHierarchyService.assertRegionAreaLink(nextRegionId, nextAreaId);

    const enAddress = data.translations ? getPartnerStoreEnglishAddress(data.translations) : '';
    const existingEnAddress =
      store.translations.find((translation) => translation.locale === 'en')?.address.trim() ?? '';
    const shouldRefreshCoordinates =
      Boolean(data.translations) && enAddress !== existingEnAddress;

    const updateData: {
      regionId?: string;
      areaId?: string | null;
      logoUrl?: string | null;
      lat?: number;
      lng?: number;
      position?: number;
      published?: boolean;
    } = {};

    if (data.regionId !== undefined) {
      updateData.regionId = data.regionId;
    }
    if (data.areaId !== undefined) {
      updateData.areaId = nextAreaId;
    }
    if (data.logoUrl !== undefined) {
      updateData.logoUrl = await resolvePartnerStoreLogoUrl(data.logoUrl ?? undefined);
    }
    if (shouldRefreshCoordinates) {
      const placeContext = await resolveGeocodePlaceContext(nextRegionId, nextAreaId);
      const isYerevan = placeContext.regionName === 'Yerevan';
      const coordinates = ensureResolvedCoordinates(
        await resolvePartnerStoreCoordinatesFromAddress({
          address: enAddress,
          regionName: placeContext.regionName,
          areaName: placeContext.areaName,
          anchor: isYerevan ? { ...MAP_DEFAULT_CENTER } : null,
          maxDistanceKm: isYerevan
            ? YEREVAN_GEOCODE_MAX_DISTANCE_KM
            : REGION_GEOCODE_MAX_DISTANCE_KM,
        }),
      );
      validatePartnerStoreCoordinates(coordinates.lat, coordinates.lng);
      updateData.lat = coordinates.lat;
      updateData.lng = coordinates.lng;
    } else if (data.lat !== undefined || data.lng !== undefined) {
      validatePartnerStoreCoordinates(data.lat ?? store.lat, data.lng ?? store.lng);
      if (data.lat !== undefined) {
        updateData.lat = data.lat;
      }
      if (data.lng !== undefined) {
        updateData.lng = data.lng;
      }
    }
    if (data.position !== undefined) {
      updateData.position = data.position;
    }
    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    if (Object.keys(updateData).length > 0) {
      await db.partnerStore.update({ where: { id: storeId }, data: updateData });
    }

    if (data.translations) {
      for (const translation of data.translations) {
        if (!translation.name.trim() || !translation.address.trim()) {
          continue;
        }
        await db.partnerStoreTranslation.upsert({
          where: { storeId_locale: { storeId, locale: translation.locale } },
          create: {
            storeId,
            locale: translation.locale,
            name: translation.name.trim(),
            address: translation.address.trim(),
            logoAlt: translation.logoAlt?.trim() || null,
          },
          update: {
            name: translation.name.trim(),
            address: translation.address.trim(),
            logoAlt: translation.logoAlt?.trim() || null,
          },
        });
      }
    }

    const updated = await db.partnerStore.findUnique({
      where: { id: storeId },
      include: { translations: true },
    });

    return { data: mapAdminStore(updated!) };
  }

  async deletePartnerStore(storeId: string) {
    const store = await db.partnerStore.findUnique({ where: { id: storeId } });
    if (!store || store.deletedAt) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Partner store not found',
        detail: `Partner store with id '${storeId}' does not exist`,
      };
    }

    await db.partnerStore.update({
      where: { id: storeId },
      data: { deletedAt: new Date(), published: false },
    });

    return { success: true };
  }
}

export const adminPartnerStoresService = new AdminPartnerStoresService();
