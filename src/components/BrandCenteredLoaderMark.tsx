import Image from 'next/image';
import {
  BRAND_CENTERED_LOADER_LOGO_SIZE_PX,
  BRAND_CENTERED_LOADER_LOGO_SRC,
  BRAND_CENTERED_LOADER_LOGO_WRAP_CLASS,
  BRAND_CENTERED_LOADER_MARK_CLASS,
  BRAND_CENTERED_LOADER_RING_CLASS,
  BRAND_CENTERED_LOADER_RING_SIZE_CLASS,
} from './brand-centered-loader.constants';

type BrandCenteredLoaderMarkProps = {
  /** Optional visible caption under the logo. */
  label?: string;
};

/**
 * Circular brand logo with a spinner ring around it (centered composition).
 */
export function BrandCenteredLoaderMark({ label }: BrandCenteredLoaderMarkProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${BRAND_CENTERED_LOADER_MARK_CLASS} ${BRAND_CENTERED_LOADER_RING_SIZE_CLASS}`}>
        <span className={BRAND_CENTERED_LOADER_RING_CLASS} aria-hidden />
        <span className={BRAND_CENTERED_LOADER_LOGO_WRAP_CLASS} aria-hidden>
          <Image
            src={BRAND_CENTERED_LOADER_LOGO_SRC}
            alt=""
            width={BRAND_CENTERED_LOADER_LOGO_SIZE_PX}
            height={BRAND_CENTERED_LOADER_LOGO_SIZE_PX}
            className="h-full w-full object-contain"
            priority
          />
        </span>
      </div>
      {label ? <span className="text-sm font-medium text-gray-800">{label}</span> : null}
    </div>
  );
}
