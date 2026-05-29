'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const shouldHideHeader = pathname.startsWith('/supersudo') || pathname.startsWith('/admin');

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}
