'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ProductPageShell } from './ProductPageShell';
import { readProductPageSnapshotByPathname } from '@/lib/products/product-page-snapshot';

/**
 * Snapshot-aware PDP shell used in both route loading.tsx and Suspense fallback.
 * This ensures the very first visual frame can render from cached product preview data.
 */
export function ProductPageShellInstant() {
  const pathname = usePathname();
  const snapshot = useMemo(
    () => readProductPageSnapshotByPathname(pathname),
    [pathname],
  );

  return <ProductPageShell snapshot={snapshot} />;
}
