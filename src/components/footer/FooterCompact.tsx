'use client';

import Link from 'next/link';
import { useTranslation } from '../../lib/i18n-client';
import {
  FOOTER_CONTACT,
  FOOTER_PAYMENTS,
  FOOTER_SOCIAL,
  FOOTER_SUPPORT,
} from './constants';
import { FooterCopyright } from './FooterShared';
import {
  FOOTER_COMPACT_CONTACT_LIST_CLASS,
  FOOTER_COMPACT_COPYRIGHT_CLASS,
  FOOTER_COMPACT_DECORATION_CLASS,
  FOOTER_COMPACT_DEFAULT_TOP_MARGIN_PX,
  FOOTER_COMPACT_INSET_CLASS,
  FOOTER_COMPACT_PAYMENTS_CLASS,
  FOOTER_COMPACT_SHELL_CLASS,
  FOOTER_COMPACT_SOCIAL_CLASS,
  FOOTER_COMPACT_SUPPORT_LIST_CLASS,
  FOOTER_COMPACT_SURFACE_CLASS,
  FOOTER_COMPACT_TOP_PADDING_CLASS,
} from './footer-compact.constants';
import { FooterPaymentBadge } from './FooterPaymentBadge';
import {
  FOOTER_LINK,
  FOOTER_TEXT,
  FooterBrandLogo,
  FooterColumn,
  FooterContactRow,
  FooterSocialLink,
  getFooterContactLabel,
} from './FooterShared';

const FOOTER_DECORATION = '/figma/footer-decoration.webp';

/**
 * Storefront footer for `md` to `lg` viewports (Figma node 486:270).
 * Mobile intentionally has no footer; desktop uses the full footer variant.
 */
export function FooterCompact({ extraUpPullPx = 0 }: { extraUpPullPx?: number }) {
  const { t } = useTranslation();
  const shellStyle =
    extraUpPullPx > 0
      ? { marginTop: FOOTER_COMPACT_DEFAULT_TOP_MARGIN_PX - extraUpPullPx }
      : undefined;

  return (
    <footer className={FOOTER_COMPACT_SHELL_CLASS} style={shellStyle}>
      <div
        className={`${FOOTER_COMPACT_SURFACE_CLASS} ${FOOTER_COMPACT_INSET_CLASS} ${FOOTER_COMPACT_TOP_PADDING_CLASS}`}
      >
        <img
          src={FOOTER_DECORATION}
          alt=""
          className={FOOTER_COMPACT_DECORATION_CLASS}
        />

        <div className="absolute left-[6.45%] top-[43px] z-10 w-[210px]">
          <FooterBrandLogo className="-ml-1" />
          <p
            className={`mt-4 text-[14px] leading-[24px] tracking-[-0.31px] ${FOOTER_TEXT}`}
          >
            {t('common.footer.description')}
          </p>
        </div>

        <div className="absolute left-[31.35%] top-[74px] z-10">
          <FooterColumn
            title={t('common.footer.supportTitle')}
            listClassName={FOOTER_COMPACT_SUPPORT_LIST_CLASS}
          >
            {FOOTER_SUPPORT.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={FOOTER_LINK}>
                  {t('common.footer.' + link.labelKey)}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="absolute left-[51.37%] top-[74px] z-10 w-[193px]">
          <h3 className="text-[16px] font-bold uppercase leading-[16.5px] text-black/65">
            {t('common.footer.contactTitle')}
          </h3>
          <div className={FOOTER_COMPACT_CONTACT_LIST_CLASS}>
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
        </div>

        <div className={FOOTER_COMPACT_SOCIAL_CLASS}>
          {FOOTER_SOCIAL.map((social) => (
            <FooterSocialLink key={social.label} {...social} />
          ))}
        </div>

        <div className={FOOTER_COMPACT_PAYMENTS_CLASS}>
          {FOOTER_PAYMENTS.map((pay) => (
            <FooterPaymentBadge key={pay.label} payment={pay} />
          ))}
        </div>

        <FooterCopyright className={FOOTER_COMPACT_COPYRIGHT_CLASS} />
      </div>
    </footer>
  );
}
