'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../lib/i18n-client';
import {
  FOOTER_CONTACT,
  FOOTER_PAYMENTS,
  FOOTER_PAYMENTS_GAP_PX,
  FOOTER_SOCIAL,
  FOOTER_SUPPORT,
} from './footer/constants';
import { FooterCompanyLinks } from './footer/FooterCompanyLinks';
import { FooterCompact } from './footer/FooterCompact';
import { FooterCopyright } from './footer/FooterShared';
import {
  FOOTER_DESKTOP_DECORATION_BLEED_PX,
  FOOTER_DESKTOP_DECORATION_HEIGHT_PX,
  FOOTER_DESKTOP_DECORATION_LEFT_PERCENT,
  FOOTER_DESKTOP_DECORATION_SRC,
  FOOTER_DESKTOP_DECORATION_TOP_PX,
  FOOTER_DESKTOP_DECORATION_WIDTH_PX,
} from './footer/footer-desktop.constants';
import { FooterPaymentBadge } from './footer/FooterPaymentBadge';
import {
  FOOTER_LINK,
  FOOTER_TEXT,
  FooterBrandLogo,
  FooterColumn,
  FooterContactRow,
  FooterSocialLink,
  getFooterContactLabel,
} from './footer/FooterShared';
import {
  shouldShowStorefrontFooter,
  resolvePageFooterExtraUpPull,
  resolvePageFooterShellUpPullPx,
  resolvePageFooterCompactTopMarginClass,
} from '../lib/layout/storefront-footer-layout';
import { STOREFRONT_CONTENT_MAX_WIDTH_CLASS } from '../lib/layout/storefront-layout.constants';

const FOOTER_COLUMN_LIST_CLASS = 'mt-[18px] space-y-[24px]';
const FOOTER_COMPANY_COLUMN_LIST_CLASS = 'mt-[18px] space-y-[12px]';
const FOOTER_CONTACT_COLUMN_GAP_CLASS = 'gap-[26px]';
const FOOTER_CONTACT_COLUMN_WIDTH_CLASS = 'w-[260px]';

/** Footer block height (matches `lg:h-[407px]`). */
const FOOTER_HEIGHT_PX = 407;

const FOOTER_Z_DECORATION = 'z-[1]';
const FOOTER_Z_CONTENT = 'z-10';

function resolveFooterDecorationBleedPx(shellUpPullPx: number): number {
  return shellUpPullPx === 0 ? FOOTER_DESKTOP_DECORATION_BLEED_PX : 0;
}

function getFooterShellStyle(
  shellUpPullPx: number,
  extraUpPullPx: number,
  decorationBleedPx: number,
): CSSProperties {
  const overlapPx = shellUpPullPx + extraUpPullPx;

  return {
    height: FOOTER_HEIGHT_PX + shellUpPullPx + decorationBleedPx,
    marginTop: overlapPx > 0 ? -overlapPx : 0,
  };
}

function FooterDesktop({
  shellUpPullPx,
  extraUpPullPx,
}: {
  shellUpPullPx: number;
  extraUpPullPx: number;
}) {
  const { t } = useTranslation();
  const decorationBleedPx = resolveFooterDecorationBleedPx(shellUpPullPx);
  const shellOverflowClass =
    decorationBleedPx > 0 ? 'overflow-visible' : 'overflow-hidden';

  return (
    <div
      className={`pointer-events-none relative z-0 hidden shrink-0 ${shellOverflowClass} min-[1650px]:block`}
      style={getFooterShellStyle(shellUpPullPx, extraUpPullPx, decorationBleedPx)}
    >
      <footer className="pointer-events-auto absolute inset-x-0 bottom-0 z-0 h-[407px] w-full overflow-visible rounded-t-[60px] border-t border-black/10 bg-gradient-to-b from-purple to-cream font-armenian">
        <div className="relative mx-auto h-full w-full">
          <div
            className={`relative mx-auto hidden h-full w-full min-[1650px]:block ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`}
          >
            <img
              src={FOOTER_DESKTOP_DECORATION_SRC}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none absolute max-w-none object-contain ${FOOTER_Z_DECORATION}`}
              style={{
                left: `${FOOTER_DESKTOP_DECORATION_LEFT_PERCENT}%`,
                top: FOOTER_DESKTOP_DECORATION_TOP_PX,
                width: FOOTER_DESKTOP_DECORATION_WIDTH_PX,
                height: FOOTER_DESKTOP_DECORATION_HEIGHT_PX,
              }}
            />

            <div
              className={`absolute left-[77px] top-[53px] ${FOOTER_Z_CONTENT} h-[238px] w-[284px]`}
            >
              <FooterBrandLogo className="absolute left-[-4px] top-[6px]" />
              <p
                className={`absolute left-0 top-[82px] w-[284px] text-[16px] leading-[24px] tracking-[-0.31px] ${FOOTER_TEXT}`}
              >
                {t('common.footer.description')}
              </p>
              <div className="absolute left-0 top-[198px] flex gap-3">
                {FOOTER_SOCIAL.map((social) => (
                  <FooterSocialLink key={social.label} {...social} />
                ))}
              </div>
            </div>

            <FooterCompanyLinks
              title={t('common.footer.companyTitle')}
              className={`absolute left-[26.46%] top-[66px] ${FOOTER_Z_CONTENT}`}
              listClassName={FOOTER_COMPANY_COLUMN_LIST_CLASS}
            />

            <div
              className={`absolute left-[63.4%] top-[66px] flex ${FOOTER_CONTACT_COLUMN_WIDTH_CLASS} flex-col ${FOOTER_CONTACT_COLUMN_GAP_CLASS} ${FOOTER_Z_CONTENT}`}
            >
              <h3 className="text-[16px] font-bold uppercase leading-[16.5px] text-black/65">
                {t('common.footer.contactTitle')}
              </h3>
              {FOOTER_CONTACT.map((item) => (
                <FooterContactRow
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  iconSize={item.iconSize}
                  label={getFooterContactLabel(item, t)}
                />
              ))}
            </div>

            <FooterColumn
              title={t('common.footer.supportTitle')}
              className={`absolute left-[79.25%] top-[66px] ${FOOTER_Z_CONTENT}`}
              listClassName={FOOTER_COLUMN_LIST_CLASS}
            >
              {FOOTER_SUPPORT.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {t('common.footer.' + link.labelKey)}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterCopyright
              className={`absolute bottom-[57px] left-[77px] pt-[33px] ${FOOTER_Z_CONTENT}`}
            />
            <div
              className={`absolute bottom-[24px] right-[77px] flex shrink-0 items-center pt-[33px] ${FOOTER_Z_CONTENT}`}
              style={{ gap: FOOTER_PAYMENTS_GAP_PX }}
            >
              {FOOTER_PAYMENTS.map((pay) => (
                <FooterPaymentBadge key={pay.label} payment={pay} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const shellUpPullPx = resolvePageFooterShellUpPullPx(pathname);
  const extraUpPullPx = resolvePageFooterExtraUpPull(pathname);
  const compactTopMarginClass = resolvePageFooterCompactTopMarginClass(pathname);

  if (!shouldShowStorefrontFooter(pathname)) {
    return null;
  }

  return (
    <>
      <FooterCompact extraUpPullPx={extraUpPullPx} topMarginClassName={compactTopMarginClass} />
      <FooterDesktop shellUpPullPx={shellUpPullPx} extraUpPullPx={extraUpPullPx} />
    </>
  );
}
