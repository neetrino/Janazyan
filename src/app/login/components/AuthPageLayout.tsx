'use client';

import type { ReactNode } from 'react';
import { AuthPageShell } from '../../../components/auth/AuthPageShell';
import {
  AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} from '../../../components/auth/auth-layout.constants';
import { ProductsHeroShell } from '../../../components/products/ProductsHeroShell';
import { MIRAGE_CONTACT_HEADING_CLASS } from '../../../components/home/mirage-heading-styles';
import { AuthPageScaleShell } from './AuthPageScaleShell';
import {
  LoginLeftHeroVisual,
  LoginRightHeroVisual,
} from './LoginHeroVisual';
import {
  AUTH_MOBILE_CENTER_COLUMN_CLASS,
  AUTH_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  AUTH_PAGE_PHONE_ONLY_CLASS,
  AUTH_PAGE_TABLET_HERO_CLASS,
  LOGIN_CENTER_COLUMN_CLASS,
  LOGIN_HEADING_STACK_CLASS,
  LOGIN_HERO_LEFT_CLIP_CLASS,
  LOGIN_HERO_LEFT_COLUMN_CLASS,
  LOGIN_SECTION_DESKTOP_BLEED_CLASS,
  LOGIN_SECTION_STACK_CLASS,
  LOGIN_SUBTITLE_CLASS,
} from '../login-page.constants';

type AuthPageLayoutProps = {
  sectionAriaLabel: string;
  title: string;
  subtitle: string;
  /** Figma form card — white on mobile and desktop; desktop adds hero art. */
  form: ReactNode;
};

/** Shared login/register shell — white card on phone, hero art from tablet up. */
export function AuthPageLayout({
  sectionAriaLabel,
  title,
  subtitle,
  form,
}: AuthPageLayoutProps) {
  return (
    <ProductsHeroShell
      sectionAriaLabel={sectionAriaLabel}
      compactHero
      mobileContentSurfaceClassName={AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS}
      mobileContentInsetClassName={AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS}
      catalogBottomPaddingClassName={AUTH_PAGE_CATALOG_BOTTOM_PADDING_CLASS}
      catalog={
        <>
          <div className={AUTH_PAGE_PHONE_ONLY_CLASS}>
            <AuthPageShell>
              <div className={AUTH_MOBILE_CENTER_COLUMN_CLASS}>
                <header className={LOGIN_HEADING_STACK_CLASS}>
                  <h1 className={MIRAGE_CONTACT_HEADING_CLASS}>{title}</h1>
                  <p className={LOGIN_SUBTITLE_CLASS}>{subtitle}</p>
                </header>
                {form}
              </div>
            </AuthPageShell>
          </div>

          <div className={AUTH_PAGE_TABLET_HERO_CLASS}>
            <AuthPageScaleShell>
              <section className={LOGIN_SECTION_DESKTOP_BLEED_CLASS}>
                <div className={LOGIN_SECTION_STACK_CLASS}>
                  <div className={LOGIN_HERO_LEFT_COLUMN_CLASS}>
                    <div className={LOGIN_HERO_LEFT_CLIP_CLASS}>
                      <LoginLeftHeroVisual />
                    </div>
                  </div>

                  <div className={LOGIN_CENTER_COLUMN_CLASS}>
                    <header className={LOGIN_HEADING_STACK_CLASS}>
                      <h1 className={MIRAGE_CONTACT_HEADING_CLASS}>{title}</h1>
                      <p className={LOGIN_SUBTITLE_CLASS}>{subtitle}</p>
                    </header>

                    {form}
                  </div>

                  <LoginRightHeroVisual />
                </div>
              </section>
            </AuthPageScaleShell>
          </div>
        </>
      }
    />
  );
}
