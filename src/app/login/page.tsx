'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthPageLayout } from './components/AuthPageLayout';
import { LoginFormSection } from './components/LoginFormSection';
import {
  LOGIN_FORM_CARD_CLASS,
  LOGIN_FORM_SHELL_CLASS,
} from './login-page.constants';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';

function LoginPageContent() {
  const { t } = useTranslation();
  const { isLoading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/';

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push(isAdmin ? '/supersudo' : redirectTo);
    }
  }, [isLoggedIn, isLoading, isAdmin, redirectTo, router]);

  return (
    <AuthPageLayout
      sectionAriaLabel="Login"
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      form={
        <div className={LOGIN_FORM_SHELL_CLASS}>
          <LoginFormSection />
        </div>
      }
    />
  );
}

function LoginPageFallback() {
  const { t } = useTranslation();

  const loginFormSkeleton = (
    <div className={LOGIN_FORM_SHELL_CLASS}>
      <div className={LOGIN_FORM_CARD_CLASS}>
        <div className="w-full animate-pulse space-y-5">
          <div className="space-y-4">
            <div className="h-12 rounded-[42px] bg-[#f3f3f5]" />
            <div className="h-12 rounded-[42px] bg-[#f3f3f5]" />
          </div>
          <div className="h-12 rounded-[30px] bg-sky-deep/30" />
        </div>
      </div>
    </div>
  );

  return (
    <AuthPageLayout
      sectionAriaLabel="Login"
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      form={loginFormSkeleton}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
