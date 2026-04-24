"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Recommendation } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { useSetAlbumStatus, useImportAlbum } from "@/hooks/useAlbums";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  rec: Recommendation;
  index: number;
  maxScore: number;
}

export function RecommendationCard({ rec, index, maxScore }: RecommendationCardProps) {
  const [saved, setSaved] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importedSlug, setImportedSlug] = useState<string | null>(null);
  const { mutate: setStatus } = useSetAlbumStatus();
  const { mutateAsync: importAlbum } = useImportAlbum();

  const percent = Math.round((rec.score / maxScore) * 100);
  const { album, influencedBy } = rec;
  const sameArtist =
    influencedBy.matchingGenres.length === 0 ||
    influencedBy.album.artist.slug === album.artist.slug;

  const inSystem = album.inHumix !== false || !!importedSlug;
  const albumSlug = importedSlug ?? album.slug;

  const handleSave = () => {
    if (saved) return;
    setAnimating(true);
    setSaved(true);
    setStatus({ albumId: album.id, status: "WANT_TO_LISTEN" });
    setTimeout(() => setAnimating(false), 600);
  };

  const handleImport = async () => {
    if (!album.spotifyId || importing) return;
    setImporting(true);
    try {
      const imported = await importAlbum(album.spotifyId);
      setImportedSlug(imported.slug);
      setSaved(true);
      toast.success(`"${album.title}" adicionado ao catálogo!`, {
        label: "Ver álbum",
        href: `/albums/${imported.slug}`,
      });
    } catch {
      toast.error("Não foi possível adicionar o álbum.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      className="group relative bg-surface-2 rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/[0.08] transition-all"
    >
      {/* Relevance bar — top edge */}
      <div className="h-[2px] bg-surface-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-hover"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, delay: index * 0.05 + 0.2, ease: "easeOut" }}
        />
      </div>

      <div className="p-4">
        {/* Album header */}
        <div className="flex gap-4">
          {/* Cover */}
          {inSystem ? (
            <Link href={`/albums/${albumSlug}`} className="shrink-0">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg shadow-black/40">
                {album.coverUrl ? (
                  <Image src={album.coverUrl} alt={album.title} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-3" />
                )}
              </div>
            </Link>
          ) : (
            <div className="shrink-0">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg shadow-black/40">
                {album.coverUrl ? (
                  <Image src={album.coverUrl} alt={album.title} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-3" />
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            {inSystem ? (
              <Link
                href={`/albums/${albumSlug}`}
                className="text-sm font-bold text-foreground leading-snug hover:text-accent transition-colors line-clamp-2"
              >
                {album.title}
              </Link>
            ) : (
              <span className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                {album.title}
              </span>
            )}
            <Link
              href={`/artists/${album.artist.slug}`}
              className="text-xs text-muted hover:text-foreground-dim transition-colors mt-0.5 block"
            >
              {album.artist.name}
              {album.releaseYear && (
                <span className="text-muted/60"> · {album.releaseYear}</span>
              )}
            </Link>

            {/* Genres */}
            {album.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {album.genres.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent/80"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Rating row */}
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={album.avgRating} readonly size="sm" />
              <span className="text-xs text-muted">
                {album.avgRating.toFixed(1)} · {album.reviewCount}{" "}
                {album.reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          {/* Relevance badge */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
              <Sparkles size={10} />
              {percent}%
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-white/[0.05]" />

        {/* InfluencedBy */}
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden relative shadow">
            {influencedBy.album.coverUrl ? (
              <Image
                src={influencedBy.album.coverUrl}
                alt={influencedBy.album.title}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-3" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted leading-tight mb-0.5">
              Porque você curtiu
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/albums/${influencedBy.album.slug}`}
                className="text-xs font-semibold text-foreground-dim hover:text-foreground transition-colors truncate max-w-[140px]"
              >
                {influencedBy.album.title}
              </Link>
              <div className="flex items-center gap-0.5 shrink-0">
                <StarRating value={influencedBy.rating} readonly size="sm" />
              </div>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {influencedBy.matchingGenres.length > 0
                ? `Gêneros em comum: ${influencedBy.matchingGenres.join(", ")}`
                : sameArtist
                ? `Outro álbum de ${influencedBy.album.artist.name}`
                : "Afinidade de gosto"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {inSystem ? (
            <>
              <button
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center",
                  saved
                    ? "bg-pink-400/15 text-pink-400 border border-pink-400/20"
                    : "bg-white/5 hover:bg-pink-400/10 text-muted hover:text-pink-400 border border-white/[0.06] hover:border-pink-400/20"
                )}
              >
                <motion.div
                  animate={animating ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Heart size={14} className={cn("transition-all", saved && "fill-pink-400")} />
                </motion.div>
                {saved ? "Adicionado à lista" : "Quero ouvir"}
              </button>
              <Link
                href={`/albums/${albumSlug}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-foreground bg-white/5 hover:bg-white/8 border border-white/[0.06] transition-all"
              >
                Ver álbum <ChevronRight size={13} />
              </Link>
            </>
          ) : (
            <button
              onClick={handleImport}
              disabled={importing || !album.spotifyId}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center",
                "bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40",
                (importing || !album.spotifyId) && "opacity-60 cursor-not-allowed"
              )}
            >
              {importing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              {importing ? "Adicionando..." : "Adicionar ao catálogo"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
