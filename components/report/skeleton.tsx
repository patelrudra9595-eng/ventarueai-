function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`surface-2 relative overflow-hidden rounded-xl ${className}`}
    >
      <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
    </div>
  );
}

export function ReportSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="surface rounded-2xl p-6">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <Shimmer className="mx-auto h-44 w-44 rounded-full" />
          <div className="space-y-3">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-6 w-3/4" />
            <Shimmer className="h-16 w-full" />
            <Shimmer className="h-9 w-36" />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Shimmer className="h-48" />
        <Shimmer className="h-48" />
      </div>
      <Shimmer className="mt-4 h-64" />
    </div>
  );
}
