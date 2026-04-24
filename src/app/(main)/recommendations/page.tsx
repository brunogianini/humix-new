"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Star } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth";

function RecommendationSkeleton() {
  return (
    <div className="bg-surface-2 rounded-2xl overflow-hidden border border-white/[0.04] p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-surface-3 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 bg-surface-3 rounded" />
          <div className="h-3 w-1/2 bg-surface-3 rounded" />
          <div className="flex gap-1 mt-2">
            <div className="h-5 w-16 bg-surface-3 rounded-full" />
            <div className="h-5 w-20 bg-surface-3 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-white/[0.05] pt-3 flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-3 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 bg-surface-3 rounded" />
          <div className="h-3 w-40 bg-surface-3 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push("/login");
  }, [hydrated, isAuthenticated, router]);

  const { data: recommendations, isLoading, isError } = useRecommendations(20);

  const maxScore = recommendations?.[0]?.score ?? 1;

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6 space-y-2">
          <div className="h-7 w-40 bg-surface-3 rounded animate-pulse" />
          <div className="h-4 w-56 bg-surface-3 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <RecommendationSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
          <Sparkles size={22} className="text-accent" />
          Para você
        </h1>
        <p className="text-sm text-muted">
          Álbuns recomendados com base no que você já ouviu e avaliou.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <RecommendationSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-20 text-muted">
          <AlertCircle size={28} className="opacity-30" />
          <p className="text-sm">Não foi possível carregar as recomendações.</p>
        </div>
      ) : !recommendations || recommendations.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Ainda não há recomendações"
          description="Avalie alguns álbuns para que possamos sugerir músicas pra você."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {recommendations.map((rec, i) => (
            <RecommendationCard
              key={`${rec.album.id}-${i}`}
              rec={rec}
              index={i}
              maxScore={maxScore}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
