"use client";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Music2,
  Star,
  Users,
  Calendar,
  MessageSquare,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAlbumDetail } from "@/hooks/useAlbums";
import { useAlbumReviews, useCreateReview, useUpdateReview, useDeleteReview } from "@/hooks/useReviews";
import { AlbumStatusMenu } from "@/components/albums/AlbumStatusMenu";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ReviewCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/auth";
import { formatDuration, formatRating, formatDate } from "@/lib/utils";

export default function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: album, isLoading } = useAlbumDetail(slug);
  const { data: reviewsData, isLoading: loadingReviews } = useAlbumReviews(slug);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex gap-6 mb-8">
          <Skeleton className="w-48 h-48 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!album) return null;

  const hasReviewed = !!album.userReview;
  const totalDuration = album.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Album header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 mb-10"
      >
        {/* Cover */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-xl overflow-hidden shrink-0 shadow-2xl shadow-black/60">
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              className="object-cover"
              sizes="192px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-surface-3 flex items-center justify-center">
              <Music2 size={48} className="text-muted" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {album.genres.map((g) => (
              <Badge key={g.id} variant="accent">{g.name}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1 leading-tight">{album.title}</h1>
          <Link
            href={`/artists/${album.artist.slug}`}
            className="text-base text-accent hover:underline font-medium"
          >
            {album.artist.name}
          </Link>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted">
            {album.releaseYear && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {album.releaseYear}
              </span>
            )}
            {album.totalTracks && (
              <span className="flex items-center gap-1.5">
                <Music2 size={13} /> {album.totalTracks} faixas
              </span>
            )}
            {totalDuration > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {formatDuration(totalDuration)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={13} /> {album._count.userAlbums} na coleção
            </span>
          </div>

          {/* Rating stats */}
          {album.stats.reviewCount > 0 && (
            <div className="flex items-center gap-3 mt-3">
              <StarRating value={album.stats.avgRating || 0} readonly size="md" />
              <span className="text-lg font-bold text-foreground">
                {formatRating(album.stats.avgRating || 0)}
              </span>
              <span className="text-sm text-muted">
                ({album.stats.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-5">
            {isAuthenticated && (
              <AlbumStatusMenu
                albumId={album.id}
                currentStatus={album.userAlbum?.status}
              />
            )}
            {isAuthenticated && !hasReviewed && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReviewModalOpen(true)}
              >
                <Star size={14} /> Escrever review
              </Button>
            )}
            {isAuthenticated && hasReviewed && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(true)}>
                  <Edit2 size={13} /> Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
                  <Trash2 size={13} /> Excluir
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Description */}
      {album.description && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 px-1"
        >
          <p className="text-sm text-foreground-dim leading-relaxed">{album.description}</p>
        </motion.div>
      )}

      {/* User's review */}
      {hasReviewed && album.userReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 p-5 rounded-xl bg-accent/8"
        >
          <p className="text-xs text-accent font-semibold mb-3 uppercase tracking-widest">Sua review</p>
          <div className="flex items-center gap-2 mb-2">
            <StarRating value={album.userReview.rating} readonly size="sm" />
            <span className="text-sm font-bold text-foreground">
              {formatRating(album.userReview.rating)}
            </span>
          </div>
          {album.userReview.content && (
            <p className="text-sm text-foreground-dim leading-relaxed">{album.userReview.content}</p>
          )}
          <p className="text-xs text-muted mt-3">{formatDate(album.userReview.createdAt)}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        {/* Tracklist */}
        {album.tracks.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-foreground mb-3">Faixas</h2>
            <div className="space-y-0.5">
              {album.tracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-xs text-muted/50 w-5 text-center shrink-0">
                    {track.number}
                  </span>
                  <span className="text-sm text-foreground-dim group-hover:text-foreground transition-colors flex-1 truncate">
                    {track.title}
                  </span>
                  {track.duration && (
                    <span className="text-xs text-muted/60 shrink-0">
                      {formatDuration(track.duration)}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3">Reviews</h2>
          {loadingReviews ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
            </div>
          ) : reviewsData?.data.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="Sem reviews ainda"
              description="Seja o primeiro a avaliar este álbum."
            />
          ) : (
            <div className="divide-y divide-white/5">
              {reviewsData?.data.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={i}
                  onEdit={review.id === album.userReview?.id ? () => setEditModalOpen(true) : undefined}
                  onDelete={review.id === album.userReview?.id ? () => setDeleteConfirmOpen(true) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Escrever review">
        <ReviewForm
          onSubmit={async (data) => {
            await createReview.mutateAsync({ albumId: album.id, ...data });
            setReviewModalOpen(false);
          }}
          onCancel={() => setReviewModalOpen(false)}
        />
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar review">
        {album.userReview && (
          <ReviewForm
            initialRating={album.userReview.rating}
            initialContent={album.userReview.content || ""}
            submitLabel="Salvar"
            onSubmit={async (data) => {
              await updateReview.mutateAsync({ reviewId: album.userReview!.id, ...data });
              setEditModalOpen(false);
            }}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Excluir review" size="sm">
        <p className="text-sm text-foreground-dim mb-6">
          Tem certeza que deseja excluir sua review? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleteReview.isPending}
            onClick={async () => {
              if (album.userReview) {
                await deleteReview.mutateAsync({ reviewId: album.userReview.id, albumSlug: slug });
                setDeleteConfirmOpen(false);
              }
            }}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
