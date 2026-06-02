'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const ADMIN_PATH_PREFIXES = ['/supersudo', '/admin'] as const;

function shouldUseStorefrontBackground(pathname: string): boolean {
  if (pathname === '/') {
    return false;
  }

  return !ADMIN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** Full-viewport backdrop on non-home storefront pages. Footer sits on top. */
export function StorefrontBackground() {
  const pathname = usePathname();

  if (!shouldUseStorefrontBackground(pathname)) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-safe-top"
    />
  );
}

export function StorefrontMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const padBottom = shouldUseStorefrontBackground(pathname);

  return (
    <main
      className={[
        'relative flex-1 w-full',
        padBottom ? 'lg:pb-[320px]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </main>
  );
}
