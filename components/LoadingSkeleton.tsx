interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
          <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
          <div className="flex gap-1">
            <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
