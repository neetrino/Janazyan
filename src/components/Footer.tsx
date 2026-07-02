'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../lib/i18n-client';
import {
  FOOTER_COMPANY,
  FOOTER_CONTACT,
  FOOTER_COPYRIGHT_COMPANY,
  FOOTER_PAYMENTS,
  FOOTER_PAYMENTS_GAP_PX,
  FOOTER_SOCIAL,
  FOOTER_SUPPORT,
  type FooterContactItem,
} from './footer/constants';
import { FooterPaymentBadge } from './footer/FooterPaymentBadge';
import { shouldShowStorefrontFooter } from '../lib/layout/storefront-footer-layout';
import { STOREFRONT_CONTENT_MAX_WIDTH_CLASS } from '../lib/layout/storefront-layout.constants';

const FOOTER_TEXT = 'text-black/65';
const FOOTER_LINK =
  'text-[14px] leading-[21px] text-black/65 transition-colors hover:text-black/80';

const FOOTER_DECORATION = '/figma/footer-decoration.webp';
const FOOTER_LOGO = '/figma/footer-logo.webp';

/** Decorative image on the right side of the footer (scaled down from Figma export). */
const FOOTER_DECORATION_BASE_WIDTH_PX = 412;
const FOOTER_DECORATION_BASE_HEIGHT_PX = 548;
const FOOTER_DECORATION_SIZE_SCALE = 1.05;
const FOOTER_DECORATION_WIDTH_PX = Math.round(
  FOOTER_DECORATION_BASE_WIDTH_PX * FOOTER_DECORATION_SIZE_SCALE,
);
const FOOTER_DECORATION_HEIGHT_PX = Math.round(
  FOOTER_DECORATION_BASE_HEIGHT_PX * FOOTER_DECORATION_SIZE_SCALE,
);
const FOOTER_DECORATION_BASE_TOP_PX = -104;
/** Nudge decoration downward within the footer. */
const FOOTER_DECORATION_DOWN_SHIFT_PX = 380;
const FOOTER_DECORATION_TOP_PX =
  FOOTER_DECORATION_BASE_TOP_PX + FOOTER_DECORATION_DOWN_SHIFT_PX;

/** Footer block height (matches `lg:h-[407px]`). */
const FOOTER_HEIGHT_PX = 407;

const FOOTER_SHELL_UP_PULL_PX = 400;
const FOOTER_GRADIENT_OVERLAP_PX = 0;

/** Shell includes top bleed zone; footer content sits in the bottom `FOOTER_HEIGHT_PX`. */
const FOOTER_SHELL_HEIGHT_PX = FOOTER_HEIGHT_PX + FOOTER_SHELL_UP_PULL_PX;

function getFooterGradientStyle(): CSSProperties {
  return {
    top: -FOOTER_GRADIENT_OVERLAP_PX,
    height: FOOTER_HEIGHT_PX + FOOTER_GRADIENT_OVERLAP_PX,
  };
}

const FOOTER_Z_DECORATION = 'z-0';
const FOOTER_Z_CONTENT = 'z-10';

function getFooterShellStyle(): CSSProperties {
  return {
    height: FOOTER_SHELL_HEIGHT_PX,
    marginTop: -FOOTER_SHELL_UP_PULL_PX,
  };
}

function getFooterDecorationPositionStyle(): CSSProperties {
  return {
    top: -FOOTER_SHELL_UP_PULL_PX,
    height: FOOTER_SHELL_HEIGHT_PX,
  };
}

