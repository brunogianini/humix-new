"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Disc3, Users, ArrowRight } from "lucide-react";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { AlbumCardSkeleton } from "@/components/ui/Skeleton";
import { useAlbums } from "@/hooks/useAlbums";
import { useTopAlbums, useTopArtists } from "@/hooks/useStats";
import { formatRating } from "@/lib/utils";
import Image from "next/image";

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            Ver todos <ArrowRight size={13} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { data: newAlbums, isLoading: loadingNew } = useAlbums({ limit: 8, sort: "createdAt", order: "desc" });
  const { data: topAlbums, isLoading: loadingTop } = useTopAlbums(5);
  const { data: topArtists, isLoading: loadingArtists } = useTopArtists(5);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-accent/20 via-surface-2 to-surface-2"
      >
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
          Bem-vindo
        </p>
        <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
          Sua coleção musical,<br />organizada.
        </h1>
        <p className="text-foreground-dim text-sm max-w-md">
          Gerencie álbuns, escreva reviews e acompanhe sua jornada musical.
        </p>
        <div className="flex gap-3 mt-5">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-accent/25"
          >
            <Disc3 size={16} />
            Buscar álbum
          </Link>
        </div>
      </motion.div>

      {/* New Additions */}
      <Section title="Adicionados recentemente" href="/search">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loadingNew
            ? Array.from({ length: 8 }).map((_, i) => <AlbumCardSkeleton key={i} />)
            : newAlbums?.data.map((album, i) => (
                <AlbumCard key={album.id} album={album} index={i} />
              ))}
        </div>
      </Section>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Top Albums */}
        <Section title="Top álbuns" href="/charts">
          <div className="space-y-1">
            {loadingTop
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-surface-2 animate-pulse" />
                ))
              : topAlbums?.map((album, i) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/albums/${album.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-sm font-bold text-muted/50 w-5 text-center shrink-0">
                        {i + 1}
                      </span>
                      {album.coverUrl && (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={album.coverUrl}
                            alt={album.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                          {album.title}
                        </p>
                        <p className="text-xs text-muted truncate">{album.artist.name}</p>
                      </div>
                      <div className="text-sm font-bold text-accent shrink-0">
                        {formatRating(album.avgRating)}
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </Section>

        {/* Top Artists */}
        <Section title="Artistas em destaque" href="/charts">
          <div className="space-y-1">
            {loadingArtists
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-surface-2 animate-pulse" />
                ))
              : topArtists?.map((artist, i) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-sm font-bold text-muted/50 w-5 text-center shrink-0">
                        {i + 1}
                      </span>
                      {artist.imageUrl ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={artist.imageUrl}
                            alt={artist.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center shrink-0">
                          <Users size={16} className="text-muted" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                          {artist.name}
                        </p>
                        <p className="text-xs text-muted">{artist.reviewCount} reviews</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
