import { useState, useEffect, type FormEvent } from 'react';
import { apiClient } from '../../../lib/api-client';
import { patchStoredAuthUser } from '../../../lib/api-client/auth-utils';
import { useTranslation } from '../../../lib/i18n-client';
import type { UserProfile } from '../types';

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface UsePersonalInfoProps {
  profile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export function usePersonalInfo({
  profile,
  onProfileUpdate,
  onError,
  onSuccess,
}: UsePersonalInfoProps) {
  const { t } = useTranslation();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Initialize form from profile
  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSavePersonalInfo = async (e: FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    onError('');
    onSuccess('');

    try {
      const updated = await apiClient.put<UserProfile>('/api/v1/users/profile', personalInfo);
      onProfileUpdate(updated);
      onSuccess(t('profile.personal.updatedSuccess'));

      patchStoredAuthUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      onError(errorMessage || t('profile.personal.failedToUpdate'));
    } finally {
      setSavingPersonal(false);
    }
  };

  return {
    personalInfo,
    setPersonalInfo,
    savingPersonal,
    handleSavePersonalInfo,
  };
}

