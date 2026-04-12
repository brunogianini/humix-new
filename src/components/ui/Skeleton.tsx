import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface-3",
        "after:absolute after:inset-0 after:bg-shimmer after:bg-[length:200%_100%] after:animate-shimmer",
        className
      )}
    />
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-surface-2 border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-1/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      {/* Album strip */}
      <div className="mx-4 mb-3 p-3 bg-surface-3 rounded-xl border border-border flex items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-3 w-1/3 mt-1" />
        </div>
      </div>
      {/* Content */}
      <div className="px-4 pb-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
