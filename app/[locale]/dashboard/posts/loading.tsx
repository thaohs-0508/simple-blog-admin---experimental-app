export default function RenderPostsLoading() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3 mx-auto" />
      </div>

      {/* Button skeleton */}
      <div className="flex justify-end mb-6">
        <div className="h-10 w-32 bg-blue-200 rounded animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <article className="mt-12 grid gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gray-200 animate-pulse" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>

              {/* Actions skeleton */}
              <div className="flex gap-2 pt-4">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </article>
    </div>
  );
}
