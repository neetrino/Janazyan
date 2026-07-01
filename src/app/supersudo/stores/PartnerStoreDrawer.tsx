'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Input } from '@shop/ui';
import { PARTNER_STORE_LOCALES } from '../../../features/stores/partner-store-locales';
import { LANGUAGES } from '../../../lib/language';
import { useTranslation } from '../../../lib/i18n-client';
import {
  AdminFormSectionLabel,
  AdminSideDrawer,
} from '../components/AdminSideDrawer';
import type { AdminPartnerStore, PartnerStoreFormData } from './types';

interface PartnerStoreDrawerProps {
  open: boolean;
  editingStore: AdminPartnerStore | null;
  formData: PartnerStoreFormData;
  submitting: boolean;
  imageUploading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onFormChange: (data: PartnerStoreFormData) => void;
  onLogoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
}

export function PartnerStoreDrawer({
  open,
  editingStore,
  formData,
  submitting,
  imageUploading,
  onClose,
  onSubmit,
  onFormChange,
  onLogoUpload,
  onRemoveLogo,
}: PartnerStoreDrawerProps) {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState<(typeof PARTNER_STORE_LOCALES)[number]>('en');

  useEffect(() => {
    if (open) {
      setActiveLocale('en');
    }
  }, [open, editingStore?.id]);

  const activeTranslationIndex = formData.translations.findIndex(
    (translation) => translation.locale === activeLocale,
  );

  const updateActiveTranslation = (field: 'name' | 'address', value: string) => {
    if (activeTranslationIndex < 0) {
      return;
    }
    onFormChange({
      ...formData,
      translations: formData.translations.map((translation, index) =>
        index === activeTranslationIndex ? { ...translation, [field]: value } : translation,
      ),
    });
  };

  return (
    <AdminSideDrawer
      open={open}
      onClose={onClose}
      side="right"
      size="panel"
      title={
        editingStore
          ? t('admin.partnerStores.editStore')
          : t('admin.partnerStores.addNewStore')
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('admin.partnerStores.cancel')}
          </Button>
          <Button
            type="submit"
            form="partner-store-form"
            variant="primary"
            disabled={submitting || imageUploading}
          >
            {submitting ? t('admin.partnerStores.saving') : t('admin.partnerStores.save')}
          </Button>
        </div>
      }
    >
      <form id="partner-store-form" className="space-y-6" onSubmit={onSubmit}>
        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.faq.translationsSection')}</AdminFormSectionLabel>

          <div className="flex flex-wrap gap-2">
            {PARTNER_STORE_LOCALES.map((locale) => (
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
                  {t('admin.partnerStores.name')}
                  {activeLocale === 'en' ? ' *' : ''}
                </label>
                <Input
                  value={formData.translations[activeTranslationIndex].name}
                  onChange={(e) => updateActiveTranslation('name', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('admin.partnerStores.address')}
                  {activeLocale === 'en' ? ' *' : ''}
                </label>
                <Input
                  value={formData.translations[activeTranslationIndex].address}
                  onChange={(e) => updateActiveTranslation('address', e.target.value)}
                />
              </div>
            </>
          ) : null}
        </section>

        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.faq.commonSection')}</AdminFormSectionLabel>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('admin.partnerStores.status')}
            </label>
            <select
              value={formData.published}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  published: e.target.value as PartnerStoreFormData['published'],
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="published">{t('admin.partnerStores.published')}</option>
              <option value="draft">{t('admin.partnerStores.draft')}</option>
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.partnerStores.logo')}</AdminFormSectionLabel>

          {formData.logoUrl ? (
            <div className="relative inline-block">
              <img
                src={formData.logoUrl}
                alt=""
                className="h-12 w-28 object-contain"
              />
              <button
                type="button"
                className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-xs text-white"
                onClick={onRemoveLogo}
              >
                ×
              </button>
            </div>
          ) : null}

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm">
            {imageUploading
              ? t('admin.partnerStores.uploadingLogo')
              : t('admin.partnerStores.uploadLogo')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={imageUploading}
              onChange={onLogoUpload}
            />
          </label>
        </section>
      </form>
    </AdminSideDrawer>
  );
}
