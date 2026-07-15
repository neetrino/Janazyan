'use client';

import { useMemo } from 'react';
import { loadTranslation } from '../../../lib/i18n';
import { useTranslation } from '../../../lib/i18n-client';
import {
  ABOUT_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  ABOUT_PAGE_HERO_SHELL_PROPS,
  ABOUT_SECTION_DESKTOP_BLEED_CLASS,
} from '../about-page.constants';
import { AboutDesktopLayout } from './AboutDesktopLayout';
import { AboutMobileLayout } from './AboutMobileLayout';
import { ProductsHeroShell } from '../../../components/products/ProductsHeroShell';

type AboutCopy = {
  title: string;
  intro: string;
  bodyLeft: string[];
  bodyRight: string[];
};

function resolveAboutCopy(
  lang: string,
  titleFallback: string,
): AboutCopy {
  const about = loadTranslation(lang, 'about');
  const paragraphs = about?.description?.paragraphs;
  const list = Array.isArray(paragraphs) ? (paragraphs as string[]) : [];

  return {
    title: typeof about?.title === 'string' ? about.title : titleFallback,
    intro: list[0] ?? '',
    bodyLeft: list.slice(1, 3),
    bodyRight: list.slice(3),
  };
}

/**
 * About Us page content — Figma node 598:549.
 */
export function AboutPageContent() {
  const { t, lang } = useTranslation();
  const copy = useMemo(
    () => resolveAboutCopy(lang, t('about.title')),
    [lang, t],
  );

  return (
    <ProductsHeroShell
      sectionAriaLabel="About us"
      {...ABOUT_PAGE_HERO_SHELL_PROPS}
      catalogBottomPaddingClassName={ABOUT_PAGE_CATALOG_BOTTOM_PADDING_CLASS}
      catalog={
        <section className={`py-4 md:py-6 lg:py-0 ${ABOUT_SECTION_DESKTOP_BLEED_CLASS}`}>
          <div className="about-page-shell-bleed hidden desktop:block">
            <AboutDesktopLayout
              title={copy.title}
              intro={copy.intro}
              bodyLeft={copy.bodyLeft}
              bodyRight={copy.bodyRight}
            />
          </div>

          <AboutMobileLayout
            title={copy.title}
            intro={copy.intro}
            bodyLeft={copy.bodyLeft}
            bodyRight={copy.bodyRight}
          />
        </section>
      }
    />
  );
}
