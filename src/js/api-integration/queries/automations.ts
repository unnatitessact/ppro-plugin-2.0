import type {
  GetAutomationActionsResponse,
  GetAutomationConfigsResponse,
  GetAutomationTriggersResponse,
} from "../types/automations";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import { createUrlParams } from "../queries/review";

export const automationsConfigsQueryKey = (workspaceId: string) => [
  "automations",
  "configs",
  workspaceId,
];
export const automationsActionsQueryKey = (workspaceId: string) => [
  "automations",
  "actions",
  workspaceId,
];
export const automationsTriggersQueryKey = (workspaceId: string) => [
  "automations",
  "triggers",
  workspaceId,
];

export const useAutomationConfigs = (staleTime?: number) => {
  const api = useApi();

  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: automationsConfigsQueryKey(workspace?.id),
    queryFn: async () => {
      const params = createUrlParams({
        workspace_id: workspace?.id,
      });
      const { data } = await api.get<GetAutomationConfigsResponse>(
        `/api/v1/automation/configs?${params?.toString()}`
      );
      return data;
    },
    enabled: !!workspace?.id,
    staleTime,
  });
};

export const useAutomationActions = () => {
  const api = useApi();

  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: automationsActionsQueryKey(workspace?.id),
    queryFn: async () => {
      const { data } = await api.get<GetAutomationActionsResponse>(
        `/api/v1/automation/actions/`
      );
      return data;
    },
    select: (data) =>
      // Return only the actions that the frontend supports,
      // filter out other actions because schema is not defined for them
      // To add support for new actions, add the schema and types, then add them to the filter
      data?.filter(
        (action) =>
          action.action_code === "create_new_project" ||
          action.action_code === "add_to_project" ||
          action.action_code === "reset_task_status_to_default" ||
          action.action_code === "move_file_to_folder" ||
          action.action_code === "apply_metadata_template"
      ) ?? [],
  });
};

export const useAutomationTriggers = () => {
  const api = useApi();

  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: automationsTriggersQueryKey(workspace?.id),
    queryFn: async () => {
      const { data } = await api.get<GetAutomationTriggersResponse>(
        `/api/v1/automation/triggers/`
      );
      return data;
    },
  });
};
