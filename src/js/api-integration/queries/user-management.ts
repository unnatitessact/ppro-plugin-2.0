import type {
  GetOrganizationUsersResponse,
  GetOrphanUsersResponse,
  GetPermissionsResponse,
  GetRolesResponse,
  GetTeamDetailsResponse,
  GetTeamsOfWorkspaceResponse,
  GetTeamUsersResponse,
  GetUserPermissionsResponse,
  GetUserTeamListResponse,
  GetUserWorkspacesListResponse,
  GetWorkspaceDetailsResponse,
  GetWorkspacesResponse,
  GetWorkspacesWithTeamsResponse,
  GetWorkspaceUsersResponse,
  SelectedTeamUsersResponse,
} from "../types/user-management";

import { RoleType } from "../../types/user-management";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useApi } from "../../hooks/useApi";
import { useOrganization } from "../../hooks/useOrganization";

import { createUrlParams } from "./review";

export const appendOptionalKeys = (
  queryKey: string[],
  ...keys: (string | undefined)[]
) => {
  const newQueryKey = [...queryKey];
  for (const key in keys) {
    const value = keys[key];
    if (value !== undefined) {
      newQueryKey.push(value);
    } else {
      break;
    }
  }
  return newQueryKey;
};

// Query keys
export const rolesQueryKey = (
  role: RoleType,
  organizationId: string,
  searchQuery?: string
) => appendOptionalKeys([organizationId, "roles", role], searchQuery);
export const workspacesQueryKey = (
  organizationId: string,
  searchQuery?: string
) => appendOptionalKeys([organizationId, "workspaces"], searchQuery);
export const userWorkspacesQueryKey = (organizationId: string) => [
  organizationId,
  "userWorkspaces",
];
export const workspaceDetailsQueryKey = (workspaceId: string) => [
  "workspaces",
  workspaceId,
];
export const teamsQueryKey = (workspaceId: string) => [
  "workspaces",
  workspaceId,
  "teams",
];
export const teamDetailsQueryKey = (teamId: string) => ["teams", teamId];
export const organizationUsersQueryKey = (
  organizationId: string | undefined,
  searchQuery?: string,
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  }
) =>
  appendOptionalKeys(
    ["users", "organization"],
    organizationId,
    searchQuery,
    JSON.stringify(sortColumn)
  );
export const workspaceUsersQueryKey = (
  workspaceId: string,
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  },
  searchQuery?: string
) =>
  appendOptionalKeys(
    ["users", "workspace", workspaceId],
    searchQuery,
    JSON.stringify(sortColumn)
  );

export const teamUsersQueryKey = (
  teamId: string,
  searchQuery?: string,
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  }
) =>
  appendOptionalKeys(
    ["users", "team", teamId],
    searchQuery,
    JSON.stringify(sortColumn)
  );

export const permissionsQueryKey = (type: string, searchQuery?: string) =>
  appendOptionalKeys(["permissions", type], searchQuery);
export const userWorkspaceListQueryKey = (
  userId: string,
  organizationId: string
) => ["userWorkspacesList", organizationId, "user", userId];

export const userTeamListQueryKey = (
  userId: string,
  organizationId: string
) => ["userTeamList", organizationId, "user", userId];

export const userOrganizationPermissionListQueryKey = (
  organizationId: string
) => ["organizationPermissions", organizationId];

export const userWorkspacePermissionListQueryKey = (workspaceId: string) => [
  "workspacePermissions",
  workspaceId,
];

export const userTeamPermissionListQueryKey = (teamId: string) => [
  "teamPermissions",
  teamId,
];

export const selectedTeamUsersQueryKey = (teamId: string) => [
  "selectedTeamUsers",
  teamId,
];

export const workspacesWithTeamsListQueryKey = (organizationId: string) => [
  "workspacesWithTeams",
  organizationId,
];

export const orphanUsersQueryKey = (organizationId: string | undefined) => [
  "users",
  "orphan",
  organizationId,
];

