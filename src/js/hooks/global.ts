import { useQuery } from "@tanstack/react-query";

import { useApi } from "../hooks/useApi";

export const getUsageLimitQueryKey = () => ["usage-limit"];

interface UsageLimitResponse {
  storage_limit: number;
  storage_used: number;
}

export const useUsageLimit = () => {
  const api = useApi();

  return useQuery({
    queryKey: getUsageLimitQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<UsageLimitResponse>(
        "api/v1/storage_usage/get_storage_usage/"
      );
      return data;
    },
  });
};
