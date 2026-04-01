import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PaginatedResponse, Review } from "@/lib/types";
import { albumKeys } from "./useAlbums";
import { useAuthStore } from "@/store/auth";

export const reviewKeys = {
  album: (slug: string, params?: object) => ["reviews", "album", slug, params] as const,
  user: (username: string, params?: object) => ["reviews", "user", username, params] as const,
  feed: (params?: object) => ["reviews", "feed", params] as const,
};

export function useAlbumReviews(albumSlug: string, params = {}) {
  return useQuery({
    queryKey: reviewKeys.album(albumSlug, params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Review>>(
        `/reviews/albums/${albumSlug}/reviews`,
        { params }
      );
      return data;
    },
    enabled: !!albumSlug,
  });
}

export function useUserReviews(username: string, params = {}) {
  return useQuery({
    queryKey: reviewKeys.user(username, params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Review>>(
        `/users/${username}/reviews`,
        { params }
      );
      return data;
    },
    enabled: !!username,
  });
}

export function useFeed(params = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: reviewKeys.feed(params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Review>>("/users/feed", { params });
      return data;
    },
    staleTime: 30_000,
    enabled: isAuthenticated,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      albumId: string;
      rating: number;
      content?: string;
      listenedAt?: string;
    }) => {
      const { data } = await api.post<Review>("/reviews", payload);
      return data;
    },
    onSuccess: (review) => {
      qc.invalidateQueries({ queryKey: reviewKeys.album(review.album.slug) });
      qc.invalidateQueries({ queryKey: albumKeys.detail(review.album.slug) });
      qc.invalidateQueries({ queryKey: reviewKeys.feed() });
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      ...payload
    }: {
      reviewId: string;
      rating?: number;
      content?: string;
      listenedAt?: string;
    }) => {
      const { data } = await api.patch<Review>(`/reviews/${reviewId}`, payload);
      return data;
    },
    onSuccess: (review) => {
      qc.invalidateQueries({ queryKey: reviewKeys.album(review.album.slug) });
      qc.invalidateQueries({ queryKey: albumKeys.detail(review.album.slug) });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, albumSlug }: { reviewId: string; albumSlug: string }) => {
      await api.delete(`/reviews/${reviewId}`);
      return albumSlug;
    },
    onSuccess: (albumSlug) => {
      qc.invalidateQueries({ queryKey: reviewKeys.album(albumSlug) });
      qc.invalidateQueries({ queryKey: albumKeys.detail(albumSlug) });
      qc.invalidateQueries({ queryKey: reviewKeys.feed() });
    },
  });
}
