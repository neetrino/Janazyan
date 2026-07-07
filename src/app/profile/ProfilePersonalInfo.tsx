import type { FormEvent } from 'react';
import { Button, Input, Card } from '@shop/ui';
import type { UserProfile } from './types';
import {
  PROFILE_BORDER_DIVIDER_CLASS,
  PROFILE_CARD_CLASS,
  PROFILE_DESKTOP_FORM_ACTIONS_CLASS,
  PROFILE_MOBILE_COMPACT_SURFACE_CLASS,
  PROFILE_MOBILE_FORM_ACTIONS_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from './profile-layout.constants';

interface ProfilePersonalInfoProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  setPersonalInfo: (info: ProfilePersonalInfoProps['personalInfo']) => void;
  savingPersonal: boolean;
  onSave: (e: FormEvent) => void;
  profile: UserProfile | null;
  t: (key: string) => string;
  compact?: boolean;
}

export function ProfilePersonalInfo({
  personalInfo,
  setPersonalInfo,
  savingPersonal,
  onSave,
  profile,
  t,
  compact = false,
}: ProfilePersonalInfoProps) {
  const formActionsClass = compact ? PROFILE_MOBILE_FORM_ACTIONS_CLASS : PROFILE_DESKTOP_FORM_ACTIONS_CLASS;

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
          <h2 className={PROFILE_SECTION_TITLE_CLASS}>{t('profile.personal.title')}</h2>
        </div>
      )}
      <form
        onSubmit={onSave}
        className={`mx-auto max-w-xl lg:mx-0 lg:max-w-2xl ${compact ? 'space-y-4' : 'space-y-6'}`}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          <Input
            label={t('profile.personal.firstName')}
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            placeholder={t('profile.personal.firstNamePlaceholder')}
          />
          <Input
            label={t('profile.personal.lastName')}
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            placeholder={t('profile.personal.lastNamePlaceholder')}
          />
        </div>
        <Input
          label={t('profile.personal.email')}
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
          placeholder={t('profile.personal.emailPlaceholder')}
        />
        <Input
          label={t('profile.personal.phone')}
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
          placeholder={t('profile.personal.phonePlaceholder')}
        />
        <div className={formActionsClass}>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-sky-mist text-ink-700 hover:border-sky-soft hover:bg-sky-mist/20 sm:w-auto"
            onClick={() => {
              setPersonalInfo({
                firstName: profile?.firstName || '',
                lastName: profile?.lastName || '',
                email: profile?.email || '',
                phone: profile?.phone || '',
              });
            }}
          >
            {t('profile.personal.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            className={`h-11 w-full sm:w-auto ${PROFILE_PRIMARY_BUTTON_CLASS}`}
            disabled={savingPersonal}
          >
            {savingPersonal ? t('profile.personal.saving') : t('profile.personal.save')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
