export default function Loading() {
  return (
    <>
      {/* Header skeleton */}
      <header className="border-b border-border bg-card/80 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
        </div>
      </header>

      {/* Filter skeleton */}
      <div className="mx-auto flex max-w-6xl gap-2 px-4 pt-4 sm:px-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-16 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>

      {/* Card skeleton grid */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 py-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex gap-2">
              <div className="h-5 w-12 animate-pulse rounded bg-muted" />
              <div className="h-5 w-12 animate-pulse rounded bg-muted" />
              <div className="ml-auto h-5 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-auto border-t border-border pt-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
