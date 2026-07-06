'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MIRAGE_MOBILE_STORES_TITLE_CLASS } from './mirage-heading-styles';
import { useTranslation } from '../../lib/i18n-client';

/** Figma node 486:332 — mobile home “Our stores” promo banner. */
const STORES_BANNER_HEIGHT_PX = 169;
const STORES_BANNER_RADIUS_PX = 24;
const STORES_BASKET_WIDTH_PX = 201;
const STORES_BASKET_HEIGHT_PX = 214;
const STORES_BASKET_TOP_OFFSET_PX = -45;
const STORES_TITLE_TOP_PX = 24;
const STORES_TITLE_WIDTH_PX = 199;
const STORES_TITLE_RIGHT_INSET_PX = 20;
const STORES_CTA_TOP_PX = 98;
const STORES_CTA_WIDTH_PX = 142;
const STORES_CTA_HEIGHT_PX = 48;
const STORES_CTA_RIGHT_INSET_PX = 20;
const STORES_CTA_ICON_SIZE_PX = 18;
const STORES_BANNER_GRADIENT =
  'linear-gradient(109.85deg, #bcd4ec 25.25%, #ffffff 57.605%, #ffffff 75.066%)';

const STORES_BASKET_IMAGE = '/figma/mobile-stores-basket.png';
const STORES_CTA_ARROW = '/figma/mobile-stores-cta-arrow.svg';
const STORES_PAGE_HREF = '/stores';

export function MobileOurStoresBanner() {
  const { t } = useTranslation();
  const titleLines = [
    t('home.mobile.stores.titleLine1'),
    t('home.mobile.stores.titleLine2'),
  ];

  return (
    <section
      aria-label={t('home.mobile.stores.sectionAria')}
      className="relative z-10 mt-10 w-full"
      style={{ height: STORES_BANNER_HEIGHT_PX }}
    >
      <div
        className="relative size-full overflow-visible"
        style={{
          borderRadius: STORES_BANNER_RADIUS_PX,
          backgroundImage: STORES_BANNER_GRADIENT,
        }}
      >
        <div
          className="pointer-events-none absolute left-0 overflow-hidden"
          style={{
            top: STORES_BASKET_TOP_OFFSET_PX,
            width: STORES_BASKET_WIDTH_PX,
            height: STORES_BASKET_HEIGHT_PX,
            borderTopLeftRadius: 77,
            borderTopRightRadius: 7,
            borderBottomLeftRadius: STORES_BANNER_RADIUS_PX,
            borderBottomRightRadius: 7,
          }}
        >
          <div className="absolute left-[-17.07%] top-0 h-[138.39%] w-[117.43%]">
            <Image
              src={STORES_BASKET_IMAGE}
              alt=""
              fill
              sizes={`${STORES_BASKET_WIDTH_PX}px`}
              className="max-w-none object-cover"
            />
          </div>
        </div>

        <div
          className="absolute text-right"
          style={{
            top: STORES_TITLE_TOP_PX,
            right: STORES_TITLE_RIGHT_INSET_PX,
            width: STORES_TITLE_WIDTH_PX,
          }}
        >
          <h2 className={MIRAGE_MOBILE_STORES_TITLE_CLASS}>
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <Link
          href={STORES_PAGE_HREF}
          className="absolute inline-flex items-center justify-center gap-[5px] rounded-full bg-sky px-[15px] py-[9px] text-[14px] font-semibold uppercase tracking-[1.5px] text-white"
          style={{
            top: STORES_CTA_TOP_PX,
            right: STORES_CTA_RIGHT_INSET_PX,
            width: STORES_CTA_WIDTH_PX,
            height: STORES_CTA_HEIGHT_PX,
          }}
        >
          <span>{t('home.mobile.stores.cta')}</span>
          <Image
            src={STORES_CTA_ARROW}
            alt=""
            width={STORES_CTA_ICON_SIZE_PX}
            height={STORES_CTA_ICON_SIZE_PX}
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
