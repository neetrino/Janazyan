'use client';

import type { CSSProperties } from 'react';
import { ABOUT_STAT_KEYS } from './constants';
import {
  MIRAGE_ABOUT_HEADING_INK_CLASS,
  MIRAGE_ABOUT_HEADING_SKY_CLASS,
} from './mirage-heading-styles';
import { useTranslation } from '../../lib/i18n-client';
import {
  STOREFRONT_CONTENT_MAX_WIDTH_PX,
  STOREFRONT_CONTENT_SHELL_CLASS,
} from '../../lib/layout/storefront-layout.constants';

const ABOUT_IMAGE = '/figma/about-hero.webp';

/** Extra space below desktop about content before footer overlap. */
const ABOUT_DESKTOP_FOOTER_GAP_PX = 80;
const ABOUT_DESKTOP_HEIGHT_PX = 1017;
const ABOUT_DESKTOP_TOTAL_HEIGHT_PX = ABOUT_DESKTOP_HEIGHT_PX + ABOUT_DESKTOP_FOOTER_GAP_PX;

const ABOUT_BG_STYLE: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1470 1017' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-1.85 -44.9 64.9 -2.674 694.5 537)'><stop stop-color='rgba(227,206,250,1)' offset='0'/><stop stop-color='rgba(239,247,255,1)' offset='0.75962'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>\")",
};

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('home.about.sectionAria')}
      className="relative hidden w-full overflow-hidden font-armenian lg:block"
      style={ABOUT_BG_STYLE}
    >
      <div className={STOREFRONT_CONTENT_SHELL_CLASS}>
        <DesktopAbout />
      </div>
    </section>
  );
}

function DesktopAbout() {
  const { t } = useTranslation();

  const scaleExpression = `calc(100cqw / ${STOREFRONT_CONTENT_MAX_WIDTH_PX}px)`;

  return (
    <div className="@container relative w-full">
      <div
        className="relative flex w-full justify-center overflow-hidden"
        style={{
          height: `calc(${ABOUT_DESKTOP_TOTAL_HEIGHT_PX}px * ${scaleExpression})`,
        }}
      >
        <div
          className="relative shrink-0 origin-top"
          style={{
            width: STOREFRONT_CONTENT_MAX_WIDTH_PX,
            height: ABOUT_DESKTOP_TOTAL_HEIGHT_PX,
            transform: `scale(${scaleExpression})`,
          }}
        >
        <div
          aria-hidden
          className="pointer-events-none absolute left-[403px] top-[118px] z-[3] h-[798px] w-[598px] animate-hero-body-wash-showcase"
        >
          <img
            src={ABOUT_IMAGE}
            alt=""
            className="size-full max-w-none object-cover mix-blend-screen"
          />
        </div>

        <div className="absolute left-1/2 top-[48px] z-[2] flex -translate-x-1/2 flex-col items-center text-center">
          <p className={`whitespace-nowrap ${MIRAGE_ABOUT_HEADING_INK_CLASS}`}>
            {t('home.about.headingBorn')}
          </p>
          <p className={`whitespace-nowrap ${MIRAGE_ABOUT_HEADING_SKY_CLASS}`}>
            {t('home.about.headingCare')}
          </p>
        </div>

        <p className="absolute left-[950px] top-[323px] z-[2] w-[433px] text-[18px] leading-[29.25px] tracking-[-0.4395px] text-ink-500">
          {t('home.about.paragraphRight')}
        </p>

        <p className="absolute left-[484px] top-[228px] z-[2] w-[352px] -translate-x-full text-right text-[16px] leading-[26px] tracking-[-0.3125px] text-ink-500">
          {t('home.about.paragraphLeft')}
        </p>

        <div className="absolute left-[254px] top-[548px] z-[2] w-[149px]">
          <Stat statKey={ABOUT_STAT_KEYS[0]} />
        </div>

        <div className="absolute left-[577px] top-[796px] z-[2] w-[99px]">
          <Stat statKey={ABOUT_STAT_KEYS[1]} />
        </div>

        <div className="absolute left-[1044px] top-[579px] z-[2] w-[115px]">
          <Stat statKey={ABOUT_STAT_KEYS[2]} />
        </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  statKey,
  align = 'center',
}: {
  statKey: (typeof ABOUT_STAT_KEYS)[number];
  align?: 'left' | 'center' | 'right';
}) {
  const { t } = useTranslation();
  const alignClass =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-center text-center';

  return (
    <div className={`flex flex-col gap-[4px] ${alignClass}`}>
      <span className="whitespace-nowrap text-[30px] font-black leading-[36px] tracking-[0.3955px] text-sky-soft">
        {t(`home.about.stats.${statKey}.value`)}
      </span>
      <span className="whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.1504px] text-ink-500">
        {t(`home.about.stats.${statKey}.label`)}
      </span>
    </div>
  );
}
