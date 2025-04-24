import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";

import {
  FeatureFlagResponse,
  OrganizationListResponse,
  User,
} from "../types/feature-flag";

export const userFeatureFlagDetailsQueryKey = () => ["feature-flags"];
export const organizationFeatureFlagListQueryKey = (organizationId: string) => [
  "organization-feature-flags-list",
  organizationId,
];
export const availableFeatureFlagListQueryKey = (organizationId: string) => [
  "available-feature-flags",
  organizationId,
];
export const useOrganizationListQueryKey = (search: string) => [
  "organization-list",
  search,
];

export const useUserFeatureFlagDetails = () => {
  const api = useApi();

  return useQuery({
    queryKey: userFeatureFlagDetailsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<User>(`/api/v1/users/me/`, {});
      return data.organization.feature_flags.reduce((acc, flag) => {
        acc[flag.title] = flag.value;
        return acc;
      }, {} as Record<string, boolean>);
    },
    retry: false,
  });
};

export const useOrganizationFeatureFlagListQuery = (organizationId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: organizationFeatureFlagListQueryKey(organizationId),
    queryFn: async () => {
      const { data } = await api.get<FeatureFlagResponse>(
        `/api/v1/feature_flags/`,
        {
          params: {
            organization: organizationId,
          },
        }
      );
      return data;
    },
  });
};

export const useAvailableFeatureFlagListQuery = (organizationId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: availableFeatureFlagListQueryKey(organizationId),
    queryFn: async () => {
      const { data } = await api.get<FeatureFlagResponse>(
        `/api/v1/feature_flags/available_flags/`,
        {
          params: {
            organization: organizationId,
          },
        }
      );
      return data;
    },
  });
};

export const useOrganizationListQuery = (search: string) => {
  const api = useApi();

  return useQuery({
    queryKey: useOrganizationListQueryKey(search),
    queryFn: async () => {
      const { data } = await api.get<OrganizationListResponse>(
        `/api/v1/feature_flags/get_all_organizations/${
          search ? `?search=${search}` : ""
        }`
      );
      return data;
    },
  });
};
