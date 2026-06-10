import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
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
        <div className="mx-auto max-w-3xl pb-12 pt-8 md:pt-12">
          <FaqPageHeaderSkeleton />
          <FaqPageMainSkeleton />
          <FaqPageFooterSkeleton />
        </div>
      }
    />
  );
}
