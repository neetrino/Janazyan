import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { FooterContactItem } from './constants';

export const FOOTER_TEXT = 'text-black/65';
export const FOOTER_LINK =
  'text-[14px] leading-[21px] text-black/65 transition-colors hover:text-black/80';

export const FOOTER_LOGO = '/figma/footer-logo.webp';

export function getFooterContactLabel(
  item: FooterContactItem,
  t: (path: string) => string,
): string {
  if (item.label !== undefined) {
    return item.label;
  }
  return t('common.footer.' + item.labelKey);
}

export function FooterColumn({
  title,
  children,
  className = '',
  listClassName = 'mt-[18px] space-y-[24px]',
}: {
  title: string;
  children: ReactNode;
  className?: string;
  listClassName?: string;
}) {
  return (
    <div className={`whitespace-nowrap ${className}`}>
      <h3 className="text-[16px] font-bold uppercase leading-[16.5px] text-black/65">
        {title}
      </h3>
      <ul className={listClassName}>{children}</ul>
    </div>
  );
}

export function FooterContactRow({
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
  const className = `flex min-w-0 items-start gap-[6px] ${FOOTER_LINK}`;
  const labelClassName = href.startsWith('mailto:')
    ? 'min-w-0 whitespace-nowrap'
    : 'min-w-0 whitespace-pre-line break-words [overflow-wrap:anywhere]';
  const inner = (
    <>
      <Image
        src={icon}
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0"
      />
      <span className={labelClassName}>{label}</span>
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

export function FooterSocialLink({
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

export function FooterBrandLogo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`relative block h-[66px] w-[79px] overflow-hidden ${className}`}
    >
      <img
        src={FOOTER_LOGO}
        alt="Janazyan"
        className="absolute left-[-30.76%] top-[-49.34%] h-[198.69%] w-[167.29%] max-w-none"
      />
    </Link>
  );
}
