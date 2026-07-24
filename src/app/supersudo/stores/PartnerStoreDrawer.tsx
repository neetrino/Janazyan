'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button, Input } from '@shop/ui';
import { apiClient } from '../../../lib/api-client';
import { PARTNER_STORE_LOCALES } from '../../../features/stores/partner-store-locales';
import { LANGUAGES } from '../../../lib/language';
import { useTranslation } from '../../../lib/i18n-client';
import {
  AdminFormSectionLabel,
  AdminSideDrawer,
} from '../components/AdminSideDrawer';
import { matchPartnerStoreHierarchy } from './match-location-hierarchy';
import { PartnerStoreLocationPickerModal } from './PartnerStoreLocationPickerModal';
import type {
  AdminPartnerStore,
  AdminPartnerStoreArea,
  AdminPartnerStoreRegion,
  PartnerStoreFormData,
} from './types';

type ReverseGeocodeResponse = {
  data: {
    regionCandidates: string[];
    regionFallbackCandidates: string[];
    areaCandidates: string[];
    displayName: string | null;
    addresses: {
      en: string | null;
      hy: string | null;
      ru: string | null;
    };
  };
};

interface PartnerStoreDrawerProps {
  open: boolean;
  editingStore: AdminPartnerStore | null;
  formData: PartnerStoreFormData;
  regions: AdminPartnerStoreRegion[];
  areas: AdminPartnerStoreArea[];
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
  regions,
  areas,
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
  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveLocale('en');
      setMapPickerOpen(false);
    }
  }, [open, editingStore?.id]);

  const activeTranslationIndex = formData.translations.findIndex(
    (translation) => translation.locale === activeLocale,
  );

  const areasForRegion = areas.filter((area) => area.regionId === formData.regionId);

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

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMapPickerOpen(true)}
                >
                  {t('admin.partnerStores.pickOnMap')}
                </Button>
                {formData.lat !== null && formData.lng !== null ? (
                  <p className="text-xs text-gray-500">
                    {t('admin.partnerStores.latitude')}: {formData.lat.toFixed(6)},{' '}
                    {t('admin.partnerStores.longitude')}: {formData.lng.toFixed(6)}
                    {formData.coordinatesSource === 'map'
                      ? ` · ${t('admin.partnerStores.locationFromMap')}`
                      : ''}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    {t('admin.partnerStores.locationAutoHint')}
                  </p>
                )}
              </div>
            </>
          ) : null}
        </section>

        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.faq.commonSection')}</AdminFormSectionLabel>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('admin.partnerStores.region')} *
            </label>
            <select
              value={formData.regionId}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  regionId: e.target.value,
                  areaId: '',
                })
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              required
            >
              <option value="">{t('admin.partnerStores.selectRegion')}</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('admin.partnerStores.areaOptional')}
            </label>
            <select
              value={formData.areaId}
              onChange={(e) => onFormChange({ ...formData, areaId: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              disabled={!formData.regionId}
            >
              <option value="">{t('admin.partnerStores.noAreaTwoLevel')}</option>
              {areasForRegion.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">{t('admin.partnerStores.areaHint')}</p>
          </div>

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

      <PartnerStoreLocationPickerModal
        isOpen={mapPickerOpen}
        initialLat={formData.lat}
        initialLng={formData.lng}
        onClose={() => setMapPickerOpen(false)}
        onConfirm={async (coordinates) => {
          let nextRegionId = formData.regionId;
          let nextAreaId = formData.areaId;
          let nextTranslations = formData.translations;

          try {
            const response = await apiClient.post<ReverseGeocodeResponse>(
              '/api/v1/admin/partner-stores/reverse-geocode',
              { lat: coordinates.lat, lng: coordinates.lng },
            );
            const matched = matchPartnerStoreHierarchy({
              regionCandidates: response.data.regionCandidates,
              regionFallbackCandidates: response.data.regionFallbackCandidates,
              areaCandidates: response.data.areaCandidates,
              regions,
              areas,
            });
            if (matched.regionId) {
              nextRegionId = matched.regionId;
              nextAreaId = matched.areaId ?? '';
            }

            const resolvedAddresses = response.data.addresses;
            if (resolvedAddresses.en || resolvedAddresses.hy || resolvedAddresses.ru) {
              nextTranslations = formData.translations.map((translation) => {
                const fromMap =
                  resolvedAddresses[translation.locale] ?? resolvedAddresses.en ?? null;
                if (!fromMap) {
                  return translation;
                }
                return { ...translation, address: fromMap };
              });
            }
          } catch (error) {
            console.error('Failed to resolve place from map pin:', error);
          }

          onFormChange({
            ...formData,
            lat: coordinates.lat,
            lng: coordinates.lng,
            coordinatesSource: 'map',
            regionId: nextRegionId,
            areaId: nextAreaId,
            translations: nextTranslations,
          });
          setMapPickerOpen(false);
        }}
      />
    </AdminSideDrawer>
  );
}
