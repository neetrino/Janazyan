import Link from 'next/link';
import type { LanguageCode } from '../../lib/language';
import { t } from '../../lib/i18n';
import { PRODUCTS_PAGE_SHOP_BREADCRUMB_CLASS } from '../../app/products/products-page-layout.constants';

type ProductsShopBreadcrumbProps = {
  language: LanguageCode;
};

/** Figma shop hero breadcrumb — node 269:900. */
export function ProductsShopBreadcrumb({ language }: ProductsShopBreadcrumbProps) {
  const homeLabel = t(language, 'common.navigation.home');
  const shopLabel = t(language, 'common.footer.shop');

  return (
    <nav aria-label={shopLabel} className={PRODUCTS_PAGE_SHOP_BREADCRUMB_CLASS}>
      <Link
        href="/"
        className="font-normal text-white/65 transition-opacity hover:opacity-90"
      >
        {homeLabel}
      </Link>
      <span aria-hidden className="font-bold text-white">
        {' / '}
        {shopLabel}
      </span>
    </nav>
  );
}
