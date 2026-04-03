import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Album,
  AlbumDetail,
  AlbumStatus,
  PaginatedResponse,
  SpotifySearchResult,
  UserAlbum,
  UserAlbumWithAlbum,
} from "@/lib/types";

export const albumKeys = {
  all: ["albums"] as const,
  list: (params?: object) => [...albumKeys.all, "list", params] as const,
  detail: (slug: string) => [...albumKeys.all, "detail", slug] as const,
  userAlbums: (username: string, params?: object) =>
    ["userAlbums", username, params] as const,
  spotifySearch: (q: string) => ["spotifySearch", q] as const,
};

interface AlbumListParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  artistId?: string;
  year?: number;
  sort?: string;
  order?: string;
}

export function useAlbums(params: AlbumListParams = {}) {
  return useQuery({
    queryKey: albumKeys.list(params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Album>>("/albums", { params });
      return data;
    },
  });
}

export function useAlbumDetail(slug: string) {
  return useQuery({
    queryKey: albumKeys.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<AlbumDetail>(`/albums/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

export function useUserAlbums(username: string, params = {}) {
  return useQuery({
    queryKey: albumKeys.userAlbums(username, params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<UserAlbumWithAlbum>>(
        `/users/${username}/albums`,
        { params }
      );
      return data;
    },
    enabled: !!username,
  });
}

export function useSpotifyArtistAlbums(spotifyArtistId: string | null) {
  return useQuery({
    queryKey: ["spotifyArtistAlbums", spotifyArtistId],
    queryFn: async () => {
      const { data } = await api.get<{ data: SpotifySearchResult[] } | SpotifySearchResult[]>(
        `/spotify/artists/${spotifyArtistId}/albums`
      );
      return Array.isArray(data) ? data : data.data;
    },
    enabled: !!spotifyArtistId,
    staleTime: 60_000,
  });
}

export function useSpotifySearch(q: string) {
  return useQuery({
    queryKey: albumKeys.spotifySearch(q),
    queryFn: async () => {
      const { data } = await api.get<{ data: SpotifySearchResult[] }>("/spotify/search", {
        params: { q, limit: 10 },
      });
      return data.data;
    },
    enabled: q.length > 1,
    staleTime: 30_000,
  });
}

export function useSetAlbumStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ albumId, status }: { albumId: string; status: AlbumStatus }) => {
      const { data } = await api.put<UserAlbum>(`/albums/user/${albumId}`, { status });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
    },
  });
}

export function useRemoveAlbumFromCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (albumId: string) => {
      await api.delete(`/albums/user/${albumId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
    },
  });
}

export function useImportAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (spotifyId: string) => {
      const { data } = await api.post<Album & { alreadyExisted: boolean }>(
        "/albums/import",
        { spotifyId }
      );
      await api.put(`/albums/user/${data.id}`, { status: "WANT_TO_LISTEN" });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
    },
  });
}

export function useAddAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, artist }: { title: string; artist: string }) => {
      const { data } = await api.post<Album & { alreadyExisted: boolean }>("/albums", {
        title,
        artist,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: albumKeys.all });
    },
  });
}