// Queries
export const useRolesQuery = (
  role: RoleType,
  organizationId: string,
  searchQuery?: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: rolesQueryKey(role, organizationId, searchQuery),
    queryFn: async () => {
      const { data } = await api.get<GetRolesResponse>(
        `/api/v1/roles/?organization=${organizationId}&type=${role}${
          searchQuery ? `&search=${searchQuery}` : ""
        }`
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

// get all workspaces

export const useWorkspaceDetailsQuery = (
  workspaceId: string,
  enabled?: boolean
) => {
  const api = useApi();

  return useQuery({
    queryKey: workspaceDetailsQueryKey(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<GetWorkspaceDetailsResponse>(
        `/api/v1/workspaces/${workspaceId}/`
      );
      return data;
    },
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
    enabled: (!!workspaceId && enabled) ?? true,
  });
};

export const useWorkspacesQuery = (
  organizationId: string,
  searchQuery?: string,
  staleTime?: number
) => {
  const api = useApi();

  return useQuery({
    queryKey: workspacesQueryKey(organizationId, searchQuery),
    queryFn: async () => {
      const { data } = await api.get<GetWorkspacesResponse>(
        `/api/v1/organizations/${organizationId}/workspaces/${
          searchQuery ? `?search=${searchQuery}` : ""
        }`
      );
      return data;
    },
    staleTime,
    enabled: !!organizationId,
  });
};

export const useUserWorkspacesQuery = (organizationId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: userWorkspacesQueryKey(organizationId),
    queryFn: async () => {
      const { data } = await api.get<GetWorkspacesResponse>(
        `/api/v1/workspaces/?organization=${organizationId}`
      );
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useTeamsOfWorkspaceQuery = (
  workspaceId: string,
  enabled: boolean = true
) => {
  const api = useApi();

  return useQuery({
    queryKey: teamsQueryKey(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<GetTeamsOfWorkspaceResponse>(
        `/api/v1/workspaces/${workspaceId}/teams/`
      );
      return data;
    },
    enabled: !!workspaceId && enabled,
  });
};

export const useWorkspacesWithTeamsListQuery = () => {
  const api = useApi();
  const organization = useOrganization();

  return useQuery({
    queryKey: workspacesWithTeamsListQueryKey(organization?.id),
    queryFn: async ({ signal }) => {
      const { data } = await api.get<GetWorkspacesWithTeamsResponse>(
        `/api/v1/organizations/${organization?.id}/workspaces_with_teams`,
        {
          signal,
        }
      );

      return data;
    },
    enabled: !!organization?.id,
  });
};

export const useOrganizationUsersQuery = (
  organizationId: string | undefined,
  searchQuery?: string,
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  }
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: organizationUsersQueryKey(
      organizationId,
      searchQuery,
      sortColumn
    ),
    queryFn: async ({ pageParam }) => {
      const urlParams = createUrlParams({
        search: searchQuery,
        page: `${pageParam}`,
        ...(sortColumn && {
          sort: `${sortColumn.order === "desc" ? "-" : ""}${
            sortColumn.key === "name" ? "profile__display_name" : sortColumn.key
          }`,
        }),
      });

      // const { data } = await api.get<GetOrganizationUsersResponse>(
      //   `/api/v1/organizations/${organizationId}/users/?search=${searchQuery ?? ''}&page=${pageParam ?? ''}` +
      //     (sortColumn
      //       ? `&sort=${sortColumn.order ? (sortColumn.order === 'desc' ? '-' : '') : ''}${sortColumn.key === 'name' ? 'profile__display_name' : sortColumn.key}`
      //       : '')

      const { data } = await api.get<GetOrganizationUsersResponse>(
        `/api/v1/organizations/${organizationId}/users/?${urlParams.toString()}`
      );
      return data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : null,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : null,
  });
};

export const useWorkspaceUsersQuery = (
  workspaceId?: string,
  searchQuery?: string,
  enabled?: boolean,
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  }
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: workspaceUsersQueryKey(
      workspaceId ?? "",
      sortColumn ?? { key: "", order: "" },
      searchQuery
    ),
    queryFn: async ({ pageParam }) => {
      const sortParams = sortColumn?.key
        ? `&sort=${
            sortColumn.order ? (sortColumn.order === "desc" ? "-" : "") : ""
          }${
            sortColumn.key === "name" ? "profile__display_name" : sortColumn.key
          }`
        : "";

      const { data } = await api.get<GetWorkspaceUsersResponse>(
        `/api/v1/workspaces/${workspaceId}/users/?search=${searchQuery}&page=${pageParam}` +
          (sortParams ? `${sortParams}` : "")
      );
      return data.data;
    },

    enabled: (!!workspaceId && enabled) ?? true,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : null,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : null,
  });
};

