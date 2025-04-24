// import { useRouter } from 'next/navigation'; // Commented out Next.js import

import { useRoles } from "../../context/roles";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import { useApi } from "../../hooks/useApi";
import { useOrganization } from "../../hooks/useOrganization";

import {
  organizationUsersQueryKey,
  orphanUsersQueryKey,
  rolesQueryKey,
  selectedTeamUsersQueryKey,
  teamDetailsQueryKey,
  teamsQueryKey,
  teamUsersQueryKey,
  userOrganizationPermissionListQueryKey,
  userTeamListQueryKey,
  userWorkspaceListQueryKey,
  userWorkspacesQueryKey,
  workspaceDetailsQueryKey,
  workspacesQueryKey,
  workspacesWithTeamsListQueryKey,
  workspaceUsersQueryKey,
} from "../queries/user-management";
import {
  AddUsersToTeamRequest,
  AddUsersToWorkspaceRequest,
  AddUserToWorkspaceTeamsRequest,
  BulkAddUsersRequest,
  BulkUploadUsersRequest,
  CreateNewRoleRequest,
  CreateNewUserForOrganizationRequest,
  CreateNewUserForOrganizationResponse,
  CreateTeamAndAddUsersRequest,
  CreateTeamRequest,
  CreateTeamResponse,
  CreateWorkspaceAndAddUsersRequest,
  CreateWorkspaceRequest,
  CreateWorkspacesAndTeamsRequest,
  CSVParsedUsersInvalidUser,
  GetOrganizationUsersResponse,
  ParseCSVResponse,
  RemoveUserFromTeamRequest,
  RemoveUserFromWorkspaceRequest,
  UpdateOrganizationUserRequest,
  UpdateRoleAsDefaultRequest,
  UpdateTeamDetailsRequest,
  UpdateUserProfileRequest,
  UpdateWorkspaceDetailsRequest,
} from "../types/user-management";

import { Role } from "../types/user-management";

import { RoleType } from "../../types/user-management";

// import { RoleType, Team } from "../../types/user-management";

export const useCreateWorkspacesAndTeams = (organizationId: string) => {
  const api = useApi();
  // const router = useRouter();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CreateWorkspacesAndTeamsRequest) => {
      const formData = new FormData();

      const workspaces = payload.map((workspace) => ({
        name: workspace.name,
        teams: workspace.teams.map((team: { name: string }) => ({
          name: team.name,
        })),
      }));

      formData.append("workspaces", JSON.stringify(workspaces));

      payload.forEach((workspace, index) => {
        if (workspace.image) {
          formData.append(`file${index}`, workspace.image);
        }
      });

      await api.post(
        `/api/v1/organizations/${organizationId}/create_workspaces_and_teams/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    },
    onSuccess: () => {
      // router.push('/admin/users');
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
    },
    onError: () =>
      toast(`Super sorry, this one's on us!`, {
        description: `Please try again after a while. We're fixing this.`,
      }),
  });
};

// add new user to organnization

export const useAddNewUser = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CreateNewUserForOrganizationRequest) => {
      const data = (await api.post)<CreateNewUserForOrganizationResponse>(
        `/api/v1/organizations/${organization.id}/add_user/`,
        payload
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationUsersQueryKey(organization.id),
      });
      queryClient.invalidateQueries({
        queryKey: orphanUsersQueryKey(organization.id),
      });
    },
    onError: () => {},
  });
};

export const useCreateTeam = (workspaceId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CreateTeamRequest) => {
      const data = await api.post<CreateTeamResponse>(
        "/api/v1/teams/",
        payload
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspacesQueryKey(organization.id),
      });
      queryClient.invalidateQueries({ queryKey: teamsQueryKey(workspaceId) });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
    },
    onError: () => {},
  });
};

export const useCreateWorkspace = (onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CreateWorkspaceRequest) => {
      const formData = new FormData();

      formData.append("title", payload.title);
      formData.append("organization", organization.id);

      if (payload.display_image) {
        formData.append("display_image", payload.display_image);
      }
      const data = await api.post("/api/v1/workspaces/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspacesQueryKey(organization.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      onSuccess?.();
    },
    onError: () =>
      toast(`Super sorry, this one's on us!`, {
        description: `Please try again after a while. We're fixing this.`,
      }),
  });
};

