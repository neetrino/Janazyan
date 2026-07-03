import { STOREFRONT_MOBILE_BACKDROP_WHITE_TOP_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';

type MobileBackdropProps = {
  /** When true, the white curve fills to the bottom. Home omits this to keep the pink band. */
  extendWhiteToBottom?: boolean;
  /** When true, white curve starts near the top (pages without MobileTopBar). */
  compactTop?: boolean;
};

/** Home mobile — white curve sits below hero chrome. */
const HOME_MOBILE_BACKDROP_WHITE_TOP_CLASS = 'top-24';

/**
 * Mobile gradient + white curve. Home uses the default (84% white); all other pages extend white to the bottom.
 */
export function MobileBackdrop({ extendWhiteToBottom = false, compactTop = false }: MobileBackdropProps) {
  const whiteCurveTopClass = compactTop
    ? 'top-2'
    : extendWhiteToBottom
      ? STOREFRONT_MOBILE_BACKDROP_WHITE_TOP_CLASS
      : HOME_MOBILE_BACKDROP_WHITE_TOP_CLASS;
  const whiteCurveClass = extendWhiteToBottom
    ? `absolute inset-x-0 bottom-0 ${whiteCurveTopClass} rounded-t-[44px] bg-white`
    : `absolute left-0 ${whiteCurveTopClass} h-[84%] w-full rounded-t-[44px] bg-white`;

  return (
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(139deg,#ecf5ff_2%,#e6cbd5_31%)]">
      <div className={whiteCurveClass} />
    </div>
  );
}