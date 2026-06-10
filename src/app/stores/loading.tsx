import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
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