export const useDeleteWorkspace = (
  workspaceId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async () => {
      const data = await api.delete(`/api/v1/workspaces/${workspaceId}/`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userWorkspacesQueryKey(organization.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesQueryKey(organization.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceDetailsQueryKey(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      onSuccess?.();
    },
    onError: () => {},
  });
};

// update workspace details

export const useUpdateWorkspaceDetails = (
  workspaceId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: UpdateWorkspaceDetailsRequest) => {
      const formData = new FormData();

      formData.append("title", payload.title);

      if (payload.display_image) {
        formData.append("display_image", payload.display_image);
      }

      formData.append("organization", organization.id);

      const { data } = await api.put(
        `/api/v1/workspaces/${workspaceId}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userWorkspacesQueryKey(organization.id),
      });

      queryClient.invalidateQueries({
        queryKey: workspacesQueryKey(organization.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceDetailsQueryKey(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });

      onSuccess?.();
    },
    onError: () => {},
  });
};

export const useResetWorkspaceProfilePicture = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const { data } = await api.put(
        `/api/v1/workspaces/${workspaceId}/reset_profile_picture/`
      );
      return data;
    },
    onSuccess: (_, workspaceId) => {
      queryClient.invalidateQueries({
        queryKey: userWorkspacesQueryKey(organization.id),
      });

      queryClient.invalidateQueries({
        queryKey: workspacesQueryKey(organization.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceDetailsQueryKey(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
    },
    onError: () => {},
  });
};

// export const useCreateNewRole = () => {
//   const api = useApi();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (payload: CreateNewRoleRequest) => {
//       const data = await api.post(`/api/v1/roles/`, payload);

//       // Find role id and update query data
//       const role = data.find((role: Role) => role.id === payload.role_type);

//       queryClient.setQueryData<InfiniteData<GetOrganizationUsersResponse>>(
//         queryKey: rolesQueryKey(role_type, organization),
//       );
//       queryClient.invalidateQueries({
//         queryKey: workspacesWithTeamsListQueryKey(organization),
//       });
//     },
//     onError: () => {},
//   });
// };

export const useUpdateRole = (roleID: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateNewRoleRequest) => {
      const data = await api.patch(`/api/v1/roles/${roleID}/`, payload);

      return data;
    },
    onSuccess: (_, { role_type, organization }) => {
      queryClient.invalidateQueries({
        queryKey: rolesQueryKey(role_type, organization),
      });
      queryClient.invalidateQueries({
        queryKey: userOrganizationPermissionListQueryKey(organization),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization),
      });
    },
    onError: () => {},
  });
};

export const useAddUserToTeamsWorkspaces = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: AddUserToWorkspaceTeamsRequest) => {
      const data = await api.post(
        `api/v1/organizations/add_user_to_team_and_workspace/`,
        [payload]
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
    },
  });
};

export const useUpdateOrganizationUserRoles = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();
  const { roles: organizationRoles } = useRoles("organization");
  const queryKey = organizationUsersQueryKey(organization?.id);

  return useMutation({
    mutationFn: async (payload: UpdateOrganizationUserRequest) => {
      const data = await api.post(
        `/api/v1/organizations/${organization?.id}/update_user_roles/`,
        payload
      );
      return data;
    },
    onMutate: async (payload: UpdateOrganizationUserRequest) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const oldData:
        | InfiniteData<GetOrganizationUsersResponse["data"], unknown>
        | undefined = queryClient.getQueryData(queryKey);
      if (!oldData) return;
      queryClient.setQueryData(
        queryKey,
        (
          old:
            | InfiniteData<GetOrganizationUsersResponse["data"], unknown>
            | undefined
        ) => {
          if (!old) return old;
          const newData = { ...old };
          for (const page of newData.pages) {
            for (const user of page.results) {
              for (const roleAssignment of payload) {
                if (user.id === roleAssignment.user_id) {
                  user.roles =
                    organizationRoles?.filter((role: Role) =>
                      roleAssignment.role_ids.includes(role.id)
                    ) ?? [];
                }
              }
            }
          }
          return { ...newData, mutated: true };
        }
      );
      return { oldData };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(queryKey, context?.oldData);
    },
    onSettled: () => {
      // Need to invalidate this since it's response depends on permission to user which depend on role
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useAddUsersToWorkspace = (_?: string, onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: AddUsersToWorkspaceRequest) => {
      const data = await api.post(
        `/api/v1/workspaces/add_or_update_users/`,
        payload
      );
      return data;
    },
    onSuccess: (_, payload) => {
      const workspaceId = payload[0].workspace;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceUsersQueryKey(workspaceId),
      });
    },
    onError: () => {},
  });
};

export const useAddUsersToTeams = (onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: AddUsersToTeamRequest) => {
      const data = await api.post(
        `/api/v1/teams/add_or_update_users/`,
        payload
      );
      return data;
    },
    onSuccess: (_, payload) => {
      onSuccess?.();
      const uniqueTeamIdsToInvalidate = Array.from(
        new Set(payload.flatMap((item) => item.team_id))
      );
      uniqueTeamIdsToInvalidate.forEach((teamId) => {
        queryClient.invalidateQueries({ queryKey: teamUsersQueryKey(teamId) });
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      uniqueTeamIdsToInvalidate.forEach((teamId) => {
        queryClient.invalidateQueries({
          queryKey: selectedTeamUsersQueryKey(teamId),
        });
      });
    },
  });
};

export const useDeleteTeam = (
  teamId: string,
  workspaceId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/api/v1/teams/${teamId}/`);
      const data = response.data; // Access the 'data' property of the AxiosResponse object

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceDetailsQueryKey(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: teamsQueryKey(workspaceId) });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      onSuccess?.();
    },
    onError: () => {},
  });
};

