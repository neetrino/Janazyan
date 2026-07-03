'use client';

import { AuthPageLayout } from '../login/components/AuthPageLayout';
import { RegisterFormSection } from './components/RegisterFormSection';
import { REGISTER_FORM_SHELL_CLASS } from './register-page.constants';
import { useTranslation } from '../../lib/i18n-client';

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <AuthPageLayout
      sectionAriaLabel="Register"
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      form={
        <div className={REGISTER_FORM_SHELL_CLASS}>
          <RegisterFormSection />
        </div>
      }
    />
  );
}
