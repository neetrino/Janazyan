'use client';

import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { MIRAGE_CONTACT_HEADING_CLASS } from '../../components/home/mirage-heading-styles';
import {
  LoginLeftHeroVisual,
  LoginRightHeroVisual,
} from '../login/components/LoginHeroVisual';
import { RegisterFormSection } from './components/RegisterFormSection';
import {
  REGISTER_CENTER_COLUMN_CLASS,
  REGISTER_FORM_SHELL_CLASS,
  REGISTER_HEADING_STACK_CLASS,
  REGISTER_HERO_LEFT_CLIP_CLASS,
  REGISTER_HERO_LEFT_COLUMN_CLASS,
  REGISTER_SECTION_DESKTOP_BLEED_CLASS,
  REGISTER_SECTION_STACK_CLASS,
  REGISTER_SUBTITLE_CLASS,
} from './register-page.constants';
import { useTranslation } from '../../lib/i18n-client';

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <ProductsHeroShell
      sectionAriaLabel="Register"
      catalog={
        <section className={`py-8 md:py-10 lg:py-0 ${REGISTER_SECTION_DESKTOP_BLEED_CLASS}`}>
          <div className={REGISTER_SECTION_STACK_CLASS}>
            <div
              className={`mx-auto max-lg:mb-8 max-lg:w-full ${REGISTER_HERO_LEFT_COLUMN_CLASS} lg:pointer-events-none`}
            >
              <div className="max-lg:mx-auto lg:hidden">
                <LoginLeftHeroVisual />
              </div>
              <div className={`max-lg:hidden ${REGISTER_HERO_LEFT_CLIP_CLASS}`}>
                <LoginLeftHeroVisual />
              </div>
            </div>

            <div className={REGISTER_CENTER_COLUMN_CLASS}>
              <header className={REGISTER_HEADING_STACK_CLASS}>
                <h1 className={MIRAGE_CONTACT_HEADING_CLASS}>{t('register.title')}</h1>
                <p className={REGISTER_SUBTITLE_CLASS}>{t('register.subtitle')}</p>
              </header>

              <div className={REGISTER_FORM_SHELL_CLASS}>
                <RegisterFormSection />
              </div>
            </div>

            <LoginRightHeroVisual />
          </div>
        </section>
      }
    />
  );
}
