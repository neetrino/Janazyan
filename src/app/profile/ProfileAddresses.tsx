import type { FormEvent } from 'react';
import { Button, Input, Card } from '@shop/ui';
import type { Address, UserProfile } from './types';
import {
  PROFILE_BODY_TEXT_CLASS,
  PROFILE_BORDER_DIVIDER_CLASS,
  PROFILE_CARD_CLASS,
  PROFILE_DESKTOP_FORM_ACTIONS_CLASS,
  PROFILE_FORM_SURFACE_CLASS,
  PROFILE_MOBILE_COMPACT_SURFACE_CLASS,
  PROFILE_MOBILE_FORM_ACTIONS_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
  PROFILE_SURFACE_RADIUS_CLASS,
} from './profile-layout.constants';

interface ProfileAddressesProps {
  profile: UserProfile | null;
  showAddressForm: boolean;
  setShowAddressForm: (show: boolean) => void;
  editingAddress: Address | null;
  addressForm: Address;
  setAddressForm: (address: Address) => void;
  savingAddress: boolean;
  onSave: (e: FormEvent) => void;
  onDelete: (addressId: string) => void;
  onEdit: (address: Address) => void;
  onResetForm: () => void;
  t: (key: string) => string;
  compact?: boolean;
}

function formatSavedAddress(address: Address): string {
  return address.addressLine1?.trim() || '';
}

export function ProfileAddresses({
  profile,
  showAddressForm,
  setShowAddressForm,
  editingAddress,
  addressForm,
  setAddressForm,
  savingAddress,
  onSave,
  onDelete,
  onEdit,
  onResetForm,
  t,
  compact = false,
}: ProfileAddressesProps) {
  const formActionsClass = compact ? PROFILE_MOBILE_FORM_ACTIONS_CLASS : PROFILE_DESKTOP_FORM_ACTIONS_CLASS;
  const savedAddresses = profile?.addresses ?? [];
  const hasSavedAddress = savedAddresses.length > 0;
  const canAddAddress = !hasSavedAddress;

  const openAddForm = () => {
    onResetForm();
    setShowAddressForm(true);
  };

  const closeForm = () => {
    setShowAddressForm(false);
    onResetForm();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className={compact ? PROFILE_MOBILE_COMPACT_SURFACE_CLASS : PROFILE_CARD_CLASS}>
        {!compact && (
          <div className={`mb-6 flex flex-col gap-4 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6 ${PROFILE_BORDER_DIVIDER_CLASS}`}>
            <h2 className={PROFILE_SECTION_TITLE_CLASS}>{t('profile.addresses.title')}</h2>
            {canAddAddress && (
              <Button
                variant="primary"
                className={`h-11 w-full shrink-0 sm:w-auto ${PROFILE_PRIMARY_BUTTON_CLASS}`}
                onClick={() => (showAddressForm ? closeForm() : openAddForm())}
              >
                {showAddressForm ? t('profile.addresses.form.cancel') : `+ ${t('profile.addresses.addNew')}`}
              </Button>
            )}
          </div>
        )}
        {compact && canAddAddress && (
          <div className="mb-4">
            <Button
              variant="primary"
              className={`h-11 w-full ${PROFILE_PRIMARY_BUTTON_CLASS}`}
              onClick={() => (showAddressForm ? closeForm() : openAddForm())}
            >
              {showAddressForm ? t('profile.addresses.form.cancel') : `+ ${t('profile.addresses.addNew')}`}
            </Button>
          </div>
        )}

        {showAddressForm && (
          <form onSubmit={onSave} className={PROFILE_FORM_SURFACE_CLASS}>
            <h3 className="text-base font-semibold text-ink-800">
              {editingAddress ? t('profile.addresses.form.editTitle') : t('profile.addresses.form.addTitle')}
            </h3>
            <Input
              label={t('profile.addresses.form.address')}
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              required
            />
            <div className={formActionsClass}>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl border-sky-mist text-ink-700 hover:border-sky-soft hover:bg-sky-mist/20 sm:w-auto"
                onClick={closeForm}
              >
                {t('profile.addresses.form.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                className={`h-11 w-full sm:w-auto ${PROFILE_PRIMARY_BUTTON_CLASS}`}
                disabled={savingAddress}
              >
                {savingAddress ? t('profile.addresses.form.saving') : editingAddress ? t('profile.addresses.form.update') : t('profile.addresses.form.add')}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4 sm:space-y-5">
          {hasSavedAddress ? (
            savedAddresses.map((address, index) => (
              <div
                key={address.id || address._id || index}
                className={`${PROFILE_SURFACE_RADIUS_CLASS} border border-sky-mist/60 bg-white p-5 sm:p-6 lg:p-7`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-800 sm:text-base">{formatSavedAddress(address)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-sky-mist/40 pt-4 lg:border-0 lg:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9 flex-1 rounded-xl border-sky-mist sm:flex-initial"
                      onClick={() => onEdit(address)}
                    >
                      {t('profile.addresses.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9 flex-1 rounded-xl text-sale hover:border-sale/40 hover:bg-sale/5 hover:text-sale sm:flex-initial"
                      onClick={() => onDelete((address.id || address._id)!)}
                    >
                      {t('profile.addresses.delete')}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !showAddressForm && (
              <p className={`py-12 text-center sm:py-16 ${PROFILE_BODY_TEXT_CLASS}`}>{t('profile.addresses.noAddresses')}</p>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
