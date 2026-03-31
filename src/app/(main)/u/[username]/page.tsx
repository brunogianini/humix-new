"use client";
import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, BookOpen, UserPlus, UserMinus, Settings } from "lucide-react";
import { useUserProfile } from "@/hooks/useUsers";
import { useUserReviews } from "@/hooks/useReviews";
import { useUserStats } from "@/hooks/useStats";
import { useFollow, useUnfollow } from "@/hooks/useUsers";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewCardSkeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth";
import { formatRating, formatDate } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted mt-0.5">{label}</p>
    </div>
  );
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const currentUser = useAuthStore((s) => s.user);
  const isOwn = currentUser?.username === username;

  const { data: profile, isLoading } = useUserProfile(username);
  const { data: reviews, isLoading: loadingReviews } = useUserReviews(username, { limit: 6 });
  const { data: stats } = useUserStats(username);

  const follow = useFollow();
  const unfollow = useUnfollow();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-surface-3 animate-pulse shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-6 w-1/3 bg-surface-3 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-surface-3 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isFollowing = profile.isFollowing;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-5 mb-10"
      >
        <Avatar
          src={profile.avatarUrl}
          name={profile.displayName || profile.username}
          size="xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {profile.displayName || profile.username}
                {profile.isVerified && (
                  <span className="ml-2 text-accent text-base">✓</span>
                )}
              </h1>
              <p className="text-sm text-muted mt-0.5">@{profile.username}</p>
            </div>
            <div className="flex gap-2">
              {isOwn ? (
                <Link href="/settings">
                  <Button variant="secondary" size="sm">
                    <Settings size={13} /> Editar perfil
                  </Button>
                </Link>
              ) : currentUser && (
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  size="sm"
                  loading={follow.isPending || unfollow.isPending}
                  onClick={() =>
                    isFollowing
                      ? unfollow.mutate(username)
                      : follow.mutate(username)
                  }
                >
                  {isFollowing ? (
                    <><UserMinus size={13} /> Deixar de seguir</>
                  ) : (
                    <><UserPlus size={13} /> Seguir</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="mt-2 text-sm text-foreground-dim leading-relaxed">{profile.bio}</p>
          )}

          <div className="flex gap-5 mt-3 text-sm text-muted">
            <span>
              <span className="font-semibold text-foreground">{profile._count.followers}</span>{" "}
              seguidores
            </span>
            <span>
              <span className="font-semibold text-foreground">{profile._count.following}</span>{" "}
              seguindo
            </span>
            <span className="text-xs">desde {formatDate(profile.createdAt)}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="flex gap-8 mb-10 px-1"
        >
          <Stat label="Reviews" value={stats.reviewCount} />
          <Stat label="Ouvidos" value={stats.totalListened} />
          <Stat
            label="Nota média"
            value={stats.avgRating ? formatRating(stats.avgRating) : "—"}
          />
          {stats.currentStreak > 0 && (
            <Stat label="Streak" value={`🔥 ${stats.currentStreak}d`} />
          )}
        </motion.div>
      )}

      {/* Top genres */}
      {stats && stats.topGenres.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
            Gêneros favoritos
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.topGenres.slice(0, 6).map((g) => (
              <Badge key={g.id} variant="muted">
                {g.name}
                <span className="ml-1 text-muted/60">{g.count}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Collection link */}
      <Link
        href={`/u/${username}/albums`}
        className="flex items-center justify-between px-5 py-4 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors mb-10 group"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={17} className="text-accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">Coleção de álbuns</p>
            <p className="text-xs text-muted mt-0.5">{profile._count.reviews} álbuns revisados</p>
          </div>
        </div>
        <span className="text-muted group-hover:text-foreground transition-colors text-sm">→</span>
      </Link>

      {/* Recent reviews */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-5">Últimas reviews</h2>
        {loadingReviews ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
          </div>
        ) : reviews?.data.length === 0 ? (
          <EmptyState icon={Star} title="Sem reviews ainda" />
        ) : (
          <div className="divide-y divide-white/5">
            {reviews?.data.map((review, i) => (
              <ReviewCard key={i} review={review} showAlbum />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
