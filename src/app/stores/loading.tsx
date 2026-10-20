import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { STORES_PAGE_CATALOG_BOTTOM_PADDING_CLASS } from './StoresPageSections';
import {
  StoresPageFooterSkeleton,
  StoresPageHeaderSkeleton,
  StoresPageMainSkeleton,
} from './StoresPageSkeleton';

/** Instant shell on client navigation — no async work before paint. */
export default function StoresLoading() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="Our stores"
      catalogBottomPaddingClassName={STORES_PAGE_CATALOG_BOTTOM_PADDING_CLASS}
      catalog={
        <>
          <StoresPageHeaderSkeleton />
          <StoresPageMainSkeleton />
          <StoresPageFooterSkeleton />
        </>
      }
    />
  );
}
