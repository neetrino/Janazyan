'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
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
import type { AdminPartnerStore, PartnerStoreFormData } from './types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PartnerStoresSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [stores, setStores] = useState<AdminPartnerStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingStore, setEditingStore] = useState<AdminPartnerStore | null>(null);
  const [formData, setFormData] = useState<PartnerStoreFormData>(createEmptyFormData);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useBodyScrollLock(showDrawer);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.partnerStores,
        () =>
          apiClient.get<{ data: AdminPartnerStore[] }>('/api/v1/admin/partner-stores'),
      );
      setStores(response.data ?? []);
    } catch (err) {
      console.error('Error fetching partner stores:', err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStores();
  }, [fetchStores]);

  const filteredStores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return stores;
    }
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.slug.toLowerCase().includes(q),
    );
  }, [stores, searchQuery]);

  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormData(createEmptyFormData());
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{t('admin.partnerStores.title')}</h2>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          {t('admin.partnerStores.addNew')}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.partnerStores.searchPlaceholder')}
          className="max-w-md"
        />
      </div>

      {filteredStores.length === 0 ? (
        <p className="py-2 text-sm text-gray-500">{t('admin.partnerStores.noStores')}</p>
      ) : (
        <div className="space-y-3">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {store.logoUrl ? (
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className="h-10 w-14 object-contain"
                  />
                ) : (
                  <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                    —
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-xs text-gray-400">#{store.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    store.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {store.published
                    ? t('admin.partnerStores.published')
                    : t('admin.partnerStores.draft')}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(store)}>
                  {t('admin.partnerStores.edit')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDelete(store)}>
                  {t('admin.partnerStores.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PartnerStoreDrawer
        open={showDrawer}
        editingStore={editingStore}
        formData={formData}
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
