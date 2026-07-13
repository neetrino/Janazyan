import { BrandCenteredLoaderMark } from './BrandCenteredLoaderMark';
import { BRAND_CENTERED_LOADER_PAGE_CLASS } from './brand-centered-loader.constants';

type BrandCenteredPageLoaderProps = {
  label?: string;
};

/** Full-width centered brand loader for route `loading.tsx` fallbacks. */
export function BrandCenteredPageLoader({ label = 'Loading' }: BrandCenteredPageLoaderProps) {
  return (
    <div className={BRAND_CENTERED_LOADER_PAGE_CLASS} aria-busy="true" aria-label={label}>
      <BrandCenteredLoaderMark />
    </div>
  );
}
