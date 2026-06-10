import { MAP_HEIGHT_PX } from '../../features/stores/constants';

/**
 * Hero copy placeholder — synchronous on client navigation.
 */
export function StoresPageHeaderSkeleton() {
  return (
    <section className="animate-pulse py-8 md:py-12" aria-busy="true" aria-label="Loading stores header">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-4 w-32 rounded bg-neutral-200" />
          <div className="mx-auto mt-3 h-10 w-4/5 max-w-lg rounded bg-neutral-200" />
          <div className="mx-auto mt-4 h-16 w-full max-w-2xl rounded bg-neutral-100" />
        </div>
      </div>
    </section>
  );
}

/**
 * Carousel + map placeholder while store list streams in.
 */
export function StoresPageMainSkeleton() {
  return (
    <section className="animate-pulse pb-10 md:pb-16" aria-busy="true" aria-label="Loading stores">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="h-8 w-48 rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-64 rounded bg-neutral-100" />
            <div className="mt-6 flex justify-center gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 w-36 rounded-2xl bg-neutral-200 sm:h-56 sm:w-44"
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="mb-4 h-8 w-40 rounded bg-neutral-200" />
            <div
              className="rounded-2xl bg-neutral-100"
              style={{ minHeight: MAP_HEIGHT_PX }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoresPageFooterSkeleton() {
  return (
    <section className="animate-pulse border-t border-gray-100 py-14 md:py-16" aria-hidden>
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-8 w-64 rounded bg-neutral-200" />
        <div className="mx-auto mt-3 h-12 w-full max-w-md rounded bg-neutral-100" />
        <div className="mx-auto mt-6 h-12 w-40 rounded-full bg-neutral-200" />
      </div>
    </section>
  );
}
