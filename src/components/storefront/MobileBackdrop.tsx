type MobileBackdropProps = {
  /** When true, the white curve fills to the bottom. Home omits this to keep the pink band. */
  extendWhiteToBottom?: boolean;
};

/**
 * Mobile gradient + white curve. Home uses the default (84% white); all other pages extend white to the bottom.
 */
export function MobileBackdrop({ extendWhiteToBottom = false }: MobileBackdropProps) {
  const whiteCurveClass = extendWhiteToBottom
    ? 'absolute inset-x-0 bottom-0 top-24 rounded-t-[44px] bg-white'
    : 'absolute left-0 top-24 h-[84%] w-full rounded-t-[44px] bg-white';

  return (
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(139deg,#ecf5ff_2%,#e6cbd5_31%)]">
      <div className={whiteCurveClass} />
    </div>
  );
}