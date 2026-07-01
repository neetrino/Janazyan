import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
const BRAND_LOGO_SRC = '/figma/header-logo.webp';
const BRAND_NAME = 'Janazyan';

/** Admin sidebar brand mark — slightly larger than storefront header logo. */
const ADMIN_BRAND_LOGO_WIDTH_PX = 104;
const ADMIN_BRAND_LOGO_HEIGHT_PX = 88;

/** Compact mark size for collapsed admin sidebar rail. */
const COMPACT_LOGO_SIZE_PX = 52;

export type BrandLogoLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'children'> & {
  /** Icon-sized mark for narrow sidebars (e.g. admin rail). */
  compact?: boolean;
};

export function BrandLogoLink({ className = '', compact = false, ...rest }: BrandLogoLinkProps) {
  if (compact) {
    return (
      <Link
        href="/"
        title={BRAND_NAME}
        aria-label={`${BRAND_NAME} Home`}
        className={`relative block shrink-0 overflow-hidden rounded-md transition-opacity hover:opacity-90 ${className}`}
        style={{ width: COMPACT_LOGO_SIZE_PX, height: COMPACT_LOGO_SIZE_PX }}
        {...rest}
      >
        <Image
          src={BRAND_LOGO_SRC}
          alt={BRAND_NAME}
          fill
          sizes={`${COMPACT_LOGO_SIZE_PX}px`}
          className="object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={`${BRAND_NAME} Home`}
      className={`relative block shrink-0 transition-opacity hover:opacity-90 ${className}`}
      {...rest}
    >
      <span
        className="relative block overflow-hidden"
        style={{ width: ADMIN_BRAND_LOGO_WIDTH_PX, height: ADMIN_BRAND_LOGO_HEIGHT_PX }}
      >
        <Image
          src={BRAND_LOGO_SRC}
          alt={BRAND_NAME}
          fill
          sizes={`${ADMIN_BRAND_LOGO_WIDTH_PX}px`}
          className="object-contain object-left"
        />
      </span>
    </Link>
  );
}
