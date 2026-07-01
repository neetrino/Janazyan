'use client';

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`} />;
}

export function OrderDetailsSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      <div className="rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
            <SkeletonBlock className="h-3 w-3/5" />
            <SkeletonBlock className="h-3 w-2/3" />
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
            <SkeletonBlock className="h-3 w-3/5" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4 md:p-6">
        <SkeletonBlock className="mb-4 h-4 w-32" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="mt-3 h-3 w-5/6" />
      </div>

      <div className="rounded-xl border border-gray-200 p-4 md:p-6">
        <SkeletonBlock className="mb-4 h-4 w-24" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="mt-3 h-3 w-2/3" />
      </div>

      <div className="rounded-xl border border-gray-200 p-4 md:p-6">
        <SkeletonBlock className="mb-4 h-4 w-20" />
        <div className="space-y-3">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
