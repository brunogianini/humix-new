"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { Review } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { formatRelativeDate, cn } from "@/lib/utils";
import { useSetAlbumStatus } from "@/hooks/useAlbums";

interface FeedPostCardProps {
  review: Review;
  index?: number;
}

export function FeedPostCard({ review, index = 0 }: FeedPostCardProps) {
  const [saved, setSaved] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { mutate: setStatus } = useSetAlbumStatus();

  const handleSave = () => {
    if (saved) return;
    setAnimating(true);
    setSaved(true);
    setStatus({ albumId: review.album.id, status: "WANT_TO_LISTEN" });
    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="flex gap-3 px-4 py-4 hover:bg-white/[0.02] transition-colors cursor-default"
    >
      {/* Avatar column */}
      <div className="shrink-0 pt-0.5">
        <Link href={`/u/${review.user?.username}`}>
          <Avatar
            src={review.user?.avatarUrl}
            name={review.user?.displayName || review.user?.username || ""}
            size="md"
          />
        </Link>
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-1.5 flex-wrap mb-2">
          <Link
            href={`/u/${review.user?.username}`}
            className="font-semibold text-sm text-foreground hover:underline"
          >
            {review.user?.displayName || review.user?.username}
          </Link>
          <span className="text-xs text-muted">
            @{review.user?.username}
          </span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">
            {formatRelativeDate(review.createdAt)}
          </span>
        </div>

        {/* Album card */}
        <Link
          href={`/albums/${review.album.slug}`}
          className="group flex items-center gap-3 mb-3 p-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all"
        >
          {review.album.coverUrl ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-lg">
              <Image
                src={review.album.coverUrl}
                alt={review.album.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface-3 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate leading-snug group-hover:text-accent transition-colors">
              {review.album.title}
            </p>
            <p className="text-xs text-muted truncate mt-0.5">
              {review.album.artist.name}
            </p>
            <div className="mt-1.5">
              <StarRating value={review.rating} readonly size="sm" />
            </div>
          </div>
        </Link>

        {/* Review text */}
        {review.content && (
          <p className="text-sm text-foreground-dim leading-relaxed mb-3">
            {review.content}
          </p>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 -ml-1.5">
          {/* Like = add to list */}
          <button
            onClick={handleSave}
            className={cn(
              "group flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium transition-all",
              saved
                ? "text-pink-400"
                : "text-muted hover:text-pink-400 hover:bg-pink-400/10"
            )}
            title={saved ? "Adicionado à sua lista" : "Quero ouvir"}
          >
            <motion.div
              animate={animating ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Heart
                size={16}
                className={cn("transition-all", saved && "fill-pink-400")}
              />
            </motion.div>
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="text-pink-400"
                >
                  Quero ouvir
                </motion.span>
              ) : (
                <motion.span
                  key="unsaved"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                >
                  Quero ouvir
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Comment (link to album) */}
          <Link
            href={`/albums/${review.album.slug}`}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium text-muted hover:text-sky-400 hover:bg-sky-400/10 transition-all"
            title="Ver álbum"
          >
            <MessageCircle size={16} />
            <span>Comentar</span>
          </Link>

        </div>
      </div>
    </motion.article>
  );
}
