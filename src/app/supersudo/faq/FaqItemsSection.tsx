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
import { FAQ_LOCALES } from '../../../features/faq/faq-locales';
import { useTranslation } from '../../../lib/i18n-client';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
  invalidateAdminListCache,
} from '@/lib/admin/admin-list-client-cache';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  createEmptyItemFormData,
  itemFormDataFromRow,
  parseItemPayload,
} from './form-utils';
import type { AdminFaqCategory, AdminFaqItem, FaqItemFormData } from './types';

interface FaqItemsSectionProps {
  categoriesVersion: number;
}

export function FaqItemsSection({ categoriesVersion }: FaqItemsSectionProps) {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [categories, setCategories] = useState<AdminFaqCategory[]>([]);
  const [items, setItems] = useState<AdminFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminFaqItem | null>(null);
  const [formData, setFormData] = useState<FaqItemFormData>(createEmptyItemFormData());
  const [activeLocale, setActiveLocale] = useState(FAQ_LOCALES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useBodyScrollLock(showModal);

  const categoryTitleById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.title])),
    [categories],
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        fetchAdminListCached(
          ADMIN_LIST_CACHE_KEYS.faqCategories,
          () =>
            apiClient.get<{ data: AdminFaqCategory[] }>('/api/v1/admin/faq/categories'),
        ),
        fetchAdminListCached(
          ADMIN_LIST_CACHE_KEYS.faqItems,
          () => apiClient.get<{ data: AdminFaqItem[] }>('/api/v1/admin/faq/items'),
        ),
      ]);
      setCategories(categoriesRes.data ?? []);
      setItems(itemsRes.data ?? []);
    } catch {
      setCategories([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData, categoriesVersion]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (categoryTitleById.get(item.categoryId) ?? '').toLowerCase().includes(q),
    );
  }, [items, searchQuery, categoryTitleById]);

  const activeIndex = formData.translations.findIndex((tr) => tr.locale === activeLocale);

  const handleDelete = async (item: AdminFaqItem) => {
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
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqCategories);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqItems);
      await fetchData();
      alert(t('admin.faq.itemDeletedSuccess'));
    } catch {
      alert(t('admin.faq.errorDeleting'));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const en = formData.translations.find((tr) => tr.locale === 'en');
    if (!en?.question.trim() || !en.answer.trim()) {
      alert(t('admin.faq.itemEnRequired'));
      return;
    }
    if (!formData.categoryId) {
      alert(t('admin.faq.categoryRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = parseItemPayload(formData);
      if (editing) {
        await apiClient.put(`/api/v1/admin/faq/items/${editing.id}`, payload);
        alert(t('admin.faq.itemUpdatedSuccess'));
      } else {
        await apiClient.post('/api/v1/admin/faq/items', payload);
        alert(t('admin.faq.itemCreatedSuccess'));
      }
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqCategories);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqItems);
      await fetchData();
      setShowModal(false);
      setEditing(null);
      setFormData(createEmptyItemFormData(categories[0]?.id ?? ''));
    } catch {
      alert(t('admin.faq.errorSaving'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">{t('admin.faq.loadingItems')}</p>;
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{t('admin.faq.itemsTitle')}</h2>
        <Button
          variant="primary"
          size="sm"
          disabled={categories.length === 0}
          onClick={() => {
            setEditing(null);
            setFormData(createEmptyItemFormData(categories[0]?.id ?? ''));
            setActiveLocale('en');
            setShowModal(true);
          }}
        >
          {t('admin.faq.addItem')}
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="mb-4 text-sm text-amber-700">{t('admin.faq.addCategoryFirst')}</p>
      ) : null}

      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('admin.faq.searchItems')}
        className="mb-4 max-w-md"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">{t('admin.faq.noItems')}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
                  {categoryTitleById.get(item.categoryId) ?? '—'}
                </p>
                <p className="mt-1 font-medium text-gray-900">{item.question}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.answer}</p>
                <p className="mt-1 text-xs text-gray-400">#{item.position}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.published ? t('admin.faq.published') : t('admin.faq.draft')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(item);
                    setFormData(itemFormDataFromRow(item));
                    setActiveLocale('en');
                    setShowModal(true);
                  }}
                >
                  {t('admin.faq.edit')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDelete(item)}>
                  {t('admin.faq.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editing ? t('admin.faq.editItem') : t('admin.faq.addItem')}
            </h3>
            <form className="mt-4 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('admin.faq.category')}
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData((c) => ({ ...c, categoryId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="">{t('admin.faq.selectCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {FAQ_LOCALES.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    className={`rounded-lg px-3 py-1 text-sm ${
                      activeLocale === locale ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setActiveLocale(locale)}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>

              {activeIndex >= 0 ? (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('admin.faq.question')}
                      {activeLocale === 'en' ? ' *' : ''}
                    </label>
                    <Input
                      value={formData.translations[activeIndex].question}
                      onChange={(e) =>
                        setFormData((current) => ({
                          ...current,
                          translations: current.translations.map((tr, index) =>
                            index === activeIndex ? { ...tr, question: e.target.value } : tr,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('admin.faq.answer')}
                      {activeLocale === 'en' ? ' *' : ''}
                    </label>
                    <textarea
                      value={formData.translations[activeIndex].answer}
                      onChange={(e) =>
                        setFormData((current) => ({
                          ...current,
                          translations: current.translations.map((tr, index) =>
                            index === activeIndex ? { ...tr, answer: e.target.value } : tr,
                          ),
                        }))
                      }
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('admin.faq.position')}
                  </label>
                  <Input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData((c) => ({ ...c, position: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('admin.faq.status')}
                  </label>
                  <select
                    value={formData.published}
                    onChange={(e) =>
                      setFormData((c) => ({
                        ...c,
                        published: e.target.value as 'published' | 'draft',
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="published">{t('admin.faq.published')}</option>
                    <option value="draft">{t('admin.faq.draft')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                >
                  {t('admin.faq.cancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? t('admin.faq.saving') : t('admin.faq.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
