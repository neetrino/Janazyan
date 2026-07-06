'use client';

import { ContactFormSection } from './components/ContactFormSection';
import { ContactHeroVisual } from './components/ContactHeroVisual';
import {
  CONTACT_FORM_COLUMN_CLASS,
  CONTACT_FORM_HEADING_CLASS,
  CONTACT_HERO_CLIP_WRAPPER_CLASS,
  CONTACT_HERO_COLUMN_CLASS,
  CONTACT_PAGE_DESCRIPTION_CLASS,
  CONTACT_PAGE_GRID_CLASS,
  CONTACT_SECTION_DESKTOP_BLEED_CLASS,
} from './contact-page.constants';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import {
  AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} from '../../components/auth/auth-layout.constants';
import {
  MIRAGE_CONTACT_HEADING_CLASS,
} from '../../components/home/mirage-heading-styles';
import { useTranslation } from '../../lib/i18n-client';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <ProductsHeroShell
      sectionAriaLabel="Contact"
      mobileContentSurfaceClassName={AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS}
      mobileContentInsetClassName={AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS}
      catalog={
        <section className={`py-8 md:py-10 lg:py-0 ${CONTACT_SECTION_DESKTOP_BLEED_CLASS}`}>
          <div className={CONTACT_PAGE_GRID_CLASS}>
            <div className={CONTACT_HERO_COLUMN_CLASS}>
              <div className={CONTACT_HERO_CLIP_WRAPPER_CLASS}>
                <ContactHeroVisual />
              </div>
            </div>

            <div className={CONTACT_FORM_COLUMN_CLASS}>
              <header className={CONTACT_FORM_HEADING_CLASS}>
                <h1 className={MIRAGE_CONTACT_HEADING_CLASS}>
                  {t('contact.writeToUs.title')}
                </h1>
                <p className={CONTACT_PAGE_DESCRIPTION_CLASS}>
                  {t('contact.writeToUs.description')}
                </p>
              </header>

              <ContactFormSection />
            </div>
          </div>
        </section>
      }
    />
  );
}
