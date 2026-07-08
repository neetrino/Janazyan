import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { STOREFRONT_PAGE_CONTENT_TOP_PADDING_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';
import {
  FaqPageFooterSkeleton,
  FaqPageHeaderSkeleton,
  FaqPageMainSkeleton,
} from './FaqPageSkeleton';

/** Instant shell on client navigation — no async work before paint. */
export default function FaqLoading() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="FAQ"
      catalog={
        <div className={`mx-auto max-w-3xl pb-12 ${STOREFRONT_PAGE_CONTENT_TOP_PADDING_CLASS}`}>
          <FaqPageHeaderSkeleton />
          <FaqPageMainSkeleton />
          <FaqPageFooterSkeleton />
        </div>
      }
    />
  );
}