export const useUpdateTeamDetails = (
  teamId: string,
  workspaceId: string,
  onSuccess: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: UpdateTeamDetailsRequest) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      const { data } = await api.put(`/api/v1/teams/${teamId}/`, formData);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamsQueryKey(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: teamDetailsQueryKey(teamId) });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      onSuccess();
    },
    onError: () => {},
  });
};

export const useBulkUploadUsers = () => {
  const api = useApi();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: BulkUploadUsersRequest) => {
      const formData = new FormData();

      formData.append("csv_file", payload.csv_file);

      const { data } = await api.post<ParseCSVResponse>(
        `/api/v1/organizations/${organization?.id}/parse_csv/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    },
    onSuccess: () => {},
    onError: () => {},
  });
};

export const useDownloadInvalidUsers = () => {
  const api = useApi();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CSVParsedUsersInvalidUser[]) => {
      const { data } = await api.post(
        `api/v1/organizations/${organization?.id}/invalid_users_csv/`,
        {
          invalid_users: payload,
        }
      );

      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute(
        "download",
        `${organization.title}-invalid-users-${dayjs().format(
          "DD-MM-YYYY"
        )}.csv`
      );
      a.click();
    },
  });
};

export const useAddMultipleUsersToOrganization = () => {
  const api = useApi();
  const organization = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkAddUsersRequest) => {
      const data = await api.post(
        `/api/v1/organizations/${organization?.id}/create_users_from_csv/`,
        {
          user_data: payload?.user_data
            ?.filter((user) => !user.user_exists)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ user_exists, ...rest }) => rest),
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationUsersQueryKey(organization?.id),
      });
      queryClient.invalidateQueries({
        queryKey: orphanUsersQueryKey(organization?.id),
      });
    },
    onError: () => {},
  });
};

export const useUpdateUserProfile = (userId: string) => {
  const api = useApi();
  const organization = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserProfileRequest) => {
      const formData = new FormData();

      formData.append("first_name", payload.first_name);
      formData.append("last_name", payload.last_name);
      if (payload.display_name) {
        formData.append("display_name", payload.display_name);
      }
      if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
      }

      const { data } = await api.patch(`/api/v1/users/${userId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationUsersQueryKey(organization?.id),
      });
    },
    onError: () => {},
  });
};

export const useRemoveUserFromWorkspace = (
  userId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const organization = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RemoveUserFromWorkspaceRequest) => {
      const data = await api.post(
        `/api/v1/workspaces/${payload.workspaceId}/remove_users/`,
        {
          users: payload.users,
        }
      );

      return data;
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: userWorkspaceListQueryKey(userId, organization?.id),
      });

      queryClient.invalidateQueries({
        queryKey: workspaceUsersQueryKey(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });

      onSuccess?.();
    },
  });
};

export const useRemoveUserFromTeam = (
  userId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const organization = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RemoveUserFromTeamRequest) => {
      const data = await api.post(
        `/api/v1/teams/${payload.teamId}/remove_users/`,
        {
          users: payload.users,
        }
      );

      return data;
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({
        queryKey: userTeamListQueryKey(userId, organization?.id),
      });

      queryClient.invalidateQueries({
        queryKey: teamUsersQueryKey(teamId),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      queryClient.invalidateQueries({
        queryKey: selectedTeamUsersQueryKey(teamId),
      });
      onSuccess?.();
    },
  });
};

