"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle } from "lucide-react";
import { useFeed } from "@/hooks/useReviews";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { ReviewCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

function FeedSkeleton() {
  return (
    <div className="divide-y divide-white/[0.06]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-4 py-4">
          <ReviewCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push("/login");
  }, [hydrated, isAuthenticated, router]);

  const { data, isLoading, isError } = useFeed({ limit: 20 });

  if (!hydrated || !isAuthenticated) return <FeedSkeleton />;

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
        <h1 className="text-base font-bold text-foreground">Feed</h1>
        <p className="text-xs text-muted mt-0.5">Reviews de quem você segue</p>
      </div>

      {/* Content */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-20 text-muted">
          <AlertCircle size={28} className="opacity-30" />
          <p className="text-sm">Não foi possível carregar o feed.</p>
        </div>
      ) : data?.data.length === 0 ? (
        <div className="px-4 py-8">
          <EmptyState
            icon={UserPlus}
            title="Seu feed está vazio"
            description="Siga outros usuários para ver as reviews deles aqui."
            action={
              <Link href="/charts">
                <Button size="sm" variant="secondary">
                  <UserPlus size={14} /> Descobrir usuários
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06]">
          {data?.data.map((review, i) => (
            <FeedPostCard key={review.id} review={review} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