// Get team users

export const useTeamUsersQuery = (
  teamId: string,
  searchQuery?: string,
  sortColumn?: {
    key: string;
    order: "asc" | "desc" | "";
  }
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: teamUsersQueryKey(
      teamId,
      searchQuery ? searchQuery : undefined,
      sortColumn
    ),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetTeamUsersResponse>(
        `/api/v1/teams/${teamId}/users/?search=${searchQuery ?? ""}` +
          (sortColumn
            ? `&sort=${
                sortColumn.order ? (sortColumn.order === "desc" ? "-" : "") : ""
              }${
                sortColumn.key === "name"
                  ? "profile__display_name"
                  : sortColumn.key
              }`
            : "") +
          `&page=${pageParam}`
      );
      return data.data;
    },
    enabled: !!teamId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : null,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : null,
  });
};

export const useTeamDetailsQuery = (teamId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: teamDetailsQueryKey(teamId),
    queryFn: async () => {
      const { data } = await api.get<GetTeamDetailsResponse>(
        `/api/v1/teams/${teamId}/`
      );
      return data;
    },
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
  });
};

export const usePermissionsQuery = (
  type: "organization" | "workspace" | "team",
  searchQuery?: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: permissionsQueryKey(type, searchQuery),
    queryFn: async () => {
      const { data } = await api.get<GetPermissionsResponse>(
        `/api/v1/permissions/?type=${type}&search=${searchQuery}`
      );
      return data;
    },
  });
};

export const useOrphanUsersQuery = (organizationId: string | undefined) => {
  const api = useApi();

  return useQuery({
    queryKey: orphanUsersQueryKey(organizationId),
    queryFn: async () => {
      const { data } = await api.get<GetOrphanUsersResponse>(
        `/api/v1/organizations/${organizationId}/get_orphan_users/`
      );
      return data;
    },
  });
};

export const useUserWorkspaceListQuery = (
  userId: string,
  organizationId: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: userWorkspaceListQueryKey(userId, organizationId),
    queryFn: async () => {
      const { data } = await api.get<GetUserWorkspacesListResponse>(
        `/api/v1/users/${userId}/workspaces/?organization=${organizationId}`
      );
      return data;
    },
    enabled: !!organizationId && !!userId,
  });
};

export const useUserTeamListQuery = (
  userId: string,
  organizationId: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: userTeamListQueryKey(userId, organizationId),
    queryFn: async () => {
      const { data } = await api.get<GetUserTeamListResponse>(
        `/api/v1/users/${userId}/teams/?organization=${organizationId}`
      );
      return data;
    },
    enabled: !!organizationId && !!userId,
  });
};

export const useUserOrganizationPermissionListQuery = () => {
  const api = useApi();
  const organization = useOrganization();

  return useQuery({
    queryKey: userOrganizationPermissionListQueryKey(organization.id),
    queryFn: async () => {
      const { data } = await api.get<GetUserPermissionsResponse>(
        `api/v1/users/permissions/?type=organization&object_id=${organization.id}`
      );
      return data;
    },
    enabled: !!organization.id,
  });
};

export const useUserWorkspacePermissionListQuery = (
  workspaceId: string,
  enabled?: boolean
) => {
  const api = useApi();

  return useQuery({
    queryKey: userWorkspacePermissionListQueryKey(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<GetUserPermissionsResponse>(
        `api/v1/users/permissions/?type=workspace&object_id=${workspaceId}`
      );
      return data;
    },
    enabled: !!workspaceId && enabled,
  });
};

export const useUserTeamPermissionListQuery = (teamId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: userTeamPermissionListQueryKey(teamId),
    queryFn: async () => {
      const { data } = await api.get<GetUserPermissionsResponse>(
        `api/v1/users/permissions/?type=team&object_id=${teamId}`
      );
      return data;
    },
    enabled: !!teamId,
  });
};

export const useSelectedTeamUsersQuery = (teamId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: selectedTeamUsersQueryKey(teamId),
    queryFn: async () => {
      const { data } = await api.get<SelectedTeamUsersResponse>(
        `api/v1/teams/${teamId}/user_ids/`
      );
      return data;
    },
    enabled: !!teamId,
  });
};