export const useCreateTeamAndAddUsers = (onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CreateTeamAndAddUsersRequest) => {
      const data = await api.post(`/api/v1/teams/`, {
        title: payload.team_title,
        workspace: payload.workspace_id,
      });

      await api.post(
        `/api/v1/teams/add_or_update_users/`,
        payload.users.map((user) => ({
          ...user,
          team_id: data.data.id,
        }))
      );

      return { data, payload };
    },
    onSuccess: ({ payload }) => {
      queryClient.invalidateQueries({
        queryKey: teamsQueryKey(payload.workspace_id),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      onSuccess?.();
    },
  });
};

export const useCreateWorkspaceAndAddUsers = (onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (payload: CreateWorkspaceAndAddUsersRequest) => {
      const formData = new FormData();

      formData.append("title", payload.workspaceTitle);
      formData.append("organization", organization.id);

      if (payload.displayImage) {
        formData.append("display_image", payload.displayImage);
      }
      const data = await api.post("/api/v1/workspaces/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await api.post(
        `/api/v1/workspaces/add_or_update_users/`,
        payload.users.map((user) => ({
          ...user,
          workspace: data.data.id,
        }))
      );

      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspacesQueryKey(organization?.id),
      });
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      onSuccess?.();
    },
  });
};

export const useExportOrganizationUsers = () => {
  const api = useApi();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(
        `/api/v1/organizations/${organization?.id}/export_users/`
      );
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute(
        "download",
        `${organization.title}-users-${dayjs().format("DD-MM-YYYY")}.csv`
      );
      a.click();
    },
  });
};

export const useExportWorkspaceUsers = (workspaceId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(
        `/api/v1/workspaces/${workspaceId}/export_users/`
      );
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute(
        "download",
        `workspace-${workspaceId}-users-${dayjs().format("DD-MM-YYYY")}.csv`
      );
      a.click();
    },
  });
};

export const useExportTeamUsers = (teamId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(`/api/v1/teams/${teamId}/export_users/`);
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute(
        "download",
        `team-${teamId}-users-${dayjs().format("DD-MM-YYYY")}.csv`
      );
      a.click();
    },
  });
};

export const useExportSelectedUsers = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const { data } = await api.post(`/api/v1/users/export_users/`, {
        user_ids: userIds,
      });
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `users-${dayjs().format("DD-MM-YYYY")}.csv`);
      a.click();
    },
  });
};

export const useDeleteRole = (type: RoleType) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  return useMutation({
    mutationFn: async (roleID: string) => {
      const data = await api.delete(`/api/v1/roles/${roleID}/`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspacesWithTeamsListQueryKey(organization?.id),
      });
      queryClient.invalidateQueries({
        queryKey: rolesQueryKey(type, organization?.id),
      });
    },
    onError: () => {},
  });
};

export const useSetRoleAsDefault = (role_type: RoleType) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const organization = useOrganization();
  const queryKey = rolesQueryKey(role_type, organization?.id, "");
  return useMutation({
    mutationFn: async (payload: UpdateRoleAsDefaultRequest) => {
      const data = await api.patch(`/api/v1/roles/${payload.id}/`, {
        is_default: true,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useDeactivateUserToggle = () => {
  const api = useApi();

  const queryClient = useQueryClient();
  const organization = useOrganization();

  const queryKey = organizationUsersQueryKey(organization?.id);

  return useMutation({
    // onMutate: async ({userId, isActive}) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({ queryKey });

    //   // Snapshot the previous value
    //   const oldData: InfiniteData<GetOrganizationUsersResponse['data'], unknown> | undefined =
    //     queryClient.getQueryData(queryKey);
    //   if (!oldData) return;
    //   queryClient.setQueryData(
    //     queryKey,
    //     (old: InfiniteData<GetOrganizationUsersResponse['data'], unknown> | undefined) => {
    //       if (!old) return old;
    //       const newData = { ...old };
    //       for (const page of newData.pages) {
    //         for (const user of page.results) {
    //           if (user.id === userId) {
    //             user.is_active = isActi
    //           }
    //         }
    //       }
    //       return { ...newData, mutated: true };
    //     }
    //   );
    //   return { oldData };
    // },
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
    }) => {
      const data = await api.post(
        `/api/v1/users/${userId}/toggle_active_status/`,
        {
          is_active: isActive,
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });
};
