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
import { BLOG_LOCALES } from '../../../features/blog/blog-locales';
import { useAdminDialogs } from '../context/AdminDialogsContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
  invalidateAdminListCache,
} from '@/lib/admin/admin-list-client-cache';
import { createEmptyFormData, formDataFromPost, parseFormPayload } from './form-utils';
import type { AdminBlogPost, BlogPostFormData } from './types';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function BlogPostsSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostFormData>(createEmptyFormData);
  const [activeLocale, setActiveLocale] = useState(BLOG_LOCALES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useBodyScrollLock(showModal);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.blogPosts,
        () => apiClient.get<{ data: AdminBlogPost[] }>('/api/v1/admin/blog-posts'),
      );
      setPosts(response.data ?? []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return posts;
    }
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q),
    );
  }, [posts, searchQuery]);

  const activeTranslationIndex = formData.translations.findIndex(
    (tr) => tr.locale === activeLocale,
  );

  const updateActiveTranslation = (
    field: 'title' | 'contentHtml' | 'excerpt',
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      translations: current.translations.map((tr, index) =>
        index === activeTranslationIndex ? { ...tr, [field]: value } : tr,
      ),
    }));
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData(createEmptyFormData());
    setActiveLocale('en');
    setShowModal(true);
  };

  const handleOpenEdit = (post: AdminBlogPost) => {
    setEditingPost(post);
    setFormData(formDataFromPost(post));
    setActiveLocale('en');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData(createEmptyFormData());
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      return;
    }

    try {
      setImageUploading(true);
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        const { url } = await apiClient.post<{ url: string }>(
          '/api/v1/admin/blog-posts/upload-images',
          { image: base64 },
        );
        uploadedUrls.push(url);
      }
      setFormData((current) => ({ ...current, images: [...current.images, ...uploadedUrls] }));
    } catch (error) {
      let message = t('admin.blog.imageUploadFailed');
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

  const removeImage = (index: number) => {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (post: AdminBlogPost) => {
    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.blog.deleteConfirm').replace('{title}', post.title),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });
    if (!isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/admin/blog-posts/${post.id}`);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.blogPosts);
      await fetchPosts();
      alert(t('admin.blog.deletedSuccess'));
    } catch {
      alert(t('admin.blog.errorDeleting'));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const en = formData.translations.find((tr) => tr.locale === 'en');
    if (!en?.title.trim() || !en.contentHtml.trim()) {
      alert(t('admin.blog.enRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = parseFormPayload(formData);
      if (editingPost) {
        await apiClient.put(`/api/v1/admin/blog-posts/${editingPost.id}`, payload);
        alert(t('admin.blog.updatedSuccess'));
      } else {
        await apiClient.post('/api/v1/admin/blog-posts', payload);
        alert(t('admin.blog.createdSuccess'));
      }
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.blogPosts);
      await fetchPosts();
      handleCloseModal();
    } catch {
      alert(t('admin.blog.errorSaving'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-600">{t('admin.blog.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{t('admin.blog.title')}</h2>
        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          {t('admin.blog.addNew')}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.blog.searchPlaceholder')}
          className="max-w-md"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <p className="py-2 text-sm text-gray-500">{t('admin.blog.noPosts')}</p>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {post.images[0] ? (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="h-14 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                    —
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{post.title}</p>
                  {post.excerpt ? (
                    <p className="line-clamp-1 text-sm text-gray-600">{post.excerpt}</p>
                  ) : null}
                  <p className="text-xs text-gray-400">
                    /blog/{post.slug}
                    {post.publishedAt ? ` · ${post.publishedAt.slice(0, 10)}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {post.published ? t('admin.blog.published') : t('admin.blog.draft')}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(post)}>
                  {t('admin.blog.edit')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDelete(post)}>
                  {t('admin.blog.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingPost ? t('admin.blog.editPost') : t('admin.blog.addNewPost')}
            </h3>
            <form className="mt-4 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
              <div className="flex flex-wrap gap-2">
                {BLOG_LOCALES.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    className={`rounded-lg px-3 py-1 text-sm ${
                      activeLocale === locale
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setActiveLocale(locale)}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>

              {activeTranslationIndex >= 0 ? (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('admin.blog.postTitle')}
                      {activeLocale === 'en' ? ' *' : ''}
                    </label>
                    <Input
                      value={formData.translations[activeTranslationIndex].title}
                      onChange={(e) => updateActiveTranslation('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('admin.blog.excerpt')}
                    </label>
                    <Input
                      value={formData.translations[activeTranslationIndex].excerpt}
                      onChange={(e) => updateActiveTranslation('excerpt', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('admin.blog.content')}
                      {activeLocale === 'en' ? ' *' : ''}
                    </label>
                    <textarea
                      value={formData.translations[activeTranslationIndex].contentHtml}
                      onChange={(e) => updateActiveTranslation('contentHtml', e.target.value)}
                      rows={8}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">{t('admin.blog.contentHint')}</p>
                  </div>
                </>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('admin.blog.publishedAt')}
                  </label>
                  <Input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData((c) => ({ ...c, publishedAt: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('admin.blog.status')}
                  </label>
                  <select
                    value={formData.published}
                    onChange={(e) =>
                      setFormData((c) => ({
                        ...c,
                        published: e.target.value as BlogPostFormData['published'],
                      }))
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2"
                  >
                    <option value="published">{t('admin.blog.published')}</option>
                    <option value="draft">{t('admin.blog.draft')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('admin.blog.images')}
                </label>
                {formData.images.length > 0 ? (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {formData.images.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative">
                        <img
                          src={url}
                          alt=""
                          className="h-16 w-24 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-xs text-white"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                        {index === 0 ? (
                          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                            {t('admin.blog.cover')}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm">
                  {imageUploading ? t('admin.blog.uploadingImages') : t('admin.blog.uploadImages')}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={imageUploading}
                    onChange={(e) => void handleImageUpload(e)}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">{t('admin.blog.imagesHint')}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  {t('admin.blog.cancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={submitting || imageUploading}>
                  {submitting ? t('admin.blog.saving') : t('admin.blog.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
