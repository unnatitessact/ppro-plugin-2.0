import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";

import {
  getSecurityGroupQueryKey,
  getSecurityGroupsQueryKey,
  getUserSecurityGroupListQueryKey,
  // libraryTreeQueryKey
} from "../queries/security-groups";
import {
  AssignPermissionsToSecurityGroupMutation,
  AssignPersonToAssetMutation,
  CreateSecurityGroupMutation,
  EditSecurityGroupMutation,
} from "../types/security-groups";

export const useCreateSecurityGroup = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSecurityGroupMutation) => {
      await api.post(`/api/v1/security_groups/`, payload);
    },
    onSuccess: (_, { organization }) => {
      queryClient.invalidateQueries({
        queryKey: getSecurityGroupsQueryKey(organization),
        exact: false,
      });
    },
  });
};

export const useEditSecurityGroup = (
  groupId: string,
  organizationId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditSecurityGroupMutation) => {
      await api.put(`/api/v1/security_groups/${groupId}/`, payload);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: getSecurityGroupsQueryKey(organizationId),
        exact: false,
      });
    },
  });
};

export const useDeleteSecurityGroup = (
  groupId: string,
  organizationId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/api/v1/security_groups/${groupId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSecurityGroupsQueryKey(organizationId),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [organizationId, "securityGroups", ""],
      });
    },
  });
};

export const useAddMembersToSecurityGroup = (groupId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (users: string[]) => {
      await api.patch(`/api/v1/security_groups/${groupId}/`, {
        users,
        choice: "ADD_USER",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSecurityGroupQueryKey(groupId),
      });
    },
  });
};

export const useAssignPermissionsToSecurityGroup = ({
  securityId,
}: // workspaceId
{
  securityId: string;
  workspaceId: string;
}) => {
  const api = useApi();
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AssignPermissionsToSecurityGroupMutation) => {
      await api.post(
        `/api/v1/security_groups/${securityId}/bulk_asset_access/`,
        payload
      );
    },
    onSuccess: () => {},
  });

  // TODO: invalidate queries
};

export const useRemoveMembersFromSecurityGroup = (groupId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (users: string[]) => {
      await api.patch(`/api/v1/security_groups/${groupId}/`, {
        users,
        choice: "RM_USER",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSecurityGroupQueryKey(groupId),
      });
    },
  });
};

export const useAssignPersonToAsset = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: AssignPersonToAssetMutation;
    }) => {
      await api.post(`/api/v1/users/${userId}/asset_access/`, payload);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: getUserSecurityGroupListQueryKey(userId, ""),
      });
    },
  });
};
