import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const HEALTH_URL = BASE_URL.replace(/\/api\/v1\/?$/, "") + "/health";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await axios.get(HEALTH_URL);
      return data;
    },
    refetchInterval: 45_000,
    refetchIntervalInBackground: true,
  });
}