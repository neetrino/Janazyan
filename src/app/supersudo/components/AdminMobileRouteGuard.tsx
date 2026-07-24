'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  isMobileAdminAllowedPath,
  MOBILE_ADMIN_DEFAULT_PATH,
} from '../admin-mobile.constants';
import { useAdminMobileViewport } from '../hooks/useAdminMobileViewport';

type AdminMobileRouteGuardProps = {
  children: ReactNode;
};

/**
 * On mobile viewports, only Analytics and Orders are reachable;
 * other admin routes redirect to the mobile default.
 */
export function AdminMobileRouteGuard({ children }: AdminMobileRouteGuardProps) {
  const pathname = usePathname() ?? '/supersudo';
  const router = useRouter();
  const isMobile = useAdminMobileViewport();
  const shouldRedirect =
    isMobile === true && !isMobileAdminAllowedPath(pathname);

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }
    router.replace(MOBILE_ADMIN_DEFAULT_PATH);
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null;
  }

  return children;
}
