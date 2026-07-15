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

async function nextAreaPosition(regionId: string): Promise<number> {
  const aggregate = await db.partnerStoreArea.aggregate({
    where: { regionId, deletedAt: null },
    _max: { position: true },
  });
  return (aggregate._max.position ?? -1) + 1;
}

class AdminPartnerStoreAreasService {
  async listAreas() {
    const areas = await db.partnerStoreArea.findMany({
      where: { deletedAt: null },
      include: { translations: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return areas.map((area) => ({
      id: area.id,
      regionId: area.regionId,
      slug: area.slug,
      position: area.position,
      published: area.published,
      name: pickTranslationName(area.translations),
      translations: mapNameTranslations(area.translations),
    }));
  }

  async createArea(data: {
    regionId: string;
    translations: LocaleNameInput[];
    position?: number;
    published?: boolean;
  }) {
    const region = await db.partnerStoreRegion.findUnique({ where: { id: data.regionId } });
    if (!region || region.deletedAt) {
      throw notFoundError(`Partner store region '${data.regionId}' does not exist`);
    }

    const translations = normalizeNameTranslations(data.translations);
    const enName = translations.find((t) => t.locale === 'en')!.name;
    const slug = await generateUniqueSlug(
      async (candidate) =>
        Boolean(
          await db.partnerStoreArea.findFirst({
            where: { regionId: data.regionId, slug: candidate },
          }),
        ),
      enName,
      'area',
    );
    const position = data.position ?? (await nextAreaPosition(data.regionId));

    const area = await db.partnerStoreArea.create({
      data: {
        regionId: data.regionId,
        slug,
        position,
        published: data.published ?? true,
        translations: { create: translations },
      },
      include: { translations: true },
    });

    logger.info('Partner store area created', { id: area.id, slug: area.slug });
    return {
      data: {
        id: area.id,
        regionId: area.regionId,
        slug: area.slug,
        position: area.position,
        published: area.published,
        name: pickTranslationName(area.translations),
        translations: mapNameTranslations(area.translations),
      },
    };
  }

  async updateArea(
    areaId: string,
    data: {
      regionId?: string;
      translations?: LocaleNameInput[];
      position?: number;
      published?: boolean;
    },
  ) {
    const area = await db.partnerStoreArea.findUnique({
      where: { id: areaId },
      include: { translations: true },
    });
    if (!area || area.deletedAt) {
      throw notFoundError(`Partner store area '${areaId}' does not exist`);
    }

    const nextRegionId = data.regionId ?? area.regionId;
    if (data.regionId && data.regionId !== area.regionId) {
      const region = await db.partnerStoreRegion.findUnique({ where: { id: data.regionId } });
      if (!region || region.deletedAt) {
        throw notFoundError(`Partner store region '${data.regionId}' does not exist`);
      }
    }

    const updateData: {
      regionId?: string;
      position?: number;
      published?: boolean;
      slug?: string;
    } = {};
    if (data.regionId !== undefined) {
      updateData.regionId = data.regionId;
    }
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
            await db.partnerStoreArea.findFirst({
              where: {
                regionId: nextRegionId,
                slug: candidate,
                id: { not: areaId },
              },
            }),
          ),
        enName,
        'area',
      );

      await db.partnerStoreArea.update({ where: { id: areaId }, data: updateData });

      for (const translation of translations) {
        await db.partnerStoreAreaTranslation.upsert({
          where: { areaId_locale: { areaId, locale: translation.locale } },
          create: { areaId, locale: translation.locale, name: translation.name },
          update: { name: translation.name },
        });
      }
    } else if (Object.keys(updateData).length > 0) {
      await db.partnerStoreArea.update({ where: { id: areaId }, data: updateData });
    }

    if (data.regionId && data.regionId !== area.regionId) {
      await db.partnerStore.updateMany({
        where: { areaId, deletedAt: null },
        data: { regionId: data.regionId },
      });
    }

    const updated = await db.partnerStoreArea.findUnique({
      where: { id: areaId },
      include: { translations: true },
    });

    return {
      data: {
        id: updated!.id,
        regionId: updated!.regionId,
        slug: updated!.slug,
        position: updated!.position,
        published: updated!.published,
        name: pickTranslationName(updated!.translations),
        translations: mapNameTranslations(updated!.translations),
      },
    };
  }

  async deleteArea(areaId: string) {
    const area = await db.partnerStoreArea.findUnique({ where: { id: areaId } });
    if (!area || area.deletedAt) {
      throw notFoundError(`Partner store area '${areaId}' does not exist`);
    }

    const activeStores = await db.partnerStore.count({
      where: { areaId, deletedAt: null },
    });
    if (activeStores > 0) {
      throw validationError('Cannot delete an area that still has stores');
    }

    await db.partnerStoreArea.update({
      where: { id: areaId },
      data: { deletedAt: new Date(), published: false },
    });

    return { success: true };
  }

  /** Ensures region exists and optional area belongs to that region. */
  async assertRegionAreaLink(regionId: string, areaId?: string | null): Promise<void> {
    const region = await db.partnerStoreRegion.findUnique({ where: { id: regionId } });
    if (!region || region.deletedAt) {
      throw notFoundError(`Partner store region '${regionId}' does not exist`);
    }

    if (!areaId) {
      return;
    }

    const area = await db.partnerStoreArea.findUnique({ where: { id: areaId } });
    if (!area || area.deletedAt) {
      throw notFoundError(`Partner store area '${areaId}' does not exist`);
    }
    if (area.regionId !== regionId) {
      throw validationError('Area does not belong to the selected region');
    }
  }
}

export const adminPartnerStoreAreasService = new AdminPartnerStoreAreasService();
