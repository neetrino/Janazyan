import { db } from '@white-shop/db';
import { toSlug } from '@/lib/utils/slug';
import { resolvePartnerStoreLogoUrl } from '@/lib/partner-stores/resolve-logo-url';
import { resolvePartnerStoreCoordinatesFromAddress } from '@/lib/partner-stores/geocode-partner-store-address';
import type { PartnerStoreTranslationInput } from '@/features/stores/partner-store-locales';
import { logger } from '@/lib/utils/logger';

type AdminPartnerStoreRow = {
  id: string;
  slug: string;
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

function validateTranslations(translations: PartnerStoreTranslationInput[]): void {
  if (!translations.length) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'At least one translation is required',
    };
  }

  const enTranslation = translations.find((t) => t.locale === 'en');
  if (!enTranslation?.name.trim() || !enTranslation.address.trim()) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'English name and address are required',
    };
  }
}

function validateCoordinates(lat: number, lng: number): void {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Latitude must be between -90 and 90',
    };
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Longitude must be between -180 and 180',
    };
  }
}

function getEnglishAddress(translations: PartnerStoreTranslationInput[]): string {
  return translations.find((translation) => translation.locale === 'en')?.address.trim() ?? '';
}

async function resolveNextPartnerStorePosition(): Promise<number> {
  const aggregate = await db.partnerStore.aggregate({
    where: { deletedAt: null },
    _max: { position: true },
  });

  return (aggregate._max.position ?? -1) + 1;
}

class AdminPartnerStoresService {
  async getPartnerStores() {
    const stores = await db.partnerStore.findMany({
      where: { deletedAt: null },
      include: { translations: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return {
      data: stores.map((store) => mapAdminStore(store)),
    };
  }

  async createPartnerStore(data: {
    translations: PartnerStoreTranslationInput[];
    logoUrl?: string;
    lat?: number;
    lng?: number;
    position?: number;
    published?: boolean;
  }) {
    validateTranslations(data.translations);

    const enAddress = getEnglishAddress(data.translations);
    const coordinates =
      data.lat !== undefined && data.lng !== undefined
        ? { lat: data.lat, lng: data.lng }
        : await resolvePartnerStoreCoordinatesFromAddress(enAddress);
    validateCoordinates(coordinates.lat, coordinates.lng);

    const enName = data.translations.find((t) => t.locale === 'en')!.name.trim();
    const slug = await generateUniqueSlug(enName);
    const logoUrl = await resolvePartnerStoreLogoUrl(data.logoUrl);
    const position =
      data.position !== undefined ? data.position : await resolveNextPartnerStorePosition();

    const store = await db.partnerStore.create({
      data: {
        slug,
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
      validateTranslations(data.translations);
    }

    const enAddress = data.translations ? getEnglishAddress(data.translations) : '';
    const existingEnAddress =
      store.translations.find((translation) => translation.locale === 'en')?.address.trim() ?? '';
    const shouldRefreshCoordinates =
      Boolean(data.translations) && enAddress !== existingEnAddress;

    const updateData: {
      logoUrl?: string | null;
      lat?: number;
      lng?: number;
      position?: number;
      published?: boolean;
    } = {};

    if (data.logoUrl !== undefined) {
      updateData.logoUrl = await resolvePartnerStoreLogoUrl(data.logoUrl ?? undefined);
    }
    if (shouldRefreshCoordinates) {
      const coordinates = await resolvePartnerStoreCoordinatesFromAddress(enAddress);
      validateCoordinates(coordinates.lat, coordinates.lng);
      updateData.lat = coordinates.lat;
      updateData.lng = coordinates.lng;
    } else if (data.lat !== undefined || data.lng !== undefined) {
      validateCoordinates(data.lat ?? store.lat, data.lng ?? store.lng);
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
      await db.partnerStore.update({
        where: { id: storeId },
        data: updateData,
      });
    }

    if (data.translations) {
      for (const translation of data.translations) {
        if (!translation.name.trim() || !translation.address.trim()) {
          continue;
        }
        await db.partnerStoreTranslation.upsert({
          where: {
            storeId_locale: {
              storeId,
              locale: translation.locale,
            },
          },
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
