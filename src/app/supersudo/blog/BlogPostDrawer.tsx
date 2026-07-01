'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Input } from '@shop/ui';
import { BLOG_LOCALES } from '../../../features/blog/blog-locales';
import { LANGUAGES } from '../../../lib/language';
import { useTranslation } from '../../../lib/i18n-client';
import {
  AdminFormSectionLabel,
  AdminSideDrawer,
} from '../components/AdminSideDrawer';
import type { AdminBlogPost, BlogPostFormData } from './types';

interface BlogPostDrawerProps {
  open: boolean;
  editingPost: AdminBlogPost | null;
  formData: BlogPostFormData;
  submitting: boolean;
  imageUploading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onFormChange: (data: BlogPostFormData) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function BlogPostDrawer({
  open,
  editingPost,
  formData,
  submitting,
  imageUploading,
  onClose,
  onSubmit,
  onFormChange,
  onImageUpload,
  onRemoveImage,
}: BlogPostDrawerProps) {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState<(typeof BLOG_LOCALES)[number]>('en');

  useEffect(() => {
    if (open) {
      setActiveLocale('en');
    }
  }, [open, editingPost?.id]);

  const activeTranslationIndex = formData.translations.findIndex(
    (tr) => tr.locale === activeLocale,
  );

  const updateActiveTranslation = (
    field: 'title' | 'contentHtml' | 'excerpt',
    value: string,
  ) => {
    if (activeTranslationIndex < 0) {
      return;
    }
    onFormChange({
      ...formData,
      translations: formData.translations.map((tr, index) =>
        index === activeTranslationIndex ? { ...tr, [field]: value } : tr,
      ),
    });
  };

  return (
    <AdminSideDrawer
      open={open}
      onClose={onClose}
      side="right"
      size="xl"
      title={editingPost ? t('admin.blog.editPost') : t('admin.blog.addNewPost')}
      footer={
        <Button
          type="submit"
          form="blog-post-form"
          variant="primary"
          disabled={submitting || imageUploading}
          className="w-full rounded-full"
        >
          {submitting ? t('admin.blog.saving') : t('admin.blog.save')}
        </Button>
      }
    >
      <form id="blog-post-form" className="space-y-6" onSubmit={onSubmit}>
        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.blog.translationsSection')}</AdminFormSectionLabel>

          <div className="flex flex-wrap gap-2">
            {BLOG_LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  activeLocale === locale
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveLocale(locale)}
              >
                {LANGUAGES[locale].nativeName}
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
        </section>

        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.blog.commonSection')}</AdminFormSectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.blog.publishedAt')}
              </label>
              <Input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => onFormChange({ ...formData, publishedAt: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.blog.status')}
              </label>
              <select
                value={formData.published}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    published: e.target.value as BlogPostFormData['published'],
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="published">{t('admin.blog.published')}</option>
                <option value="draft">{t('admin.blog.draft')}</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.blog.images')}</AdminFormSectionLabel>

          {formData.images.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative">
                  <img src={url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                  <button
                    type="button"
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-xs text-white"
                    onClick={() => onRemoveImage(index)}
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
              onChange={onImageUpload}
            />
          </label>
          <p className="text-xs text-gray-500">{t('admin.blog.imagesHint')}</p>
        </section>
      </form>
    </AdminSideDrawer>
  );
}
