import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { TopAlbum, TopArtist, TopGenre, UserStats, StreakData } from "@/lib/types";

export function useTopAlbums(limit = 10) {
  return useQuery({
    queryKey: ["stats", "albums", limit],
    queryFn: async () => {
      const { data } = await api.get<TopAlbum[]>("/stats/albums", { params: { limit } });
      return data;
    },
    staleTime: 5 * 60_000,
  });
}

export function useTopArtists(limit = 10) {
  return useQuery({
    queryKey: ["stats", "artists", limit],
    queryFn: async () => {
      const { data } = await api.get<TopArtist[]>("/stats/artists", { params: { limit } });
      return data;
    },
    staleTime: 5 * 60_000,
  });
}

export function useTopGenres(limit = 10) {
  return useQuery({
    queryKey: ["stats", "genres", limit],
    queryFn: async () => {
      const { data } = await api.get<TopGenre[]>("/stats/genres", { params: { limit } });
      return data;
    },
    staleTime: 5 * 60_000,
  });
}

export function useUserStats(username: string) {
  return useQuery({
    queryKey: ["stats", "user", username],
    queryFn: async () => {
      const { data } = await api.get<UserStats>(`/stats/users/${username}`);
      return data;
    },
    enabled: !!username,
    staleTime: 60_000,
  });
}

export function useStreaks(username: string) {
  return useQuery({
    queryKey: ["streaks", username],
    queryFn: async () => {
      const { data } = await api.get<StreakData>(`/streaks/${username}`);
      return data;
    },
    enabled: !!username,
  });
}
