'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { MIRAGE_PAGE_HEADING_CLASS } from '../../components/home/mirage-heading-styles';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { TeamCarousel } from '../../components/TeamCarousel';
import { loadTranslation } from '../../lib/i18n';
import { useTranslation } from '../../lib/i18n-client';

/** Set to true when the Our Team section should be visible again. */
const SHOW_ABOUT_TEAM_SECTION = false;

/**
 * About Us page — store intro; team carousel gated by {@link SHOW_ABOUT_TEAM_SECTION}.
 */
export default function AboutPage() {
  const { t, lang } = useTranslation();
  const paragraphs = useMemo(() => {
    const about = loadTranslation(lang, 'about');
    const items = about?.description?.paragraphs;
    return Array.isArray(items) ? (items as string[]) : [];
  }, [lang]);

  return (
    <ProductsHeroShell
      sectionAriaLabel="About us"
      catalog={
        <>
          <section className="py-4 lg:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-lg md:h-[500px] lg:h-[600px]">
                  <Image
                    src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Our team working together"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>

                <div className="space-y-6">
                  <h1 className={MIRAGE_PAGE_HEADING_CLASS}>
                    {t('about.title')}
                  </h1>

                  <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {SHOW_ABOUT_TEAM_SECTION ? (
            <section className="py-16 md:py-24">
              <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#7CB342] md:text-base">
                    {t('about.team.subtitle')}
                  </p>

                  <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                    {t('about.team.title')}
                  </h2>

                  <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
                    {t('about.team.description')}
                  </p>
                </div>

                <div className="mx-auto max-w-6xl">
                  <TeamCarousel />
                </div>
              </div>
            </section>
          ) : null}
        </>
      }
    />
  );
}
