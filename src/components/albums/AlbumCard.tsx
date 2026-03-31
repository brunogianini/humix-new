"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, BookmarkPlus, Headphones, CheckCircle } from "lucide-react";
import { Album, AlbumStatus } from "@/lib/types";
import { cn, formatRating, statusLabel } from "@/lib/utils";

interface AlbumCardProps {
  album: Album;
  userStatus?: AlbumStatus | null;
  index?: number;
}

const statusIcons = {
  WANT_TO_LISTEN: BookmarkPlus,
  LISTENING: Headphones,
  LISTENED: CheckCircle,
};

const statusColors = {
  WANT_TO_LISTEN: "text-warning",
  LISTENING: "text-accent",
  LISTENED: "text-success",
};

export function AlbumCard({ album, userStatus, index = 0 }: AlbumCardProps) {
  const StatusIcon = userStatus ? statusIcons[userStatus] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/albums/${album.slug}`} className="group block">
        <div className="relative">
          {/* Cover */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-3 mb-3">
            {album.coverUrl ? (
              <Image
                src={album.coverUrl}
                alt={album.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 6}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-3 to-surface-2">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-muted/30" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

            {/* Status badge */}
            {StatusIcon && (
              <div className="absolute top-2 right-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center",
                    statusColors[userStatus!]
                  )}
                >
                  <StatusIcon size={12} />
                </div>
              </div>
            )}

            {/* Review count */}
            {album._count.reviews > 0 && (
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <Star size={10} className="text-accent fill-accent" />
                  <span className="text-xs text-white font-medium">
                    {album._count.reviews}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
              {album.title}
            </h3>
            <p className="text-xs text-muted truncate">{album.artist.name}</p>
            {album.releaseYear && (
              <p className="text-xs text-muted/50">{album.releaseYear}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
