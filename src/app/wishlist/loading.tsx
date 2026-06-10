export default function WishlistLoading() {
  return (
    <div className="mx-auto max-w-7xl py-4 lg:px-8 lg:py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[347px] bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
