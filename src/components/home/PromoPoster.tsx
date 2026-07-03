'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeroArrowButtonIcon } from './HeroArrowIcon';
import {
  MIRAGE_DISPLAY_BASE,
  MIRAGE_LINE_HEIGHT_CLASS,
} from './mirage-heading-styles';
import { useTranslation } from '../../lib/i18n-client';
import {
  STOREFRONT_DESKTOP_ONLY_CLASS,
  STOREFRONT_PROMO_MAX_WIDTH_CLASS,
  STOREFRONT_TABLET_DOWN_CLASS,
} from '../../lib/layout/storefront-layout.constants';

const PROMO_PHOTO = '/figma/promo-poster-photo.webp';
const PROMO_CTA_HREF = '/products?category=hair';

const PROMO_BODY_COLOR = '#3a4452';

/** Figma node 10:358 — Mirage Expanded, scaled up for on-screen parity */
const PROMO_HEADING_CLASS = `${MIRAGE_DISPLAY_BASE} break-words`;
const PROMO_HEADING_DESKTOP_CLASS = `${PROMO_HEADING_CLASS} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(72px,7.8vw,122px)]`;
const PROMO_HEADING_MOBILE_CLASS = `${PROMO_HEADING_CLASS} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(54px,15vw,90px)] tracking-[-0.35px]`;

const DESKTOP_MIN_HEIGHT_PX = 610;

export function PromoPoster() {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('home.promo.sectionAria')}
      className="relative w-full pb-16 font-armenian md:pb-20"
    >
      <div className={`mx-auto w-full ${STOREFRONT_PROMO_MAX_WIDTH_CLASS}`}>
        <MobilePromo />
        <DesktopPromo />
      </div>
    </section>
  );
}

function MobilePromo() {
  const { t } = useTranslation();
  const titleLines = [t('home.promo.titleLine1'), t('home.promo.titleLine2')];

  return (
    <div className={`overflow-hidden rounded-[28px] bg-white md:rounded-[36px] ${STOREFRONT_TABLET_DOWN_CLASS}`}>
      <div className="relative h-[240px] w-full sm:h-[280px]">
        <Image
          src={PROMO_PHOTO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-left"
        />
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <p
          className="text-[14px] leading-[21px]"
          style={{ color: PROMO_BODY_COLOR }}
        >
          {t('home.promo.description')}
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-800">
            {t('home.promo.label')}
          </p>
          <h2 className={`${PROMO_HEADING_MOBILE_CLASS} mt-3`}>
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-2 text-[clamp(40px,10.5vw,56px)] font-black leading-[0.88] text-ink-800">
            {t('home.promo.discount')}
          </p>
        </div>

        <PromoCta className="w-full justify-center" />
      </div>
    </div>
  );
}

function DesktopPromo() {
  const { t } = useTranslation();
  const titleLines = [t('home.promo.titleLine1'), t('home.promo.titleLine2')];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[36px] bg-white ${STOREFRONT_DESKTOP_ONLY_CLASS}`}
      style={{ minHeight: DESKTOP_MIN_HEIGHT_PX }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(72%,932px)] overflow-hidden">
        <div className="absolute -left-[18px] -top-[76px] h-[695px] w-[932px] max-w-none">
          <Image
            src={PROMO_PHOTO}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <p
        className="absolute left-[3%] top-[83px] z-10 max-w-[min(396px,32%)] text-[14px] leading-[21px]"
        style={{ color: PROMO_BODY_COLOR }}
      >
        {t('home.promo.description')}
      </p>

      <div className="relative z-10 ml-auto flex min-h-[610px] w-[min(100%,44%)] min-w-[320px] max-w-[580px] flex-col items-end px-6 pb-11 pt-[92px] xl:min-w-[380px] xl:px-10 xl:max-w-[620px]">
        <div className="w-full min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-800">
            {t('home.promo.label')}
          </p>
          <h2 className={`${PROMO_HEADING_DESKTOP_CLASS} mt-[22px]`}>
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div aria-hidden className="min-h-[48px] flex-1" />

        <p className="w-full text-right text-[clamp(48px,5.25vw,68px)] font-black leading-[0.88] text-ink-800">
          {t('home.promo.discount')}
        </p>

        <PromoCta className="mt-6 shrink-0 self-end" />
      </div>
    </div>
  );
}

function PromoCta({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <Link
      href={PROMO_CTA_HREF}
      className={[
        'inline-flex h-[50px] items-center gap-3 rounded-full bg-ink-800 px-6 text-[12px] uppercase tracking-[0.16em] text-white transition-transform duration-700 ease-in-out hover:-translate-y-0.5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="whitespace-nowrap">{t('home.promo.cta')}</span>
      <HeroArrowButtonIcon />
    </Link>
  );
}
