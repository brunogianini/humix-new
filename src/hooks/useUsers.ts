import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { UserProfile, PaginatedResponse, User } from "@/lib/types";
import { useAuthStore } from "@/store/auth";

export const userKeys = {
  profile: (username: string) => ["users", "profile", username] as const,
  followers: (username: string) => ["users", "followers", username] as const,
  following: (username: string) => ["users", "following", username] as const,
};

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: async () => {
      const { data } = await api.get<UserProfile>(`/users/${username}`);
      return data;
    },
    enabled: !!username,
  });
}

export function useUserFollowers(username: string) {
  return useQuery({
    queryKey: userKeys.followers(username),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>(
        `/users/${username}/followers`
      );
      return data;
    },
    enabled: !!username,
  });
}

export function useUserFollowing(username: string) {
  return useQuery({
    queryKey: userKeys.following(username),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>(
        `/users/${username}/following`
      );
      return data;
    },
    enabled: !!username,
  });
}

export function useFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      await api.post(`/users/${username}/follow`);
      return username;
    },
    onSuccess: (username) => {
      qc.invalidateQueries({ queryKey: userKeys.profile(username) });
    },
  });
}

export function useUnfollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      await api.delete(`/users/${username}/follow`);
      return username;
    },
    onSuccess: (username) => {
      qc.invalidateQueries({ queryKey: userKeys.profile(username) });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (payload: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    }) => {
      const { data } = await api.patch("/users/me/profile", payload);
      return data;
    },
    onSuccess: (data) => {
      updateUser({
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      });
      if (user?.username) {
        qc.invalidateQueries({ queryKey: userKeys.profile(user.username) });
      }
    },
  });
}
