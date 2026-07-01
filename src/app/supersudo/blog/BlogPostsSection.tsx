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
import { BlogPostDrawer } from './BlogPostDrawer';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminBlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostFormData>(createEmptyFormData);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useBodyScrollLock(drawerOpen);

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

  const openDrawer = (post: AdminBlogPost | null) => {
    setEditingPost(post);
    setFormData(post ? formDataFromPost(post) : createEmptyFormData());
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
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
      closeDrawer();
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
        <Button variant="primary" size="sm" onClick={() => openDrawer(null)}>
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
                <Button variant="outline" size="sm" onClick={() => openDrawer(post)}>
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

      <BlogPostDrawer
        open={drawerOpen}
        editingPost={editingPost}
        formData={formData}
        submitting={submitting}
        imageUploading={imageUploading}
        onClose={closeDrawer}
        onSubmit={(e) => void handleSubmit(e)}
        onFormChange={setFormData}
        onImageUpload={(e) => void handleImageUpload(e)}
        onRemoveImage={removeImage}
      />
    </>
  );
}
