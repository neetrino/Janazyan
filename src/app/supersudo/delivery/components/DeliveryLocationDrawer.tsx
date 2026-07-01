'use client';

import { type ReactNode } from 'react';
import { Button, Input } from '@shop/ui';
import { useTranslation } from '@/lib/i18n-client';
import {
  AdminFormSectionLabel,
  AdminSideDrawer,
} from '../../components/AdminSideDrawer';
import type { DeliveryLocationFormData } from '../delivery-location.utils';

type DeliveryLocationDrawerProps = {
  open: boolean;
  isEditing: boolean;
  formData: DeliveryLocationFormData;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: DeliveryLocationFormData) => void;
  onDelete?: () => void;
};

const INPUT_CLASS = 'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm';

function PricingRuleCard({
  checked,
  title,
  description,
  disabled,
  onSelect,
  children,
}: {
  checked: boolean;
  title: string;
  description: string;
  disabled: boolean;
  onSelect: () => void;
  children?: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border transition-colors ${
        checked ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
      }`}
    >
      <label className="flex cursor-pointer items-start gap-3 p-4">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onSelect}
          className="mt-1 h-4 w-4 rounded border-gray-300"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-900">{title}</span>
          <span className="mt-1 block text-sm text-gray-500">{description}</span>
        </span>
      </label>
      {checked && children ? <div className="border-t border-gray-200 px-4 pb-4 pt-3">{children}</div> : null}
    </div>
  );
}

export function DeliveryLocationDrawer({
  open,
  isEditing,
  formData,
  submitting,
  onClose,
  onSubmit,
  onChange,
  onDelete,
}: DeliveryLocationDrawerProps) {
  const { t } = useTranslation();

  const updateForm = (patch: Partial<DeliveryLocationFormData>) => {
    onChange({ ...formData, ...patch });
  };

  return (
    <AdminSideDrawer
      open={open}
      onClose={onClose}
      side="right"
      size="wide"
      title={
        isEditing
          ? t('admin.delivery.editLocation')
          : t('admin.delivery.addLocation')
      }
      subtitle={t('admin.delivery.drawerSubtitle')}
      footer={
        <div className="flex items-center justify-between gap-3">
          {isEditing && onDelete ? (
            <Button type="button" variant="ghost" onClick={onDelete} disabled={submitting}>
              {t('admin.common.delete')}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              {t('admin.delivery.cancel')}
            </Button>
            <Button type="button" variant="primary" onClick={onSubmit} disabled={submitting}>
              {submitting ? t('admin.delivery.saving') : t('admin.delivery.saveSettings')}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="space-y-4">
          <AdminFormSectionLabel>{t('admin.delivery.locationSection')}</AdminFormSectionLabel>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.delivery.country')}
              </label>
              <Input
                value={formData.countryName}
                onChange={(event) => updateForm({ countryName: event.target.value })}
                placeholder={t('admin.delivery.countryPlaceholder')}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('admin.delivery.city')}
              </label>
              <Input
                value={formData.cityName}
                onChange={(event) => updateForm({ cityName: event.target.value })}
                placeholder={t('admin.delivery.cityPlaceholder')}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <AdminFormSectionLabel>{t('admin.delivery.pricing.ruleType')}</AdminFormSectionLabel>
          <PricingRuleCard
            checked={formData.pricingType === 'tiered'}
            title={t('admin.delivery.pricing.tiered')}
            description={t('admin.delivery.pricing.tieredHint')}
            disabled={submitting}
            onSelect={() => updateForm({ pricingType: 'tiered' })}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t('admin.delivery.pricing.priceBelowThreshold')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  disabled={submitting}
                  value={formData.priceBelowThreshold}
                  onChange={(event) =>
                    updateForm({ priceBelowThreshold: Number(event.target.value) || 0 })
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t('admin.delivery.pricing.thresholdAmount')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  disabled={submitting}
                  value={formData.thresholdAmount}
                  onChange={(event) =>
                    updateForm({ thresholdAmount: Number(event.target.value) || 0 })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </PricingRuleCard>

          <PricingRuleCard
            checked={formData.pricingType === 'fixed'}
            title={t('admin.delivery.pricing.fixed')}
            description={t('admin.delivery.pricing.fixedHint')}
            disabled={submitting}
            onSelect={() => updateForm({ pricingType: 'fixed' })}
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                {t('admin.delivery.pricing.price')}
              </label>
              <input
                type="number"
                min="0"
                step="100"
                disabled={submitting}
                value={formData.fixedPrice}
                onChange={(event) => updateForm({ fixedPrice: Number(event.target.value) || 0 })}
                className={INPUT_CLASS}
              />
            </div>
          </PricingRuleCard>
        </section>
      </div>
    </AdminSideDrawer>
  );
}
