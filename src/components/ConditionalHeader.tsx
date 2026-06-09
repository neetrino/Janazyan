'use client';

import { usePathname } from 'next/navigation';
import { usesStorefrontHeroShell } from '../lib/nav/is-storefront-page';
import { Header } from './Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const shouldHideHeader =
    pathname.startsWith('/supersudo') || pathname.startsWith('/admin');

  if (shouldHideHeader) {
    return null;
  }

  if (pathname === '/' || usesStorefrontHeroShell(pathname)) {
    return null;
  }

  return <Header />;
}
