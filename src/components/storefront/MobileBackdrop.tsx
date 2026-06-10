/**
 * Home mobile gradient + white curve — reused on all storefront mobile pages.
 */
export function MobileBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(139deg,#ecf5ff_2%,#e6cbd5_31%)]">
      <div className="absolute left-0 top-24 h-[84%] w-full rounded-t-[44px] bg-white" />
    </div>
  );
}
