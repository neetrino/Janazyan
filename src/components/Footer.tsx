'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FOOTER_BRAND,
  FOOTER_COPYRIGHT_COMPANY,
  FOOTER_PURCHASES,
  FOOTER_SOCIAL,
  FOOTER_SUPPORT,
} from './footer/constants';

const FOOTER_TEXT = 'text-black/65';
const FOOTER_LINK =
  'text-[14px] leading-[21px] text-black/65 transition-colors hover:text-black/80';

const FOOTER_DECORATION = '/figma/footer-decoration.webp';
const FOOTER_LOGO = '/figma/footer-logo.webp';

/** Decorative image on the right side of the footer (scaled down from Figma export). */
const FOOTER_DECORATION_BASE_WIDTH_PX = 412;
const FOOTER_DECORATION_BASE_HEIGHT_PX = 548;
const FOOTER_DECORATION_SIZE_SCALE = 1.12;
const FOOTER_DECORATION_WIDTH_PX = Math.round(
  FOOTER_DECORATION_BASE_WIDTH_PX * FOOTER_DECORATION_SIZE_SCALE,
);
const FOOTER_DECORATION_HEIGHT_PX = Math.round(
  FOOTER_DECORATION_BASE_HEIGHT_PX * FOOTER_DECORATION_SIZE_SCALE,
);
const FOOTER_DECORATION_LEFT_PX = 500;
const FOOTER_DECORATION_BASE_TOP_PX = -104;
/** Nudge decoration downward within the footer. */
const FOOTER_DECORATION_DOWN_SHIFT_PX = 360;
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

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin'] as const;

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
  return HIDDEN_FOOTER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function Footer() {
  const pathname = usePathname();

  if (shouldHideFooter(pathname)) {
    return null;
  }

  return (
    <div
      className="relative z-[1] hidden shrink-0 overflow-hidden lg:block"
      style={getFooterShellStyle()}
    >
      <footer className="absolute inset-x-0 bottom-0 z-0 h-[407px] w-full bg-cream font-armenian">
        <div className="relative mx-auto h-full w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 mx-auto overflow-hidden rounded-t-[60px] border-t border-black/10 bg-gradient-to-b from-purple to-cream"
            style={getFooterGradientStyle()}
          />

          <div className="relative mx-auto hidden h-full w-full max-w-[1470px] lg:block">
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 ${FOOTER_Z_DECORATION}`}
              style={getFooterDecorationPositionStyle()}
            >
              <div
                className="absolute"
                style={{
                  left: FOOTER_DECORATION_LEFT_PX,
                  top: FOOTER_DECORATION_TOP_PX,
                  width: FOOTER_DECORATION_WIDTH_PX,
                  height: FOOTER_DECORATION_HEIGHT_PX,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FOOTER_LOGO}
                  alt="Janazyan"
                  className="absolute left-[-30.76%] top-[-49.34%] h-[198.69%] w-[167.29%] max-w-none"
                />
              </Link>
              <p
                className={`absolute left-0 top-[82px] w-[284px] text-[16px] leading-[24px] tracking-[-0.31px] ${FOOTER_TEXT}`}
              >
                Նուրբ խնամք Ձեր փոքրիկի համար՝ ստեղծված սիրով և ուշադրությամբ
                յուրաքանչյուր մանրուքի նկատմամբ։
              </p>
              <div className="absolute left-0 top-[198px] flex gap-3">
                {FOOTER_SOCIAL.map((social) => (
                  <SocialLink key={social.label} {...social} />
                ))}
              </div>
            </div>

            <FooterColumn
              title="ԳՆՈՒՄՆԵՐ"
              className={`absolute left-[25.92%] right-[57.63%] top-[75px] ${FOOTER_Z_CONTENT}`}
            >
              {FOOTER_PURCHASES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn
              title="ԱՋԱԿՑՈՒԹՅՈՒՆ"
              className={`absolute left-[66.19%] right-[17.36%] top-[75px] ${FOOTER_Z_CONTENT}`}
            >
              {FOOTER_SUPPORT.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn
              title="ԲՐԵՆԴ"
              className={`absolute left-[82.65%] right-[0.9%] top-[75px] ${FOOTER_Z_CONTENT}`}
            >
              {FOOTER_BRAND.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <div
              className={`absolute bottom-[24px] left-1/2 flex h-[53px] w-[1280px] max-w-[calc(100%-154px)] -translate-x-1/2 flex-col justify-end border-t border-white/[0.13] pt-[33px] ${FOOTER_Z_CONTENT}`}
            >
              <p
                className={`whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.15px] ${FOOTER_TEXT}`}
              >
                © 2026{' '}
                <span className="font-bold">{FOOTER_COPYRIGHT_COMPANY}</span>։
                Բոլոր իրավունքները պաշտպանված են։
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
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
