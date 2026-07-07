import type { FormEvent } from 'react';
import { Button, Input, Card } from '@shop/ui';
import type { UserProfile } from './types';
import {
  PROFILE_BODY_TEXT_CLASS,
  PROFILE_DELETE_BUTTON_CLASS,
  PROFILE_DELETE_CARD_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from './profile-layout.constants';

interface ProfileDeleteAccountProps {
  profile: UserProfile | null;
  password: string;
  setPassword: (value: string) => void;
  confirmation: string;
  setConfirmation: (value: string) => void;
  acknowledged: boolean;
  setAcknowledged: (value: boolean) => void;
  deleting: boolean;
  onSubmit: (e: FormEvent) => void;
  t: (key: string) => string;
}

export function ProfileDeleteAccount({
  profile,
  password,
  setPassword,
  confirmation,
  setConfirmation,
  acknowledged,
  setAcknowledged,
  deleting,
  onSubmit,
  t,
}: ProfileDeleteAccountProps) {
  if (!profile) {
    return (
      <Card className={PROFILE_DELETE_CARD_CLASS}>
        <p className={PROFILE_BODY_TEXT_CLASS}>{t('profile.common.loadingProfile')}</p>
      </Card>
    );
  }

  const hasPassword = profile.hasPassword ?? true;

  return (
    <Card className={PROFILE_DELETE_CARD_CLASS}>
      <div className="mb-6 space-y-2 sm:mb-8">
        <h2 className={`${PROFILE_SECTION_TITLE_CLASS} text-sale`}>{t('profile.deleteAccount.title')}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-600">{t('profile.deleteAccount.description')}</p>
      </div>

      <ul className="mb-8 max-w-2xl list-disc space-y-2 pl-5 text-sm text-ink-500 sm:mb-10">
        <li>{t('profile.deleteAccount.pointOrders')}</li>
        <li>{t('profile.deleteAccount.pointLogin')}</li>
        <li>{t('profile.deleteAccount.pointData')}</li>
      </ul>

      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6 lg:mx-0 lg:max-w-2xl">
        {hasPassword ? (
          <Input
            label={t('profile.deleteAccount.currentPassword')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('profile.deleteAccount.currentPasswordPlaceholder')}
            autoComplete="current-password"
            required
          />
        ) : (
          <Input
            label={t('profile.deleteAccount.confirmationLabel')}
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={t('profile.deleteAccount.confirmationPlaceholder')}
            autoComplete="off"
            required
          />
        )}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-sky-mist text-sale focus:ring-sale/50"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          <span className="text-sm leading-snug text-ink-700">{t('profile.deleteAccount.acknowledge')}</span>
        </label>

        <div className="pt-1 sm:pt-2">
          <Button
            type="submit"
            variant="primary"
            className={PROFILE_DELETE_BUTTON_CLASS}
            disabled={deleting || !acknowledged}
          >
            {deleting ? t('profile.deleteAccount.deleting') : t('profile.deleteAccount.submit')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
