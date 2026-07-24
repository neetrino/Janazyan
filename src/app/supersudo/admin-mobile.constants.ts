/**
 * Mobile admin (below Tailwind `lg`) is limited to operational pages only.
 * Desktop keeps the full sidebar.
 */
export const ADMIN_MOBILE_MAX_WIDTH_PX = 1023;

export const MOBILE_ADMIN_MENU_IDS = ['orders', 'analytics'] as const;

export type MobileAdminMenuId = (typeof MOBILE_ADMIN_MENU_IDS)[number];

export const MOBILE_ADMIN_DEFAULT_PATH = '/supersudo/orders';

const MOBILE_ADMIN_ALLOWED_PATHS = [
  '/supersudo/orders',
  '/supersudo/analytics',
] as const;

const MOBILE_ADMIN_MENU_ID_SET: ReadonlySet<string> = new Set(MOBILE_ADMIN_MENU_IDS);

export function isMobileAdminMenuId(id: string): boolean {
  return MOBILE_ADMIN_MENU_ID_SET.has(id);
}

export function isMobileAdminAllowedPath(pathname: string): boolean {
  return MOBILE_ADMIN_ALLOWED_PATHS.some(
    (allowed) => pathname === allowed || pathname.startsWith(`${allowed}/`),
  );
}

export function getAdminMobileMediaQuery(): string {
  return `(max-width: ${ADMIN_MOBILE_MAX_WIDTH_PX}px)`;
}
