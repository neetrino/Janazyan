'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@shop/ui';
import { AdminSideDrawer } from '../components/AdminSideDrawer';
import type { PromoFormFields } from './coupons-admin-types';
import { PromoUserPicker } from './PromoUserPicker';

export type PromoCodesAdminDrawerProps = {
  open: boolean;
  editingId: string | null;
  form: PromoFormFields;
  setForm: Dispatch<SetStateAction<PromoFormFields>>;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
  titleCreate: string;
  titleEdit: string;
  labels: Record<string, string>;
};

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-600">
      {children}
    </label>
  );
}

export function PromoCodesAdminDrawer({
  open,
  editingId,
  form,
  setForm,
  saving,
  onSave,
  onClose,
  titleCreate,
  titleEdit,
  labels,
}: PromoCodesAdminDrawerProps) {
  const title = editingId ? titleEdit : titleCreate;
  const submitLabel = editingId ? labels.save : labels.create;

  return (
    <AdminSideDrawer
      open={open}
      onClose={onClose}
      side="right"
      size="panel"
      title={title}
      footer={
        <div className="flex items-center gap-3">
          <Button type="button" variant="primary" onClick={onSave} disabled={saving}>
            {saving ? labels.saving : submitLabel}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            {labels.cancel}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="pc-name">{labels.formName}</FieldLabel>
            <input
              id="pc-name"
              className={INPUT_CLASS}
              placeholder={labels.formName}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pc-code">{labels.formCode}</FieldLabel>
            <input
              id="pc-code"
              className={INPUT_CLASS}
              placeholder={labels.formCode}
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="pc-type">{labels.formDiscountType}</FieldLabel>
            <select
              id="pc-type"
              className={INPUT_CLASS}
              value={form.discountType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  discountType: e.target.value === 'fixed' ? 'fixed' : 'percent',
                }))
              }
            >
              <option value="percent">{labels.typePercent}</option>
              <option value="fixed">{labels.typeFixed}</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="pc-val">{labels.formDiscountValue}</FieldLabel>
            <input
              id="pc-val"
              type="number"
              min="0"
              step="0.01"
              className={INPUT_CLASS}
              value={form.discountValue}
              onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="pc-limit">{labels.formQuantity}</FieldLabel>
            <input
              id="pc-limit"
              type="number"
              min="1"
              step="1"
              className={INPUT_CLASS}
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel htmlFor="pc-until">{labels.formExpires}</FieldLabel>
            <input
              id="pc-until"
              type="datetime-local"
              className={INPUT_CLASS}
              value={form.validUntil}
              onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
            />
          </div>
        </div>

        <PromoUserPicker
          open={open}
          selectedIds={form.allowedUserIds}
          onChange={(allowedUserIds) => setForm((f) => ({ ...f, allowedUserIds }))}
          disabled={saving}
          labels={{
            title: labels.formSelectUsers,
            allUsers: labels.formAllUsers,
            selectedCount: labels.formSelectedCount,
            search: labels.formSearchUsers,
            roleAll: labels.roleAll,
            roleAdmin: labels.roleAdmin,
            roleCustomer: labels.roleCustomer,
            loading: labels.usersLoading,
            empty: labels.usersEmpty,
            loadError: labels.usersLoadError,
          }}
        />
      </div>
    </AdminSideDrawer>
  );
}
