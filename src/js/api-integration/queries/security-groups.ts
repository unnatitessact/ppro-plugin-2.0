import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useApi } from "../../hooks/useApi";

import {
  GetLibraryTreeResponse,
  GetSecurityGroupAccessToAssetResponse,
  GetSecurityGroupAccessToAssetUserResponse,
  GetSecurityGroupResponse,
  GetSecurityGroupsResponse,
  GetSecurityGroupUsersResponse,
  GetUserSecurityGroupsListResponse,
} from "../../api-integration/types/security-groups";

// Query keys
export const getSecurityGroupsQueryKey = (organizationId: string) => [
  organizationId,
  "securityGroups",
];

export const getSecurityGroupQueryKey = (groupId: string) => [
  "securityGroup",
  groupId,
];
export const getUserSecurityGroupListQueryKey = (
  userId: string,
  organizationId: string
) => ["userSecurityGroupsList", organizationId, "user", userId];
export const getSecurityGroupUsersQueryKey = (
  groupId: string,
  searchQuery: string
) => ["securityGroup", groupId, "users", searchQuery];

export const libraryTreeQueryKey = (
  groupId: string,
  workspaceId: string,
  parentId?: string,
  searchQuery?: string
) => [
  "libraryTree",
  "group",
  groupId ?? "",
  "workspace",
  workspaceId ?? "",
  "parent",
  parentId ?? "",
  "search",
  searchQuery ?? "",
];

export const getSecurityGroupAccessToAssetQueryKey = (
  assetId: string,
  searchQuery: string
) => ["securityGroupAccessToAsset", assetId, "search", searchQuery];

export const getUserAccessToAssetQueryKey = (
  assetId: string,
  searchQuery: string
) => ["userAccessToAsset", assetId, "search", searchQuery];

export const useSecurityGroupsQuery = (
  organizationId: string,
  searchQuery = ""
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: [...getSecurityGroupsQueryKey(organizationId), searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetSecurityGroupsResponse>(
        `/api/v1/security_groups/?organization=${organizationId}&page=${pageParam}&search=${searchQuery}`
      );
      return data.data;
    },
    enabled: !!organizationId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};

export const useSecurityGroupQuery = (groupId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getSecurityGroupQueryKey(groupId),
    queryFn: async () => {
      const { data } = await api.get<GetSecurityGroupResponse>(
        `/api/v1/security_groups/${groupId}/`
      );
      return data;
    },
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
    enabled: !!groupId,
  });
};

export const useSecurityGroupUsersQuery = (
  groupId: string,
  searchQuery: string
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getSecurityGroupUsersQueryKey(groupId, searchQuery),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetSecurityGroupUsersResponse>(
        `/api/v1/security_groups/${groupId}/users/?page=${pageParam}&search=${searchQuery}`
      );
      return data.data;
    },
    enabled: !!groupId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};

export const useUserSecurityGroupListQuery = (
  userId: string,
  organizationId: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: getUserSecurityGroupListQueryKey(userId, organizationId),
    queryFn: async () => {
      const { data } = await api.get<GetUserSecurityGroupsListResponse>(
        `/api/v1/users/${userId}/security_groups/?organization=${organizationId}`
      );
      return data;
    },
    enabled: !!organizationId && !!userId,
  });
};

export const useLibraryTreeListQuery = (
  groupId: string,
  workspaceId: string,
  parentId?: string,
  enabled?: boolean,
  searchQuery?: string
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: libraryTreeQueryKey(groupId, workspaceId, parentId, searchQuery),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetLibraryTreeResponse>(
        `api/v1/security_groups/${groupId}/library_tree/?page=${pageParam}&workspace=${workspaceId}${
          parentId ? `&parent=${parentId}` : ""
        }${searchQuery ? `&search=${searchQuery}` : ""}`
      );
      return data.data;
    },
    enabled: !!workspaceId && !!groupId && enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.next ? lastPage?.meta?.current_page + 1 : null,
    getPreviousPageParam: (lastPage) =>
      lastPage?.meta?.previous ? lastPage?.meta?.current_page - 1 : null,
  });
};

export const useSecurityGroupAccessToAsset = (
  assetId: string,
  searchQuery: string
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getSecurityGroupAccessToAssetQueryKey(assetId, searchQuery),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetSecurityGroupAccessToAssetResponse>(
        `/api/v1/library/${assetId}/get_access_security_groups/?page=${pageParam}&search=${searchQuery}`
      );
      return data.data;
    },
    enabled: !!assetId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};

export const useUserAccessToAsset = (assetId: string, searchQuery: string) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getUserAccessToAssetQueryKey(assetId, searchQuery),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetSecurityGroupAccessToAssetUserResponse>(
        `/api/v1/library/${assetId}/get_access_users/?page=${pageParam}&search=${searchQuery}`
      );
      return data.data;
    },
    enabled: !!assetId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
  });
};
