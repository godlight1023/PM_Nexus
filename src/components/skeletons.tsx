export function ContentStreamSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <div className="h-6 w-1/3 bg-zinc-800 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
