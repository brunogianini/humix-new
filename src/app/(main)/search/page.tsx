"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Disc3, ExternalLink, CheckCircle, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlbumCard } from "@/components/albums/AlbumCard";
import { AlbumCardSkeleton } from "@/components/ui/Skeleton";
import { useSpotifySearch, useImportAlbum, useAlbums } from "@/hooks/useAlbums";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"catalog" | "spotify">("catalog");
  const [importingId, setImportingId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 400);
  const router = useRouter();

  const { data: catalogData, isLoading: loadingCatalog } = useAlbums({
    search: mode === "catalog" ? debouncedQuery : undefined,
    limit: 20,
  });

  const { data: spotifyResults, isLoading: loadingSpotify } = useSpotifySearch(
    mode === "spotify" ? debouncedQuery : ""
  );

  const importAlbum = useImportAlbum();

  const handleImport = useCallback(
    async (spotifyId: string, importedSlug: string | null) => {
      if (importedSlug) {
        router.push(`/albums/${importedSlug}`);
        return;
      }
      setImportingId(spotifyId);
      try {
        const album = await importAlbum.mutateAsync(spotifyId);
        router.push(`/albums/${album.slug}`);
      } catch {
        setImportingId(null);
      }
    },
    [importAlbum, router]
  );

  const isLoading = mode === "catalog" ? loadingCatalog : loadingSpotify;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Buscar álbuns</h1>
        <p className="text-foreground-dim text-sm">
          Pesquise no catálogo ou importe direto do Spotify.
        </p>
      </div>

      {/* Search input + mode toggle */}
      <div className="space-y-3 mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === "catalog"
              ? "Buscar no catálogo..."
              : "Buscar no Spotify (ex: OK Computer)..."
          }
          leftIcon={<Search size={16} />}
          rightElement={
            isLoading && debouncedQuery ? <Loader2 size={16} className="animate-spin text-muted" /> : undefined
          }
          className="text-base"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setMode("catalog")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "catalog"
                ? "bg-accent text-white"
                : "bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => setMode("spotify")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "spotify"
                ? "bg-accent text-white"
                : "bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            Spotify
          </button>
        </div>
      </div>

      {/* Catalog results */}
      <AnimatePresence mode="wait">
        {mode === "catalog" && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!debouncedQuery ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {loadingCatalog
                  ? Array.from({ length: 8 }).map((_, i) => <AlbumCardSkeleton key={i} />)
                  : catalogData?.data.map((album, i) => (
                      <AlbumCard key={album.id} album={album} index={i} />
                    ))}
              </div>
            ) : catalogData?.data.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <Disc3 size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum álbum encontrado no catálogo.</p>
                <button
                  onClick={() => setMode("spotify")}
                  className="mt-3 text-sm text-accent hover:underline"
                >
                  Buscar no Spotify
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {catalogData?.data.map((album, i) => (
                  <AlbumCard key={album.id} album={album} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Spotify results */}
        {mode === "spotify" && (
          <motion.div
            key="spotify"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {!debouncedQuery && (
              <p className="text-center text-muted py-16 text-sm">
                Digite para buscar no Spotify
              </p>
            )}
            {loadingSpotify && debouncedQuery && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-surface-2 animate-pulse" />
                ))}
              </div>
            )}
            {spotifyResults?.map((result, i) => {
              const isImporting = importingId === result.spotifyId;
              return (
                <motion.div
                  key={result.spotifyId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {result.coverUrl && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={result.coverUrl}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {result.title}
                      </p>
                      {result.alreadyImported && (
                        <Badge variant="success">
                          <CheckCircle size={10} /> No catálogo
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{result.artist.name}</p>
                    <p className="text-xs text-muted/60">
                      {result.releaseYear} · {result.totalTracks} faixas
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={result.alreadyImported ? "secondary" : "primary"}
                    loading={isImporting}
                    onClick={() => handleImport(result.spotifyId, result.importedSlug)}
                    className="shrink-0"
                  >
                    {result.alreadyImported ? (
                      <>
                        <ExternalLink size={13} /> Ver álbum
                      </>
                    ) : (
                      <>
                        <Plus size={13} /> Importar
                      </>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
