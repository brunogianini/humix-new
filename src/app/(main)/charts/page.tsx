"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Disc3, Users, Tag } from "lucide-react";
import { useTopAlbums, useTopArtists, useTopGenres } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { formatRating } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";

type Tab = "albums" | "artists" | "genres";

const tabs: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: "albums", label: "Álbuns", icon: Disc3 },
  { value: "artists", label: "Artistas", icon: Users },
  { value: "genres", label: "Gêneros", icon: Tag },
];

export default function ChartsPage() {
  const [tab, setTab] = useState<Tab>("albums");

  const { data: albums, isLoading: loadingAlbums } = useTopAlbums(20);
  const { data: artists, isLoading: loadingArtists } = useTopArtists(20);
  const { data: genres, isLoading: loadingGenres } = useTopGenres(20);

  const isLoading =
    (tab === "albums" && loadingAlbums) ||
    (tab === "artists" && loadingArtists) ||
    (tab === "genres" && loadingGenres);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Rankings</h1>
        <p className="text-sm text-muted">Os mais populares da comunidade.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/5">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === value
                ? "text-foreground border-accent"
                : "text-muted border-transparent hover:text-foreground-dim"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-0.5">
          {/* Albums */}
          {tab === "albums" &&
            albums?.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/albums/${album.slug}`}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm font-bold text-muted/40 w-6 text-center shrink-0">
                    {i + 1}
                  </span>
                  {album.coverUrl && (
                    <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-muted truncate">{album.artist.name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <StarRating value={album.avgRating} readonly size="sm" />
                      <span className="text-sm font-bold text-accent">
                        {formatRating(album.avgRating)}
                      </span>
                    </div>
                    <p className="text-xs text-muted/60 mt-0.5">{album.reviewCount} reviews</p>
                  </div>
                </Link>
              </motion.div>
            ))}

          {/* Artists */}
          {tab === "artists" &&
            artists?.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/artists/${artist.slug}`}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm font-bold text-muted/40 w-6 text-center shrink-0">
                    {i + 1}
                  </span>
                  {artist.imageUrl ? (
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-surface-3 flex items-center justify-center shrink-0">
                      <Users size={18} className="text-muted" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {artist.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {artist.genres.slice(0, 2).map((g) => (
                        <Badge key={g.id} variant="muted" className="text-[10px] px-1.5 py-0">
                          {g.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-accent">{formatRating(artist.avgRating)}</p>
                    <p className="text-xs text-muted/60 mt-0.5">{artist.reviewCount} reviews</p>
                  </div>
                </Link>
              </motion.div>
            ))}

          {/* Genres */}
          {tab === "genres" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {genres?.map((genre, i) => (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{genre.name}</p>
                    <p className="text-xs text-muted mt-0.5">{genre.albumCount} álbuns</p>
                  </div>
                  <span className="text-2xl font-black text-white/8">
                    {i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
