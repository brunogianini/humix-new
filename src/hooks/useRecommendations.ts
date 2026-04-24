import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { RecommendationsResponse } from "@/lib/types";
import { useAuthStore } from "@/store/auth";

export const recommendationKeys = {
  all: ["recommendations"] as const,
  list: (limit?: number) => [...recommendationKeys.all, { limit }] as const,
};

export function useRecommendations(limit = 20) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: recommendationKeys.list(limit),
    queryFn: async () => {
      const { data } = await api.get<RecommendationsResponse>(
        "/recommendations",
        { params: { limit } }
      );
      return data.recommendations;
    },
    staleTime: 5 * 60_000,
    enabled: isAuthenticated,
  });
}
