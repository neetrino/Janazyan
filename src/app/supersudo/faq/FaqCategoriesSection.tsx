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
  categoryFormDataFromRow,
  createEmptyCategoryFormData,
  parseCategoryPayload,
} from './form-utils';
import type { AdminFaqCategory, FaqCategoryFormData } from './types';

interface FaqCategoriesSectionProps {
  onCategoriesChanged?: () => void;
}

export function FaqCategoriesSection({ onCategoriesChanged }: FaqCategoriesSectionProps) {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [categories, setCategories] = useState<AdminFaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminFaqCategory | null>(null);
  const [formData, setFormData] = useState<FaqCategoryFormData>(createEmptyCategoryFormData);
  const [activeLocale, setActiveLocale] = useState(FAQ_LOCALES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useBodyScrollLock(showModal);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.faqCategories,
        () =>
          apiClient.get<{ data: AdminFaqCategory[] }>('/api/v1/admin/faq/categories'),
      );
      setCategories(response.data ?? []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return categories;
    }
    return categories.filter(
      (c) => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [categories, searchQuery]);

  const activeIndex = formData.translations.findIndex((tr) => tr.locale === activeLocale);

  const notifyChanged = () => {
    onCategoriesChanged?.();
  };

  const handleDelete = async (category: AdminFaqCategory) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.faq.deleteCategoryConfirm').replace('{title}', category.title),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/admin/faq/categories/${category.id}`);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqCategories);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqItems);
      await fetchCategories();
      notifyChanged();
      alert(t('admin.faq.categoryDeletedSuccess'));
    } catch {
      alert(t('admin.faq.errorDeleting'));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const en = formData.translations.find((tr) => tr.locale === 'en');
    if (!en?.title.trim()) {
      alert(t('admin.faq.categoryEnRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = parseCategoryPayload(formData);
      if (editing) {
        await apiClient.put(`/api/v1/admin/faq/categories/${editing.id}`, payload);
        alert(t('admin.faq.categoryUpdatedSuccess'));
      } else {
        await apiClient.post('/api/v1/admin/faq/categories', payload);
        alert(t('admin.faq.categoryCreatedSuccess'));
      }
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqCategories);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.faqItems);
      await fetchCategories();
      notifyChanged();
      setShowModal(false);
      setEditing(null);
      setFormData(createEmptyCategoryFormData());
    } catch {
      alert(t('admin.faq.errorSaving'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">{t('admin.faq.loadingCategories')}</p>;
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{t('admin.faq.categoriesTitle')}</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormData(createEmptyCategoryFormData());
            setActiveLocale('en');
            setShowModal(true);
          }}
        >
          {t('admin.faq.addCategory')}
        </Button>
      </div>

      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('admin.faq.searchCategories')}
        className="mb-4 max-w-md"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">{t('admin.faq.noCategories')}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((category) => (
            <div
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div>
                <p className="font-medium text-gray-900">{category.title}</p>
                <p className="text-xs text-gray-400">
                  {category.slug} · #{category.position}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    category.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category.published ? t('admin.faq.published') : t('admin.faq.draft')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(category);
                    setFormData(categoryFormDataFromRow(category));
                    setActiveLocale('en');
                    setShowModal(true);
                  }}
                >
                  {t('admin.faq.edit')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDelete(category)}>
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
              {editing ? t('admin.faq.editCategory') : t('admin.faq.addCategory')}
            </h3>
            <form className="mt-4 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
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
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('admin.faq.categoryTitle')}
                    {activeLocale === 'en' ? ' *' : ''}
                  </label>
                  <Input
                    value={formData.translations[activeIndex].title}
                    onChange={(e) =>
                      setFormData((current) => ({
                        ...current,
                        translations: current.translations.map((tr, index) =>
                          index === activeIndex ? { ...tr, title: e.target.value } : tr,
                        ),
                      }))
                    }
                  />
                </div>
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
