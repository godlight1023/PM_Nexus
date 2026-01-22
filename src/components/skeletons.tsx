import { Skeleton } from "@/components/ui/skeleton";

export function ContentStreamSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-6 w-24 bg-zinc-800" />
        <div className="flex items-center gap-2">
           <Skeleton className="h-2 w-2 rounded-full bg-zinc-800" />
           <Skeleton className="h-3 w-16 bg-zinc-800" />
        </div>
      </div>
      
      <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded bg-zinc-800" />
                <Skeleton className="h-3 w-12 bg-zinc-800" />
              </div>
              <Skeleton className="h-3 w-3 rounded-full bg-zinc-800" />
            </div>
            
            <div>
              <Skeleton className="h-5 w-3/4 mb-2 bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-2/3 mt-1 bg-zinc-800" />
            </div>

            <div className="flex gap-2 mt-1">
              <Skeleton className="h-3 w-10 bg-zinc-800" />
              <Skeleton className="h-3 w-10 bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
