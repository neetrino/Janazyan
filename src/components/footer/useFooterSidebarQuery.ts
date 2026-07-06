'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

/** Current URL search params for footer sidebar catalog links. */
export function useFooterSidebarQuery(): URLSearchParams {
  const searchParams = useSearchParams();

  return useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );
}
