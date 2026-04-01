"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rss, UserPlus, AlertCircle } from "lucide-react";
import { useFeed } from "@/hooks/useReviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

export default function FeedPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const { data, isLoading, isError } = useFeed({ limit: 20 });

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Rss size={22} className="text-accent" /> Feed
        </h1>
        <p className="text-sm text-muted">Reviews de quem você segue.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted">
          <AlertCircle size={32} className="opacity-40" />
          <p className="text-sm">Não foi possível carregar o feed.</p>
        </div>
      ) : data?.data.length === 0 ? (
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
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {data?.data.map((review, i) => (
            <ReviewCard key={review.id} review={review} showAlbum index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