export function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (!shouldShowStorefrontFooter(pathname)) {
    return null;
  }

  return (
    <div
      className="pointer-events-none relative z-[1] hidden shrink-0 overflow-hidden lg:block"
      style={getFooterShellStyle()}
    >
      <footer className="pointer-events-auto absolute inset-x-0 bottom-0 z-0 h-[407px] w-full bg-cream font-armenian">
        <div className="relative mx-auto h-full w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 mx-auto overflow-hidden rounded-t-[60px] border-t border-black/10 bg-gradient-to-b from-purple to-cream"
            style={getFooterGradientStyle()}
          />

          <div
            className={`relative mx-auto hidden h-full w-full lg:block ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS}`}
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 ${FOOTER_Z_DECORATION}`}
              style={getFooterDecorationPositionStyle()}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: FOOTER_DECORATION_TOP_PX,
                  width: FOOTER_DECORATION_WIDTH_PX,
                  height: FOOTER_DECORATION_HEIGHT_PX,
                }}
              >
                <img
                  src={FOOTER_DECORATION}
                  alt=""
                  className="absolute left-[-32.11%] top-[-14.09%] h-[160.63%] w-[164.21%] max-w-none"
                />
              </div>
            </div>

            <div
              className={`absolute left-[77px] top-[53px] ${FOOTER_Z_CONTENT} h-[238px] w-[284px]`}
            >
              <Link
                href="/"
                className="absolute left-[-4px] top-[6px] block h-[66px] w-[79px] overflow-hidden"
              >
                <img
                  src={FOOTER_LOGO}
                  alt="Janazyan"
                  className="absolute left-[-30.76%] top-[-49.34%] h-[198.69%] w-[167.29%] max-w-none"
                />
              </Link>
              <p
                className={`absolute left-0 top-[82px] w-[284px] text-[16px] leading-[24px] tracking-[-0.31px] ${FOOTER_TEXT}`}
              >
                {t('common.footer.description')}
              </p>
              <div className="absolute left-0 top-[198px] flex gap-3">
                {FOOTER_SOCIAL.map((social) => (
                  <SocialLink key={social.label} {...social} />
                ))}
              </div>
            </div>

            <FooterColumn
              title={t('common.footer.companyTitle')}
              className={`absolute left-[26.46%] top-[66px] ${FOOTER_Z_CONTENT}`}
            >
              {FOOTER_COMPANY.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {t('common.footer.' + link.labelKey)}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <div
              className={`absolute left-[63.4%] top-[66px] flex flex-col gap-[15px] ${FOOTER_Z_CONTENT}`}
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
            >
              {FOOTER_SUPPORT.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {t('common.footer.' + link.labelKey)}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <div
              className={`absolute bottom-[24px] left-1/2 flex w-[1280px] max-w-[calc(100%-154px)] -translate-x-1/2 items-end justify-between gap-6 border-t border-white/[0.13] pt-[33px] ${FOOTER_Z_CONTENT}`}
            >
              <p
                className={`whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.15px] ${FOOTER_TEXT}`}
              >
                © 2026{' '}
                <span className="font-bold">{FOOTER_COPYRIGHT_COMPANY}</span>
                {t('common.footer.rightsReserved')}
              </p>
              <div
                className="flex shrink-0 items-center"
                style={{ gap: FOOTER_PAYMENTS_GAP_PX }}
              >
                {FOOTER_PAYMENTS.map((pay) => (
                  <FooterPaymentBadge key={pay.label} payment={pay} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getFooterContactLabel(
  item: FooterContactItem,
  t: (path: string) => string,
): string {
  if (item.label !== undefined) {
    return item.label;
  }
  return t('common.footer.' + item.labelKey);
}

function FooterColumn({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`whitespace-nowrap ${className}`}>
      <h3 className="text-[16px] font-bold uppercase leading-[16.5px] text-black/65">
        {title}
      </h3>
      <ul className="mt-[18px] space-y-[13px]">{children}</ul>
    </div>
  );
}

function FooterContactRow({
  label,
  href,
  icon,
  iconSize,
}: {
  label: string;
  href: string;
  icon: string;
  iconSize: number;
}) {
  const className = `flex items-center gap-[6px] ${FOOTER_LINK}`;
  const inner = (
    <>
      <Image
        src={icon}
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0"
      />
      <span className="whitespace-pre-line">{label}</span>
    </>
  );

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {inner}
    </a>
  );
}

function SocialLink({
  href,
  label,
  icon,
  variant,
}: {
  href: string;
  label: string;
  icon: string;
  variant: 'plum' | 'plain';
}) {
  if (variant === 'plain') {
    return (
      <Link
        href={href}
        aria-label={label}
        className="inline-flex size-10 transition-transform hover:scale-105"
      >
        <Image src={icon} alt="" width={40} height={40} className="size-10" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-plum transition-transform hover:scale-105"
    >
      <Image src={icon} alt="" width={20} height={20} className="size-5" />
    </Link>
  );
}
