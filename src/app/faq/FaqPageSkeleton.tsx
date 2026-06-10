import { FAQ_GLASS_SECTION_CLASS } from '../../features/faq/faq-layout-styles';

export function FaqPageHeaderSkeleton() {
  return (
    <header
      className="mb-10 animate-pulse text-center"
      aria-busy="true"
      aria-label="Loading FAQ header"
    >
      <div className="mx-auto mb-3 h-4 w-16 rounded bg-neutral-200" />
      <div className="mx-auto h-10 w-4/5 max-w-lg rounded bg-neutral-200" />
      <div className="mx-auto mt-4 h-16 w-full max-w-2xl rounded bg-neutral-100" />
    </header>
  );
}

export function FaqPageMainSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Loading FAQ sections">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={`${FAQ_GLASS_SECTION_CLASS} space-y-3 p-6 sm:p-8`}>
          <div className="h-7 w-48 rounded bg-neutral-200" />
          {Array.from({ length: 3 }).map((__, itemIndex) => (
            <div key={itemIndex} className="h-14 rounded-2xl bg-white/60" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FaqPageFooterSkeleton() {
  return (
    <section className="mt-8 animate-pulse rounded-3xl bg-white/40 p-6 sm:p-8" aria-hidden>
      <div className="h-7 w-56 rounded bg-neutral-200" />
      <div className="mt-2 h-12 w-full max-w-md rounded bg-neutral-100" />
      <div className="mt-5 flex gap-4">
        <div className="h-5 w-24 rounded bg-neutral-200" />
        <div className="h-5 w-28 rounded bg-neutral-200" />
      </div>
    </section>
  );
}
