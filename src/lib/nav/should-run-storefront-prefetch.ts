import { isAdminPath } from './is-storefront-page';

/** Whether global storefront warm-up (catalog/cart prefetch) should run on this route. */
export function shouldRunStorefrontPrefetch(pathname: string | null | undefined): boolean {
  if (!pathname) {
    return false;
  }

  if (pathname.startsWith('/products')) {
    return false;
  }

  if (isAdminPath(pathname)) {
    return false;
  }

  return true;
}
