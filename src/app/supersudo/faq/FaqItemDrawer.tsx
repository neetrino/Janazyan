'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button, Input } from '@shop/ui';
import { FAQ_LOCALES } from '../../../features/faq/faq-locales';
import { LANGUAGES } from '../../../lib/language';
import { useTranslation } from '../../../lib/i18n-client';
import {
  AdminFormSectionLabel,
  AdminSideDrawer,
} from '../components/AdminSideDrawer';
import type { AdminFaqItem, FaqItemFormData } from './types';

interface FaqItemDrawerProps {
  open: boolean;
  editing: AdminFaqItem | null;
  formData: FaqItemFormData;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onFormChange: (data: FaqItemFormData) => void;
}

export function FaqItemDrawer({
  open,
  editing,
  formData,
  submitting,
  onClose,
  onSubmit,
  onFormChange,
}: FaqItemDrawerProps) {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState<(typeof FAQ_LOCALES)[number]>('en');

  useEffect(() => {
    if (open) {
      setActiveLocale('en');
    }
  }, [open, editing?.id]);

  const activeIndex = formData.translations.findIndex((tr) => tr.locale === activeLocale);

  const updateTranslation = (field: 'question' | 'answer', value: string) => {
    if (activeIndex < 0) {
      return;
    }
    onFormChange({
      ...formData,
      translations: formData.translations.map((tr, index) =>
        index === activeIndex ? { ...tr, [field]: value } : tr,
      ),
    });
  };

  return (
    <AdminSideDrawer
      open={open}
      onClose={onClose}
      side="right"
      size="xl"
      title={editing ? t('admin.faq.editItem') : t('admin.faq.createNew')}
      subtitle={t('admin.faq.itemDrawerSubtitle')}
      footer={
        <Button
          type="submit"
          form="faq-item-form"
          variant="primary"
          disabled={submitting}
          className="w-full rounded-full"
        >
          {submitting ? t('admin.faq.saving') : t('admin.faq.saveQuestion')}
        </Button>
      }
    >
      <form id="faq-item-form" className="space-y-6" onSubmit={onSubmit}>
        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.faq.commonSection')}</AdminFormSectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.faq.position')}
              </label>
              <Input
                type="number"
                value={formData.position}
                onChange={(e) => onFormChange({ ...formData, position: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.faq.status')}
              </label>
              <select
                value={formData.published}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    published: e.target.value as FaqItemFormData['published'],
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="published">{t('admin.faq.published')}</option>
                <option value="draft">{t('admin.faq.draft')}</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.faq.translationsSection')}</AdminFormSectionLabel>

          <div className="flex flex-wrap gap-2">
            {FAQ_LOCALES.map((locale) => (
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

          {activeIndex >= 0 ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('admin.faq.question')}
                  {activeLocale === 'en' ? ' *' : ''}
                </label>
                <Input
                  value={formData.translations[activeIndex].question}
                  onChange={(e) => updateTranslation('question', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('admin.faq.answer')}
                  {activeLocale === 'en' ? ' *' : ''}
                </label>
                <textarea
                  value={formData.translations[activeIndex].answer}
                  onChange={(e) => updateTranslation('answer', e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          ) : null}
        </section>
      </form>
    </AdminSideDrawer>
  );
}
