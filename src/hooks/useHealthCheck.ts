import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await api.get("/health");
      return data;
    },
    refetchInterval: 45_000,
    refetchIntervalInBackground: true,
  });
}