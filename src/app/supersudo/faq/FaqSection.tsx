'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import { Button, Input } from '@shop/ui';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
  invalidateAdminListCache,
} from '@/lib/admin/admin-list-client-cache';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { FaqItemDrawer } from './FaqItemDrawer';
import {
  createEmptyItemFormData,
  itemFormDataFromRow,
  parseItemPayload,
} from './form-utils';
import type { AdminFaqItem, FaqItemFormData } from './types';

export function FaqSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [items, setItems] = useState<AdminFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminFaqItem | null>(null);
  const [itemFormData, setItemFormData] = useState<FaqItemFormData>(createEmptyItemFormData());
  const [itemSubmitting, setItemSubmitting] = useState(false);

  useBodyScrollLock(itemDrawerOpen);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.faqItems,
        () => apiClient.get<{ data: AdminFaqItem[] }>('/api/v1/admin/faq/items'),
      );
      setItems(response.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  const openItemDrawer = (item: AdminFaqItem | null) => {
    setEditingItem(item);
    setItemFormData(item ? itemFormDataFromRow(item) : createEmptyItemFormData());
    setItemDrawerOpen(true);
  };

  const closeItemDrawer = () => {
    setItemDrawerOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (item: AdminFaqItem) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.faq.deleteItemConfirm').replace('{question}', item.question),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/admin/faq/items/${item.id}`);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqItems);
      await fetchItems();
      alert(t('admin.faq.itemDeletedSuccess'));
    } catch {
      alert(t('admin.faq.errorDeleting'));
    }
  };

  const handleItemSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const en = itemFormData.translations.find((tr) => tr.locale === 'en');
    if (!en?.question.trim() || !en.answer.trim()) {
      alert(t('admin.faq.itemEnRequired'));
      return;
    }

    setItemSubmitting(true);
    try {
      const payload = parseItemPayload(itemFormData, editingItem !== null);
      if (editingItem) {
        await apiClient.put(`/api/v1/admin/faq/items/${editingItem.id}`, payload);
        alert(t('admin.faq.itemUpdatedSuccess'));
      } else {
        await apiClient.post('/api/v1/admin/faq/items', payload);
        alert(t('admin.faq.itemCreatedSuccess'));
      }
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqItems);
      await fetchItems();
      closeItemDrawer();
    } catch {
      alert(t('admin.faq.errorSaving'));
    } finally {
      setItemSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.faq.loadingItems')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('admin.faq.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('admin.faq.subtitle')}</p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="rounded-full"
          onClick={() => openItemDrawer(null)}
        >
          {t('admin.faq.createNew')}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.faq.searchItems')}
          className="max-w-md"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
          <p className="text-sm text-gray-500">{t('admin.faq.emptyState')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{item.question}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.published ? t('admin.faq.published') : t('admin.faq.draft')}
                </span>
                <Button variant="outline" size="sm" onClick={() => openItemDrawer(item)}>
                  {t('admin.faq.edit')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDeleteItem(item)}>
                  {t('admin.faq.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqItemDrawer
        open={itemDrawerOpen}
        editing={editingItem}
        formData={itemFormData}
        submitting={itemSubmitting}
        onClose={closeItemDrawer}
        onSubmit={(e) => void handleItemSubmit(e)}
        onFormChange={setItemFormData}
      />
    </>
  );
}
