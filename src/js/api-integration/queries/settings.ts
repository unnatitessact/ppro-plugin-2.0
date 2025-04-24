import { useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import { createUrlParams } from "../queries/review";

import { GetWorkspacePreferencesResponse } from "../types/settings";

export const workspacePreferencesQueryKey = (workspaceId: string) => [
  "workspace-preferences",
  workspaceId,
];

export const useWorkspacePreferencesQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: workspacePreferencesQueryKey(workspace.id),
    queryFn: async () => {
      const params = createUrlParams({ workspace: workspace.id });

      const { data } = await api.get<GetWorkspacePreferencesResponse>(
        `/api/v1/workspace_preferences/?${params.toString()}`
      );

      return data;
    },
    enabled: !!workspace?.id,
  });
};
