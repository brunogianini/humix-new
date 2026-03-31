"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Edit2 } from "lucide-react";
import { Review } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { formatRelativeDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

interface ReviewCardProps {
  review: Review;
  showAlbum?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  index?: number;
}

export function ReviewCard({ review, showAlbum = false, onEdit, onDelete, index = 0 }: ReviewCardProps) {
  const currentUser = useAuthStore((s) => s.user);
  const isOwner = currentUser?.id === review.user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      className="group relative px-4 py-3 -mx-4 rounded-xl hover:bg-surface-2 transition-colors"
    >
      {/* Album context — feed mode */}
      {showAlbum && (
        <Link
          href={`/albums/${review.album.slug}`}
          className="flex items-center gap-3 mb-3"
        >
          {review.album.coverUrl && (
            <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0">
              <Image
                src={review.album.coverUrl}
                alt={review.album.title}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              {review.album.title}
            </p>
            <p className="text-xs text-muted truncate mt-0.5">
              {review.album.artist.name}
            </p>
          </div>
        </Link>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/u/${review.user?.username}`} className="shrink-0 mt-0.5">
          <Avatar
            src={review.user?.avatarUrl}
            name={review.user?.displayName || review.user?.username || ""}
            size="sm"
          />
        </Link>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Username · date + actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link
                href={`/u/${review.user?.username}`}
                className="text-sm font-semibold text-foreground hover:text-accent transition-colors truncate"
              >
                {review.user?.displayName || review.user?.username}
              </Link>
              <span className="text-muted text-xs shrink-0">·</span>
              <span className="text-xs text-muted shrink-0">
                {formatRelativeDate(review.createdAt)}
              </span>
            </div>

            {isOwner && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-3 transition-colors"
                  >
                    <Edit2 size={12} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mt-1.5">
            <StarRating value={review.rating} readonly size="sm" />
          </div>

          {/* Content */}
          {review.content && (
            <p className="mt-2 text-sm text-foreground-dim leading-relaxed line-clamp-4">
              {review.content}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
