interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-44 overflow-hidden rounded-2xl bg-white border border-gray-100 animate-pulse"
        >
          {/* Left info placeholder */}
          <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
            <div className="h-3 w-10 bg-gray-200 rounded" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
            <div className="h-2.5 w-full bg-gray-100 rounded-full" />
          </div>
          {/* Right image placeholder */}
          <div className="w-40 flex-shrink-0 bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
