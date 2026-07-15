import { db } from '@white-shop/db';
import { logger } from '@/lib/utils/logger';
import { validationError } from './partner-store-hierarchy.helpers';

export type PartnerStoreReorderScope = 'region' | 'area' | 'store';

type ReorderInput = {
  scope: PartnerStoreReorderScope;
  orderedIds: string[];
  /** Required for area (regionId) and store (regionId). */
  regionId?: string | null;
  /** Required for store siblings that share an area; null = direct region stores. */
  areaId?: string | null;
};

async function assertExactIds(expectedIds: string[], orderedIds: string[], label: string) {
  const expectedSet = new Set(expectedIds);
  const orderedSet = new Set(orderedIds);
  const valid =
    orderedIds.length === expectedIds.length &&
    expectedIds.every((id) => orderedSet.has(id)) &&
    orderedIds.every((id) => expectedSet.has(id));

  if (!valid) {
    throw validationError(`orderedIds must include every ${label} sibling exactly once`);
  }
}

class AdminPartnerStoresReorderService {
  async reorder(input: ReorderInput) {
    const orderedIds = input.orderedIds.map((id) => String(id));

    if (input.scope === 'region') {
      const siblings = await db.partnerStoreRegion.findMany({
        where: { deletedAt: null },
        select: { id: true },
        orderBy: { position: 'asc' },
      });
      await assertExactIds(
        siblings.map((row) => row.id),
        orderedIds,
        'region',
      );

      await db.$transaction(
        orderedIds.map((id, index) =>
          db.partnerStoreRegion.update({
            where: { id },
            data: { position: index },
          }),
        ),
      );

      logger.info('Partner store regions reordered', { count: orderedIds.length });
      return { success: true };
    }

    if (input.scope === 'area') {
      if (!input.regionId) {
        throw validationError('regionId is required when reordering areas');
      }

      const siblings = await db.partnerStoreArea.findMany({
        where: { deletedAt: null, regionId: input.regionId },
        select: { id: true },
        orderBy: { position: 'asc' },
      });
      await assertExactIds(
        siblings.map((row) => row.id),
        orderedIds,
        'area',
      );

      await db.$transaction(
        orderedIds.map((id, index) =>
          db.partnerStoreArea.update({
            where: { id },
            data: { position: index },
          }),
        ),
      );

      logger.info('Partner store areas reordered', {
        regionId: input.regionId,
        count: orderedIds.length,
      });
      return { success: true };
    }

    if (!input.regionId) {
      throw validationError('regionId is required when reordering stores');
    }

    const areaId = input.areaId ?? null;
    const siblings = await db.partnerStore.findMany({
      where: {
        deletedAt: null,
        regionId: input.regionId,
        areaId,
      },
      select: { id: true },
      orderBy: { position: 'asc' },
    });
    await assertExactIds(
      siblings.map((row) => row.id),
      orderedIds,
      'store',
    );

    await db.$transaction(
      orderedIds.map((id, index) =>
        db.partnerStore.update({
          where: { id },
          data: { position: index },
        }),
      ),
    );

    logger.info('Partner stores reordered', {
      regionId: input.regionId,
      areaId,
      count: orderedIds.length,
    });
    return { success: true };
  }
}

export const adminPartnerStoresReorderService = new AdminPartnerStoresReorderService();
