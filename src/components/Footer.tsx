'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FOOTER_COLUMN_TITLES,
  FOOTER_COMPANY_LINKS,
  FOOTER_CONTACT,
  FOOTER_COPYRIGHT_COMPANY,
  FOOTER_SOCIAL,
  FOOTER_SUPPORT_LINKS,
  type FooterContactItem,
  type FooterLink as FooterLinkType,
} from './footer/constants';
import { FooterContactIcon } from './footer/FooterContactIcons';
import { FooterPaymentMethods } from './footer/FooterPaymentMethods';
import { STOREFRONT_CONTENT_MAX_WIDTH_CLASS } from '../lib/layout/storefront-layout.constants';

const FOOTER_TEXT = 'text-black/65';
const FOOTER_TITLE_CLASS =
  'text-[16px] font-bold uppercase leading-[16.5px] text-black/65';
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

/** Pull shell upward so decoration can overlap the section above. */
const FOOTER_SHELL_UP_PULL_PX = 400;
/** Extend purple gradient upward into the bleed zone (matches Figma overlap). */
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

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin', '/login', '/register'] as const;

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

function shouldHideFooter(pathname: string): boolean {
  return HIDDEN_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function Footer() {
  const pathname = usePathname();

  if (shouldHideFooter(pathname)) {
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

            <FooterBrand />

            <FooterLinkColumn
              title={FOOTER_COLUMN_TITLES.company}
              links={FOOTER_COMPANY_LINKS}
              linkGapClass="gap-[13px]"
              className={`absolute left-[26.46%] top-[65px] w-[180px] ${FOOTER_Z_CONTENT}`}
            />

            <FooterContact />

            <FooterLinkColumn
              title={FOOTER_COLUMN_TITLES.support}
              links={FOOTER_SUPPORT_LINKS}
              linkGapClass="gap-[9px]"
              className={`absolute left-[79.25%] top-[65px] w-[190px] ${FOOTER_Z_CONTENT}`}
            />

            <FooterPaymentMethods
              className={`absolute left-[75.65%] top-[334px] ${FOOTER_Z_CONTENT}`}
            />

            <p
              className={`absolute left-[73px] top-[348px] whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.15px] ${FOOTER_TEXT} ${FOOTER_Z_CONTENT}`}
            >
              © 2026{' '}
              <span className="font-bold">{FOOTER_COPYRIGHT_COMPANY}</span>։ Բոլոր
              իրավունքները պաշտպանված են։
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterBrand() {
  return (
    <div
      className={`absolute left-[77px] top-[53px] h-[238px] w-[300px] ${FOOTER_Z_CONTENT}`}
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
        className={`absolute left-0 top-[82px] w-[280px] text-[16px] leading-[24px] tracking-[-0.31px] ${FOOTER_TEXT}`}
      >
        Նուրբ խնամք Ձեր փոքրիկի համար՝ ստեղծված սիրով և ուշադրությամբ
        յուրաքանչյուր մանրուքի նկատմամբ։
      </p>
      <div className="absolute left-0 top-[232px] flex gap-3">
        {FOOTER_SOCIAL.map((social) => (
          <SocialLink key={social.label} {...social} />
        ))}
      </div>
    </div>
  );
}

function FooterLinkColumn({
  title,
  links,
  linkGapClass,
  className = '',
}: {
  title: string;
  links: ReadonlyArray<FooterLinkType>;
  linkGapClass: string;
  className?: string;
}) {
  return (
    <div className={`whitespace-nowrap ${className}`}>
      <h3 className={FOOTER_TITLE_CLASS}>{title}</h3>
      <ul className={`mt-[18px] flex flex-col ${linkGapClass}`}>
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className={FOOTER_LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact() {
  return (
    <div
      className={`absolute left-[63.4%] top-[65px] flex w-[200px] flex-col gap-[15px] ${FOOTER_Z_CONTENT}`}
    >
      <h3 className={FOOTER_TITLE_CLASS}>{FOOTER_COLUMN_TITLES.contact}</h3>
      {FOOTER_CONTACT.map((item) => (
        <ContactRow key={item.label} item={item} />
      ))}
    </div>
  );
}

function ContactRow({ item }: { item: FooterContactItem }) {
  const content = (
    <>
      <FooterContactIcon type={item.type} className="shrink-0" />
      <span className="text-[14px] leading-[21px]">{item.label}</span>
    </>
  );
  const rowClass = `flex items-center gap-[6px] ${FOOTER_TEXT}`;

  if (item.href) {
    return (
      <a href={item.href} className={`${rowClass} transition-colors hover:text-black/80`}>
        {content}
      </a>
    );
  }

  return <div className={rowClass}>{content}</div>;
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
