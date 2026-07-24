'use client';

import type { ReactNode } from 'react';
import { AdminSidebarCollapseProvider } from '../context/AdminSidebarCollapseContext';
import { AdminDialogsProvider } from '../context/AdminDialogsContext';
import {
  ADMIN_MAIN_COLUMN,
  ADMIN_MAIN_INNER,
  ADMIN_PAGE_SHELL,
} from '../admin-sidebar-classes';
import { AdminMobileRouteGuard } from './AdminMobileRouteGuard';
import { AdminSidebar } from './AdminSidebar';

type AdminLayoutClientProps = {
  children: ReactNode;
};

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  return (
    <AdminSidebarCollapseProvider>
      <AdminDialogsProvider>
        <AdminMobileRouteGuard>
          <div className={ADMIN_PAGE_SHELL}>
            <AdminSidebar />
            <div className={ADMIN_MAIN_COLUMN}>
              <div className={ADMIN_MAIN_INNER}>{children}</div>
            </div>
          </div>
        </AdminMobileRouteGuard>
      </AdminDialogsProvider>
    </AdminSidebarCollapseProvider>
  );
}
