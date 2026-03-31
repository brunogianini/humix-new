"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, Disc3, Music2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ArtistWithDiscography } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { Skeleton, AlbumCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function useArtist(slug: string) {
  return useQuery({
    queryKey: ["artists", "detail", slug],
    queryFn: async () => {
      const { data } = await api.get<ArtistWithDiscography>(`/artists/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

export default function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: artist, isLoading } = useArtist(slug);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-6 mb-8">
          <Skeleton className="w-36 h-36 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 pt-4">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <AlbumCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!artist) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 mb-8"
      >
        {/* Image */}
        <div className="relative w-36 h-36 rounded-full overflow-hidden shrink-0 shadow-2xl shadow-black/50 ring-2 ring-border">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="144px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-surface-3 flex items-center justify-center">
              <Music2 size={40} className="text-muted" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {artist.genres.map((g) => (
              <Badge key={g.id} variant="accent">{g.name}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{artist.name}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            {artist.country && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {artist.country}
              </span>
            )}
            {artist.formedYear && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {artist.formedYear}
                {artist.dissolvedYear && ` – ${artist.dissolvedYear}`}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Disc3 size={14} /> {artist._count.albums} álbuns
            </span>
          </div>

          {artist.bio && (
            <p className="mt-3 text-sm text-foreground-dim leading-relaxed line-clamp-3">
              {artist.bio}
            </p>
          )}
        </div>
      </motion.div>

      {/* Discography */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Disc3 size={16} className="text-accent" /> Discografia
        </h2>
        {artist.albums.length === 0 ? (
          <EmptyState icon={Disc3} title="Sem álbuns cadastrados" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {artist.albums.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/albums/${album.slug}`} className="group block">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-2 mb-2">
                    {album.coverUrl ? (
                      <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-3">
                        <Disc3 size={32} className="text-border" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                    {album.title}
                  </p>
                  {album.releaseYear && (
                    <p className="text-xs text-muted">{album.releaseYear}</p>
                  )}

                  {!album.inHumix && (
                    <Badge variant="default" className="bg-purple-600 text-white">
                      Não adicionado 
                    </Badge>
                  )}

                  
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
