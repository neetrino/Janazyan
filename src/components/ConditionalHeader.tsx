'use client';

import { usePathname } from 'next/navigation';
import { shouldHideGlobalHeader } from '../lib/nav/is-storefront-page';
import { Header } from './Header';

export function ConditionalHeader() {
  const pathname = usePathname();

  if (shouldHideGlobalHeader(pathname)) {
    return null;
  }

  return <Header />;
}
