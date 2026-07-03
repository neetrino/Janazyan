'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { MIRAGE_CONTACT_HEADING_CLASS } from '../../components/home/mirage-heading-styles';
import {
  LoginLeftHeroVisual,
  LoginRightHeroVisual,
} from './components/LoginHeroVisual';
import { LoginFormSection } from './components/LoginFormSection';
import {
  LOGIN_CENTER_COLUMN_CLASS,
  LOGIN_FORM_CARD_CLASS,
  LOGIN_FORM_SHELL_CLASS,
  LOGIN_HEADING_STACK_CLASS,
  LOGIN_HERO_LEFT_CLIP_CLASS,
  LOGIN_HERO_LEFT_COLUMN_CLASS,
  LOGIN_SECTION_DESKTOP_BLEED_CLASS,
  LOGIN_SECTION_STACK_CLASS,
  LOGIN_SUBTITLE_CLASS,
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
    <ProductsHeroShell
      sectionAriaLabel="Login"
      catalog={
        <section className={`py-8 md:py-10 lg:py-0 ${LOGIN_SECTION_DESKTOP_BLEED_CLASS}`}>
          <div className={LOGIN_SECTION_STACK_CLASS}>
            <div className={`mx-auto max-lg:mb-8 max-lg:w-full ${LOGIN_HERO_LEFT_COLUMN_CLASS} lg:pointer-events-none`}>
              <div className="max-lg:mx-auto lg:hidden">
                <LoginLeftHeroVisual />
              </div>
              <div className={`max-lg:hidden ${LOGIN_HERO_LEFT_CLIP_CLASS}`}>
                <LoginLeftHeroVisual />
              </div>
            </div>

            <div className={LOGIN_CENTER_COLUMN_CLASS}>
              <header className={LOGIN_HEADING_STACK_CLASS}>
                <h1 className={MIRAGE_CONTACT_HEADING_CLASS}>{t('login.title')}</h1>
                <p className={LOGIN_SUBTITLE_CLASS}>{t('login.subtitle')}</p>
              </header>

              <div className={LOGIN_FORM_SHELL_CLASS}>
                <LoginFormSection />
              </div>
            </div>

            <LoginRightHeroVisual />
          </div>
        </section>
      }
    />
  );
}

function LoginPageFallback() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="Login"
      catalog={
        <section className={`py-8 md:py-10 lg:py-0 ${LOGIN_SECTION_DESKTOP_BLEED_CLASS}`}>
          <div className={LOGIN_SECTION_STACK_CLASS}>
            <div className={`mx-auto max-lg:mb-8 max-lg:w-full ${LOGIN_HERO_LEFT_COLUMN_CLASS} lg:pointer-events-none`}>
              <div className="max-lg:mx-auto lg:hidden">
                <LoginLeftHeroVisual />
              </div>
              <div className={`max-lg:hidden ${LOGIN_HERO_LEFT_CLIP_CLASS}`}>
                <LoginLeftHeroVisual />
              </div>
            </div>

            <div className={LOGIN_CENTER_COLUMN_CLASS}>
              <header className={LOGIN_HEADING_STACK_CLASS}>
                <div className="h-[clamp(42px,5.9vw,85px)] w-3/4 animate-pulse rounded bg-black/5" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-black/5" />
              </header>

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
            </div>

            <LoginRightHeroVisual />
          </div>
        </section>
      }
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
