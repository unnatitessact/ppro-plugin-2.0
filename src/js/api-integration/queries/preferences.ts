// import { useAuth } from '@/context/auth';
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";

import { GetPreferencesResponse } from "../types/preferences";

export const preferencesQueryKey = (id: string) => ["preferences", id];

export const usePreferencesQuery = () => {
  const api = useApi();
  const { auth } = useAuth();
  const user = auth?.user;

  return useQuery({
    queryKey: preferencesQueryKey(user?.id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<GetPreferencesResponse>(
        `/api/v1/user_profile_and_preference/${user?.id}`
      );
      return data;
    },
    enabled: !!user?.id,
  });
};
