'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import { Button, Input } from '@shop/ui';
import { apiClient } from '../../../lib/api-client';
import { ApiError } from '../../../lib/api-client/types';
import { useTranslation } from '../../../lib/i18n-client';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
  invalidateAdminListCache,
} from '@/lib/admin/admin-list-client-cache';
import { createEmptyFormData, formDataFromStore, parseFormPayload } from './form-utils';
import { PartnerStoreDrawer } from './PartnerStoreDrawer';
import { PartnerStoresAdminTree } from './PartnerStoresAdminTree';
import {
  buildOrderedIdsFromDrop,
  resolveDropBeforeId,
  type PartnerStoreDragState,
  type PartnerStoreDropIndicator,
} from './partner-store-drag';
import type {
  AdminPartnerStore,
  AdminPartnerStoreArea,
  AdminPartnerStoreRegion,
  PartnerStoreFormData,
} from './types';

type PartnerStoresAdminResponse = {
  data: AdminPartnerStore[];
  regions: AdminPartnerStoreRegion[];
  areas: AdminPartnerStoreArea[];
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function askName(message: string): string | null {
  const value = window.prompt(message);
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

export function PartnerStoresSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [stores, setStores] = useState<AdminPartnerStore[]>([]);
  const [regions, setRegions] = useState<AdminPartnerStoreRegion[]>([]);
  const [areas, setAreas] = useState<AdminPartnerStoreArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingStore, setEditingStore] = useState<AdminPartnerStore | null>(null);
  const [formData, setFormData] = useState<PartnerStoreFormData>(createEmptyFormData);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegionIds, setExpandedRegionIds] = useState<Set<string>>(new Set());
  const [reordering, setReordering] = useState(false);
  const [dragState, setDragState] = useState<PartnerStoreDragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<PartnerStoreDropIndicator | null>(null);

  useBodyScrollLock(showDrawer);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.partnerStores,
        () => apiClient.get<PartnerStoresAdminResponse>('/api/v1/admin/partner-stores'),
      );
      setStores(response.data ?? []);
      setRegions(response.regions ?? []);
      setAreas(response.areas ?? []);
    } catch (err) {
      console.error('Error fetching partner stores:', err);
      setStores([]);
      setRegions([]);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStores();
  }, [fetchStores]);

  const regionNameById = useMemo(
    () => new Map(regions.map((region) => [region.id, region.name])),
    [regions],
  );
  const areaNameById = useMemo(
    () => new Map(areas.map((area) => [area.id, area.name])),
    [areas],
  );

  const filteredStores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return stores;
    }
    return stores.filter((store) => {
      const regionName = regionNameById.get(store.regionId)?.toLowerCase() ?? '';
      const areaName = store.areaId
        ? (areaNameById.get(store.areaId)?.toLowerCase() ?? '')
        : '';
      return (
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.slug.toLowerCase().includes(q) ||
        regionName.includes(q) ||
        areaName.includes(q)
      );
    });
  }, [stores, searchQuery, regionNameById, areaNameById]);

  const storesByRegion = useMemo(() => {
    const map = new Map<string, AdminPartnerStore[]>();
    for (const store of filteredStores) {
      const list = map.get(store.regionId) ?? [];
      list.push(store);
      map.set(store.regionId, list);
    }
    for (const [regionId, list] of map) {
      map.set(
        regionId,
        [...list].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)),
      );
    }
    return map;
  }, [filteredStores]);

  const areasByRegion = useMemo(() => {
    const map = new Map<string, AdminPartnerStoreArea[]>();
    for (const area of areas) {
      const list = map.get(area.regionId) ?? [];
      list.push(area);
      map.set(area.regionId, list);
    }
    for (const [regionId, list] of map) {
      map.set(
        regionId,
        [...list].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)),
      );
    }
    return map;
  }, [areas]);

  const reorderEnabled = searchQuery.trim().length === 0 && !reordering;

  const persistReorder = useCallback(
    async (payload: {
      scope: 'region' | 'area' | 'store';
      orderedIds: string[];
      regionId?: string | null;
      areaId?: string | null;
    }) => {
      setReordering(true);
      try {
        await apiClient.put('/api/v1/admin/partner-stores/reorder', payload);
        invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.partnerStores);
        await fetchStores();
      } catch (err) {
        console.error('Error reordering partner stores:', err);
        alert(t('admin.partnerStores.errorReordering'));
      } finally {
        setReordering(false);
      }
    },
    [fetchStores, t],
  );

  const handleDragStart = useCallback((state: PartnerStoreDragState) => {
    setDragState(state);
    setDropIndicator(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setDropIndicator(null);
  }, []);

  const handleDragOverItem = useCallback(
    (params: {
      event: DragEvent<HTMLElement>;
      targetId: string;
      scope: 'region' | 'area' | 'store';
      regionId: string | null;
      areaId: string | null;
      siblingIds: string[];
    }) => {
      if (!dragState || dragState.scope !== params.scope) {
        return;
      }
      if (dragState.id === params.targetId) {
        return;
      }
      if (dragState.regionId !== params.regionId || dragState.areaId !== params.areaId) {
        return;
      }

      params.event.preventDefault();
      params.event.dataTransfer.dropEffect = 'move';

      const bounds = params.event.currentTarget.getBoundingClientRect();
      const insertBefore = params.event.clientY < bounds.top + bounds.height / 2;
      const beforeId = resolveDropBeforeId(params.targetId, params.siblingIds, insertBefore);

      setDropIndicator({
        scope: params.scope,
        regionId: params.regionId,
        areaId: params.areaId,
        beforeId,
      });
    },
    [dragState],
  );

  const handleDropItem = useCallback(() => {
    if (!dragState || !dropIndicator || dragState.scope !== dropIndicator.scope) {
      handleDragEnd();
      return;
    }
    if (
      dragState.regionId !== dropIndicator.regionId ||
      dragState.areaId !== dropIndicator.areaId
    ) {
      handleDragEnd();
      return;
    }

    const orderedIds = buildOrderedIdsFromDrop(
      dragState.siblingIds,
      dragState.id,
      dropIndicator.beforeId,
    );
    const unchanged =
      !orderedIds ||
      orderedIds.every((id, index) => id === dragState.siblingIds[index]);

    handleDragEnd();

    if (!orderedIds || unchanged) {
      return;
    }

    void persistReorder({
      scope: dragState.scope,
      orderedIds,
      regionId: dragState.regionId,
      areaId: dragState.areaId,
    });
  }, [dragState, dropIndicator, handleDragEnd, persistReorder]);

  const handleOpenAdd = (regionId = '', areaId = '') => {
    setEditingStore(null);
    setFormData(createEmptyFormData(regionId, areaId));
    setShowDrawer(true);
  };

  const handleOpenEdit = (store: AdminPartnerStore) => {
    setEditingStore(store);
    setFormData(formDataFromStore(store));
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingStore(null);
    setFormData(createEmptyFormData());
  };

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(event.target.files ?? []).find((f) => f.type.startsWith('image/'));
    if (!file) {
      return;
    }
    try {
      setImageUploading(true);
      const base64 = await fileToBase64(file);
      const { url } = await apiClient.post<{ url: string }>(
        '/api/v1/admin/partner-stores/upload-logo',
        { image: base64 },
      );
      setFormData((current) => ({ ...current, logoUrl: url }));
    } catch (error) {
      let message = t('admin.partnerStores.logoUploadFailed');
      if (error instanceof ApiError) {
        const data = error.data as { detail?: string } | undefined;
        message = data?.detail ?? error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      alert(message);
    } finally {
      setImageUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDelete = async (store: AdminPartnerStore) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.partnerStores.deleteConfirm').replace('{name}', store.name),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }
    try {
      await apiClient.delete(`/api/v1/admin/partner-stores/${store.id}`);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.partnerStores);
      await fetchStores();
      alert(t('admin.partnerStores.deletedSuccess'));
    } catch (err: unknown) {
      console.error('Error deleting partner store:', err);
      alert(t('admin.partnerStores.errorDeleting'));
    }
  };

  const handleAddRegion = async () => {
    const name = askName(t('admin.partnerStores.regionNamePrompt'));
    if (!name) {
      return;
    }
    try {
      await apiClient.post('/api/v1/admin/partner-store-regions', {
        translations: [
          { locale: 'en', name },
          { locale: 'hy', name },
          { locale: 'ru', name },
        ],
      });
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.partnerStores);
      await fetchStores();
    } catch (err) {
      console.error('Error creating region:', err);
      alert(t('admin.partnerStores.errorSavingRegion'));
    }
  };

  const handleAddArea = async (regionId: string) => {
    const name = askName(t('admin.partnerStores.areaNamePrompt'));
    if (!name) {
      return;
    }
    try {
      await apiClient.post('/api/v1/admin/partner-store-areas', {
        regionId,
        translations: [
          { locale: 'en', name },
          { locale: 'hy', name },
          { locale: 'ru', name },
        ],
      });
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.partnerStores);
      await fetchStores();
      setExpandedRegionIds((current) => new Set(current).add(regionId));
    } catch (err) {
      console.error('Error creating area:', err);
      alert(t('admin.partnerStores.errorSavingArea'));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.regionId) {
      alert(t('admin.partnerStores.regionRequired'));
      return;
    }
    const en = formData.translations.find((tr) => tr.locale === 'en');
    if (!en?.name.trim() || !en.address.trim()) {
      alert(t('admin.partnerStores.enRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = parseFormPayload(formData);
      if (editingStore) {
        await apiClient.put(`/api/v1/admin/partner-stores/${editingStore.id}`, payload);
        alert(t('admin.partnerStores.updatedSuccess'));
      } else {
        await apiClient.post('/api/v1/admin/partner-stores', payload);
        alert(t('admin.partnerStores.createdSuccess'));
      }
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.partnerStores);
      await fetchStores();
      handleCloseDrawer();
    } catch (err: unknown) {
      console.error('Error saving partner store:', err);
      alert(t('admin.partnerStores.errorSaving'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRegion = (regionId: string) => {
    setExpandedRegionIds((current) => {
      const next = new Set(current);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.partnerStores.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">{t('admin.partnerStores.title')}</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void handleAddRegion()}>
            {t('admin.partnerStores.addRegion')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAdd()}
            disabled={regions.length === 0}
          >
            {t('admin.partnerStores.addNew')}
          </Button>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">{t('admin.partnerStores.hierarchyHint')}</p>

      <div className="mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.partnerStores.searchPlaceholder')}
          className="max-w-md"
        />
      </div>

      {regions.length === 0 ? (
        <p className="py-2 text-sm text-gray-500">{t('admin.partnerStores.noRegions')}</p>
      ) : (
        <PartnerStoresAdminTree
          regions={regions}
          areasByRegion={areasByRegion}
          storesByRegion={storesByRegion}
          expandedRegionIds={expandedRegionIds}
          reordering={reordering}
          reorderEnabled={reorderEnabled}
          dragState={dragState}
          dropIndicator={dropIndicator}
          onToggleRegion={toggleRegion}
          onAddArea={(regionId) => void handleAddArea(regionId)}
          onAddStore={handleOpenAdd}
          onEditStore={handleOpenEdit}
          onDeleteStore={(store) => void handleDelete(store)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOverItem={handleDragOverItem}
          onDropItem={handleDropItem}
          labels={{
            addArea: t('admin.partnerStores.addArea'),
            addStoreHere: t('admin.partnerStores.addStoreHere'),
            noStoresInArea: t('admin.partnerStores.noStoresInArea'),
            directStores: t('admin.partnerStores.directStores'),
            noStores: t('admin.partnerStores.noStores'),
            published: t('admin.partnerStores.published'),
            draft: t('admin.partnerStores.draft'),
            edit: t('admin.partnerStores.edit'),
            delete: t('admin.partnerStores.delete'),
            dragToReorder: t('admin.partnerStores.dragToReorder'),
          }}
        />
      )}

      <PartnerStoreDrawer
        open={showDrawer}
        editingStore={editingStore}
        formData={formData}
        regions={regions}
        areas={areas}
        submitting={submitting}
        imageUploading={imageUploading}
        onClose={handleCloseDrawer}
        onSubmit={(event) => void handleSubmit(event)}
        onFormChange={setFormData}
        onLogoUpload={(event) => void handleLogoUpload(event)}
        onRemoveLogo={() => setFormData((current) => ({ ...current, logoUrl: '' }))}
      />
    </>
  );
}
