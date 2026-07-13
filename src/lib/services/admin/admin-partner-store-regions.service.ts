import { db } from '@white-shop/db';
import { logger } from '@/lib/utils/logger';
import {
  generateUniqueSlug,
  mapNameTranslations,
  normalizeNameTranslations,
  notFoundError,
  pickTranslationName,
  validationError,
  type LocaleNameInput,
} from './partner-store-hierarchy.helpers';

async function nextRegionPosition(): Promise<number> {
  const aggregate = await db.partnerStoreRegion.aggregate({
    where: { deletedAt: null },
    _max: { position: true },
  });
  return (aggregate._max.position ?? -1) + 1;
}

class AdminPartnerStoreRegionsService {
  async listRegions() {
    const regions = await db.partnerStoreRegion.findMany({
      where: { deletedAt: null },
      include: { translations: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return regions.map((region) => ({
      id: region.id,
      slug: region.slug,
      position: region.position,
      published: region.published,
      name: pickTranslationName(region.translations),
      translations: mapNameTranslations(region.translations),
    }));
  }

  async createRegion(data: {
    translations: LocaleNameInput[];
    position?: number;
    published?: boolean;
  }) {
    const translations = normalizeNameTranslations(data.translations);
    const enName = translations.find((t) => t.locale === 'en')!.name;
    const slug = await generateUniqueSlug(
      async (candidate) =>
        Boolean(await db.partnerStoreRegion.findFirst({ where: { slug: candidate } })),
      enName,
      'region',
    );
    const position = data.position ?? (await nextRegionPosition());

    const region = await db.partnerStoreRegion.create({
      data: {
        slug,
        position,
        published: data.published ?? true,
        translations: { create: translations },
      },
      include: { translations: true },
    });

    logger.info('Partner store region created', { id: region.id, slug: region.slug });
    return {
      data: {
        id: region.id,
        slug: region.slug,
        position: region.position,
        published: region.published,
        name: pickTranslationName(region.translations),
        translations: mapNameTranslations(region.translations),
      },
    };
  }

  async updateRegion(
    regionId: string,
    data: {
      translations?: LocaleNameInput[];
      position?: number;
      published?: boolean;
    },
  ) {
    const region = await db.partnerStoreRegion.findUnique({
      where: { id: regionId },
      include: { translations: true },
    });
    if (!region || region.deletedAt) {
      throw notFoundError(`Partner store region '${regionId}' does not exist`);
    }

    const updateData: { position?: number; published?: boolean; slug?: string } = {};
    if (data.position !== undefined) {
      updateData.position = data.position;
    }
    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    if (data.translations) {
      const translations = normalizeNameTranslations(data.translations);
      const enName = translations.find((t) => t.locale === 'en')!.name;
      updateData.slug = await generateUniqueSlug(
        async (candidate) =>
          Boolean(
            await db.partnerStoreRegion.findFirst({
              where: { slug: candidate, id: { not: regionId } },
            }),
          ),
        enName,
        'region',
      );

      await db.partnerStoreRegion.update({ where: { id: regionId }, data: updateData });

      for (const translation of translations) {
        await db.partnerStoreRegionTranslation.upsert({
          where: { regionId_locale: { regionId, locale: translation.locale } },
          create: { regionId, locale: translation.locale, name: translation.name },
          update: { name: translation.name },
        });
      }
    } else if (Object.keys(updateData).length > 0) {
      await db.partnerStoreRegion.update({ where: { id: regionId }, data: updateData });
    }

    const updated = await db.partnerStoreRegion.findUnique({
      where: { id: regionId },
      include: { translations: true },
    });

    return {
      data: {
        id: updated!.id,
        slug: updated!.slug,
        position: updated!.position,
        published: updated!.published,
        name: pickTranslationName(updated!.translations),
        translations: mapNameTranslations(updated!.translations),
      },
    };
  }

  async deleteRegion(regionId: string) {
    const region = await db.partnerStoreRegion.findUnique({ where: { id: regionId } });
    if (!region || region.deletedAt) {
      throw notFoundError(`Partner store region '${regionId}' does not exist`);
    }

    const activeStores = await db.partnerStore.count({
      where: { regionId, deletedAt: null },
    });
    if (activeStores > 0) {
      throw validationError('Cannot delete a region that still has stores');
    }

    await db.$transaction([
      db.partnerStoreArea.updateMany({
        where: { regionId, deletedAt: null },
        data: { deletedAt: new Date(), published: false },
      }),
      db.partnerStoreRegion.update({
        where: { id: regionId },
        data: { deletedAt: new Date(), published: false },
      }),
    ]);

    return { success: true };
  }
}

export const adminPartnerStoreRegionsService = new AdminPartnerStoreRegionsService();
