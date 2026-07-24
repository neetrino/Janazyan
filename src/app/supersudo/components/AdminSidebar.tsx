'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { AdminMenuItem } from '../../../components/AdminMenuDrawer';
import { usePathname } from 'next/navigation';
import { AdminMenuDrawer } from '../../../components/AdminMenuDrawer';
import { BrandLogoLink } from '../../../components/BrandLogoLink';
import { useTranslation } from '../../../lib/i18n-client';
import { isMobileAdminMenuId } from '../admin-mobile.constants';
import { getAdminMenuTABS } from '../admin-menu.config';
import {
  ADMIN_SIDEBAR_ASIDE,
  ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP,
  ADMIN_SIDEBAR_NAV,
} from '../admin-sidebar-classes';
import { useAdminSidebarCollapse } from '../context/AdminSidebarCollapseContext';
import { useAdminProductsSubnavExpanded } from '../hooks/useAdminProductsSubnavExpanded';
import { AdminSidebarBrand } from './AdminSidebarBrand';

function isTabPathActive(tabPath: string, pathname: string): boolean {
  return (
    pathname === tabPath ||
    (tabPath === '/supersudo' && pathname === '/supersudo') ||
    (tabPath !== '/supersudo' && pathname.startsWith(tabPath))
  );
}

function isProductsNestedTabVisible(
  tab: AdminMenuItem,
  pathname: string,
  collapsed: boolean,
  productsNestedExpanded: boolean
): boolean {
  if (tab.id === 'products') {
    return true;
  }
  if (tab.parentGroupId !== 'products') {
    return true;
  }
  if (collapsed) {
    return true;
  }
  if (isTabPathActive(tab.path, pathname)) {
    return true;
  }
  return productsNestedExpanded;
}

export function AdminSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname() ?? '/supersudo';
  const adminTabs = useMemo(() => getAdminMenuTABS(t), [t]);
  const mobileAdminTabs = useMemo(
    () => adminTabs.filter((tab) => isMobileAdminMenuId(tab.id)),
    [adminTabs],
  );
  const { collapsed } = useAdminSidebarCollapse();
  const [productsNestedExpanded, toggleProductsNested] = useAdminProductsSubnavExpanded(pathname);

  const asideWidthClass = collapsed ? 'lg:w-16' : 'lg:w-64';

  return (
    <>
      <div className={ADMIN_SIDEBAR_MOBILE_DRAWER_WRAP}>
        <div className="flex items-center justify-between gap-3">
          <BrandLogoLink className="min-w-0 shrink" />
          <AdminMenuDrawer tabs={mobileAdminTabs} currentPath={pathname} />
        </div>
      </div>
      <aside className={`${ADMIN_SIDEBAR_ASIDE} ${asideWidthClass}`}>
        <AdminSidebarBrand />
        <nav
          className={`${ADMIN_SIDEBAR_NAV} ${collapsed ? 'px-1' : 'px-2'}`}
        >
          {adminTabs.map((tab) => {
            if (!isProductsNestedTabVisible(tab, pathname, collapsed, productsNestedExpanded)) {
              return null;
            }

            const isActive = isTabPathActive(tab.path, pathname);
            const rowClasses = `flex w-full items-center rounded-md text-sm font-medium transition-all ${
              collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
            } ${tab.isSubCategory && !collapsed ? 'pl-12' : ''} ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`;

            if (tab.id === 'products' && !collapsed) {
              return (
                <div
                  key={tab.id}
                  className={`flex w-full rounded-md ${
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-700'
                  }`}
                >
                  <Link
                    href={tab.path}
                    prefetch={false}
                    title={tab.label}
                    className={`flex min-w-0 flex-1 items-center gap-3 rounded-l-md px-4 py-3 text-left text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white hover:bg-gray-800'
                        : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>{tab.icon}</span>
                    <span className="min-w-0 truncate">{tab.label}</span>
                  </Link>
                  <button
                    type="button"
                    aria-expanded={productsNestedExpanded}
                    aria-label={t('admin.sidebar.toggleProductsNested')}
                    title={t('admin.sidebar.toggleProductsNested')}
                    onClick={() => {
                      toggleProductsNested();
                    }}
                    className={`shrink-0 rounded-r-md px-2 py-3 transition-colors ${
                      isActive
                        ? 'text-white hover:bg-gray-800'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      className={`h-5 w-5 transition-transform ${productsNestedExpanded ? '' : '-rotate-90'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.path}
                prefetch={false}
                title={tab.label}
                className={rowClasses}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {tab.icon}
                </span>
                {!collapsed ? <span className="min-w-0 text-left">{tab.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
