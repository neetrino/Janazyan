import type { FormEvent } from 'react';
import { Button, Input, Card } from '@shop/ui';
import {
  PROFILE_BORDER_DIVIDER_CLASS,
  PROFILE_CARD_CLASS,
  PROFILE_MOBILE_COMPACT_SURFACE_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from './profile-layout.constants';

interface ProfilePasswordProps {
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: (form: ProfilePasswordProps['passwordForm']) => void;
  savingPassword: boolean;
  onSave: (e: FormEvent) => void;
  t: (key: string) => string;
  compact?: boolean;
}

export function ProfilePassword({
  passwordForm,
  setPasswordForm,
  savingPassword,
  onSave,
  t,
  compact = false,
}: ProfilePasswordProps) {
  return (
    <Card
      className={
        compact
          ? PROFILE_MOBILE_COMPACT_SURFACE_CLASS
          : PROFILE_CARD_CLASS
      }
    >
      {!compact && (
        <div className={`mb-8 pb-5 sm:mb-10 sm:pb-6 ${PROFILE_BORDER_DIVIDER_CLASS}`}>
          <h2 className={PROFILE_SECTION_TITLE_CLASS}>{t('profile.password.title')}</h2>
        </div>
      )}
      <form
        onSubmit={onSave}
        className={`mx-auto max-w-xl lg:mx-0 lg:max-w-2xl ${compact ? 'space-y-4' : 'space-y-6'}`}
      >
        <Input
          label={t('profile.password.currentPassword')}
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          placeholder={t('profile.password.currentPasswordPlaceholder')}
          required
        />
        <Input
          label={t('profile.password.newPassword')}
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          placeholder={t('profile.password.newPasswordPlaceholder')}
          required
        />
        <Input
          label={t('profile.password.confirmPassword')}
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          placeholder={t('profile.password.confirmPasswordPlaceholder')}
          required
        />
        <div className="pt-2 sm:pt-4">
          <Button
            type="submit"
            variant="primary"
            className={`h-11 w-full sm:w-auto ${PROFILE_PRIMARY_BUTTON_CLASS}`}
            disabled={savingPassword}
          >
            {savingPassword ? t('profile.password.changing') : t('profile.password.change')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
