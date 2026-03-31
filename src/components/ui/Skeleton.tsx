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
    <div className="flex gap-3 px-4 py-3">
      <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-full mt-1" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
