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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      className="bg-surface-2 border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href={`/u/${review.user?.username}`} className="flex items-center gap-3 min-w-0">
          <Avatar
            src={review.user?.avatarUrl}
            name={review.user?.displayName || review.user?.username || ""}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              {review.user?.displayName || review.user?.username}
            </p>
            <p className="text-xs text-muted truncate">
              @{review.user?.username} · {formatRelativeDate(review.createdAt)}
            </p>
          </div>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-3 transition-colors"
              >
                <Edit2 size={13} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Album strip */}
      {showAlbum && (
        <Link
          href={`/albums/${review.album.slug}`}
          className="flex items-center gap-3 mx-4 mb-3 p-3 bg-surface-3 rounded-xl border border-border hover:border-border-light transition-colors"
        >
          {review.album.coverUrl && (
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
              <Image
                src={review.album.coverUrl}
                alt={review.album.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate leading-snug">
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
      )}

      {/* Rating (sem album strip — ex: página do álbum) */}
      {!showAlbum && (
        <div className="px-4 pb-2">
          <StarRating value={review.rating} readonly size="sm" />
        </div>
      )}

      {/* Texto do review */}
      {review.content && (
        <p className="px-4 pb-4 text-sm text-foreground-dim leading-relaxed">
          {review.content}
        </p>
      )}

      {!review.content && <div className="pb-1" />}
    </motion.article>
  );
}
