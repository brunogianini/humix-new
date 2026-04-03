"use client";
import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkPlus, Headphones, CheckCircle, Disc3, StarOff, Star, Shuffle, X } from "lucide-react";
import { useUserAlbums } from "@/hooks/useAlbums";
import { useUserReviews } from "@/hooks/useReviews";
import { AlbumStatus, UserAlbumWithAlbum } from "@/lib/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, statusLabel } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

function LotteryModal({
  album,
  onClose,
  onRedraw,
}: {
  album: UserAlbumWithAlbum;
  onClose: () => void;
  onRedraw: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-surface rounded-2xl p-6 max-w-xs w-full shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <X size={16} />
        </button>

        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">
          🎲 Álbum sorteado
        </p>

        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-2 mb-4 shadow-lg">
          {album.album.coverUrl ? (
            <Image src={album.album.coverUrl} alt={album.album.title} fill className="object-cover" sizes="288px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-3">
              <Disc3 size={48} className="text-muted/30" />
            </div>
          )}
        </div>

        <h2 className="text-base font-bold text-foreground leading-tight mb-0.5">
          {album.album.title}
        </h2>
        <p className="text-sm text-muted mb-1">{album.album.artist.name}</p>
        {album.album.releaseYear && (
          <p className="text-xs text-muted/50 mb-5">{album.album.releaseYear}</p>
        )}

        <div className="flex gap-2">
          <Link href={`/albums/${album.album.slug}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full">
              Ver álbum
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={onRedraw} className="shrink-0">
            <Shuffle size={14} /> Novo
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

type TabValue = AlbumStatus | "ALL" | "SEM_NOTA";

const tabs: { value: TabValue; label: string; icon?: React.ElementType }[] = [
  { value: "ALL", label: "Todos" },
  { value: "WANT_TO_LISTEN", label: "Quero ouvir", icon: BookmarkPlus },
  { value: "LISTENING", label: "Ouvindo", icon: Headphones },
  { value: "LISTENED", label: "Ouvi", icon: CheckCircle },
  { value: "SEM_NOTA", label: "Sem nota", icon: StarOff },
];

const statusBadgeVariant: Record<AlbumStatus, "warning" | "accent" | "success"> = {
  WANT_TO_LISTEN: "warning",
  LISTENING: "accent",
  LISTENED: "success",
};

export default function UserAlbumsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const currentUser = useAuthStore((s) => s.user);
  const isOwn = currentUser?.username === username;

  const [activeTab, setActiveTab] = useState<TabValue>("ALL");
  const [page, setPage] = useState(1);
  const [lottery, setLottery] = useState<UserAlbumWithAlbum | null>(null);

  const isSemNota = activeTab === "SEM_NOTA";

  function handleTabChange(tab: TabValue) {
    setActiveTab(tab);
    setPage(1);
  }

  const statusParam = !isSemNota && activeTab !== "ALL" ? (activeTab as AlbumStatus) : undefined;

  const { data, isLoading } = useUserAlbums(
    username,
    { page, limit: 24, ...(statusParam && { status: statusParam }) },
    { enabled: !isSemNota }
  );

  // Sem nota: álbuns com status LISTENED mas sem review do usuário
  const { data: listenedAll, isLoading: loadingListened } = useUserAlbums(
    username,
    { status: "LISTENED", limit: 100, page: 1 },
    { enabled: isSemNota }
  );
  const { data: reviewsAll, isLoading: loadingReviews } = useUserReviews(
    username,
    { limit: 100 },
    { enabled: isSemNota }
  );

  const unreviewedAlbums = useMemo(() => {
    if (!listenedAll || !reviewsAll) return [];
    const reviewedSlugs = new Set(reviewsAll.data.map((r) => r.album.slug));
    return listenedAll.data.filter((ua) => !reviewedSlugs.has(ua.album.slug));
  }, [listenedAll, reviewsAll]);

  const semNotaLoading = isSemNota && (loadingListened || loadingReviews);

  // Pool de sorteio: álbuns "quero ouvir" do próprio usuário
  const { data: wantToListenPool } = useUserAlbums(
    username,
    { status: "WANT_TO_LISTEN", limit: 100, page: 1 },
    { enabled: isOwn }
  );

  function drawLottery() {
    const pool = wantToListenPool?.data ?? [];
    if (!pool.length) return;
    setLottery(pool[Math.floor(Math.random() * pool.length)]);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Coleção de @{username}</h1>
          <p className="text-sm text-muted">{data?.meta.total ?? 0} álbuns</p>
        </div>
        {isOwn && (
          <Button
            variant="secondary"
            size="sm"
            onClick={drawLottery}
            disabled={!wantToListenPool?.data.length}
          >
            <Shuffle size={14} /> Sortear álbum
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleTabChange(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === value
                ? "bg-accent text-white"
                : "bg-surface-2 text-muted hover:text-foreground hover:bg-surface-3"
            )}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading || semNotaLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : isSemNota ? (
        unreviewedAlbums.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Tudo anotado!"
            description="Todos os álbuns que você ouviu já têm nota."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {unreviewedAlbums.map((ua, i) => (
              <motion.div
                key={ua.album.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/albums/${ua.album.slug}`} className="group block">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-3 mb-2">
                    {ua.album.coverUrl ? (
                      <Image
                        src={ua.album.coverUrl}
                        alt={ua.album.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-3">
                        <Disc3 size={28} className="text-muted/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-1.5 right-1.5">
                      <Badge variant="muted" className="text-[10px] px-1.5 py-0.5 flex items-center gap-0.5">
                        <StarOff size={9} /> Sem nota
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                    {ua.album.title}
                  </p>
                  <p className="text-[11px] text-muted truncate">{ua.album.artist.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )
      ) : (data?.data ?? []).length === 0 ? (
        <EmptyState
          icon={Disc3}
          title="Nenhum álbum aqui"
          description={
            activeTab === "ALL"
              ? "A coleção está vazia."
              : `Nenhum álbum com status "${statusLabel[activeTab as AlbumStatus]}".`
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data!.data.map((ua, i) => (
            <motion.div
              key={ua.album.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/albums/${ua.album.slug}`} className="group block">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-3 mb-2">
                  {ua.album.coverUrl ? (
                    <Image
                      src={ua.album.coverUrl}
                      alt={ua.album.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-3">
                      <Disc3 size={28} className="text-muted/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-1.5 right-1.5">
                    <Badge variant={statusBadgeVariant[ua.status]} className="text-[10px] px-1.5 py-0.5">
                      {statusLabel[ua.status]}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                  {ua.album.title}
                </p>
                <p className="text-[11px] text-muted truncate">{ua.album.artist.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isSemNota && data && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={!data.meta.hasPrev}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl text-sm bg-surface-2 hover:bg-surface-3 text-foreground-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 text-sm text-muted">
            {data.meta.page} / {data.meta.totalPages}
          </span>
          <button
            disabled={!data.meta.hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl text-sm bg-surface-2 hover:bg-surface-3 text-foreground-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Lottery modal */}
      <AnimatePresence>
        {lottery && (
          <LotteryModal
            album={lottery}
            onClose={() => setLottery(null)}
            onRedraw={drawLottery}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
