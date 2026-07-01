'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Button } from '@shop/ui';
import { apiClient } from '@/lib/api-client';
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
  invalidateAdminListCache,
} from '@/lib/admin/admin-list-client-cache';
import { DEFAULT_DELIVERY_SETTINGS } from '@/lib/delivery/delivery-settings.defaults';
import type { DeliverySettings } from '@/lib/delivery/delivery-settings.types';
import { useTranslation } from '@/lib/i18n-client';
import { logger } from '@/lib/utils/logger';
import { useAdminDialogs } from '../../context/AdminDialogsContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { DeliveryLocationDrawer } from './DeliveryLocationDrawer';
import {
  createEmptyDeliveryLocationForm,
  deleteDeliveryLocation,
  flattenDeliveryLocations,
  formDataFromLocation,
  formatDeliveryPricingSummary,
  upsertDeliveryLocation,
  type DeliveryLocationFormData,
  type DeliveryLocationKey,
  type DeliveryLocationRow,
} from '../delivery-location.utils';

export function DeliveryLocationsSection() {
  const { t } = useTranslation();
  const { confirm: confirmDialog } = useAdminDialogs();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingLocation, setEditingLocation] = useState<DeliveryLocationKey | null>(null);
  const [formData, setFormData] = useState<DeliveryLocationFormData>(createEmptyDeliveryLocationForm());

  useBodyScrollLock(showDrawer);

  const locations = useMemo(() => flattenDeliveryLocations(settings), [settings]);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.delivery,
        () => apiClient.get<DeliverySettings>('/api/v1/admin/delivery'),
      );
      setSettings(data.version === 2 ? data : DEFAULT_DELIVERY_SETTINGS);
    } catch (err: unknown) {
      logger.error('Failed to load delivery settings', { err });
      setSettings(DEFAULT_DELIVERY_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const persistSettings = async (nextSettings: DeliverySettings) => {
    setSaving(true);
    try {
      await apiClient.put('/api/v1/admin/delivery', nextSettings);
      invalidateAdminListCache(ADMIN_LIST_CACHE_KEYS.delivery);
      setSettings(nextSettings);
      await fetchSettings();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      alert(t('admin.delivery.errorSaving').replace('{message}', error.response?.data?.detail || error.message || ''));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setFormData(createEmptyDeliveryLocationForm());
    setShowDrawer(true);
  };

  const handleOpenEdit = (row: DeliveryLocationRow) => {
    setEditingLocation({ countryId: row.countryId, zoneId: row.zoneId });
    setFormData(formDataFromLocation(row));
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingLocation(null);
    setFormData(createEmptyDeliveryLocationForm());
  };

  const handleSubmit = async () => {
    if (!formData.countryName.trim() || !formData.cityName.trim()) {
      alert(t('admin.delivery.validationRequired'));
      return;
    }

    try {
      const nextSettings = upsertDeliveryLocation(settings, formData, editingLocation ?? undefined);
      await persistSettings(nextSettings);
      alert(t('admin.delivery.savedSuccess'));
      handleCloseDrawer();
    } catch {
      // Error already surfaced in persistSettings.
    }
  };

  const handleDelete = async () => {
    if (!editingLocation) {
      return;
    }

    const isConfirmed = await confirmDialog({
      title: t('admin.common.delete'),
      message: t('admin.delivery.deleteLocation'),
      confirmText: t('admin.common.delete'),
      destructive: true,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      const nextSettings = deleteDeliveryLocation(settings, editingLocation);
      await persistSettings(nextSettings);
      alert(t('admin.delivery.savedSuccess'));
      handleCloseDrawer();
    } catch {
      // Error already surfaced in persistSettings.
    }
  };

  const pricingSummaryLabels = {
    fixed: t('admin.delivery.pricingSummaryFixed'),
    tiered: t('admin.delivery.pricingSummaryTiered'),
  };

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('admin.delivery.deliveryPricesByLocation')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{t('admin.delivery.listSubtitle')}</p>
          </div>
          <Button variant="primary" onClick={handleOpenAdd} disabled={loading || saving}>
            {t('admin.delivery.addCountry')}
          </Button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">{t('admin.common.loading')}</p>
        ) : locations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="text-sm text-gray-500">{t('admin.delivery.noLocations')}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('admin.delivery.country')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('admin.delivery.city')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('admin.delivery.pricing.ruleType')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('admin.delivery.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {locations.map((row) => (
                  <tr
                    key={`${row.countryId}-${row.zoneId}`}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleOpenEdit(row)}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.countryName}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.cityName}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDeliveryPricingSummary(row.pricing, pricingSummaryLabels)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenEdit(row);
                        }}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        {t('admin.delivery.editLocation')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <DeliveryLocationDrawer
        open={showDrawer}
        isEditing={Boolean(editingLocation)}
        formData={formData}
        submitting={saving}
        onClose={handleCloseDrawer}
        onSubmit={() => void handleSubmit()}
        onChange={setFormData}
        onDelete={() => void handleDelete()}
      />
    </>
  );
}
