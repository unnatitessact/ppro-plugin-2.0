import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  GetStepTemplateStatusListResponse,
  GetWorkflowMetadataFieldsResponse,
  GetWorkflowStepTypeResponse,
  GetWorkflowTemplateConnectionEdgesResponse,
  GetWorkflowTemplateDetailsResponse,
  GetWorkflowTemplateResponse,
  GetWorkflowTemplatesConversationResponse,
  GetWorkflowTemplateStepsListResponse,
} from "../types/workflow";

// import { Filter, Sort } from '@/stores/project-store';

export type WorkflowQueryParams = {
  // filters: Filter[];
  // sorts: Sort[];
  searchQuery: string;
};

export const getWorkflowTemplatesQueryKey = (
  workspaceId: string,
  searchQuery: string
) => {
  return [workspaceId, "workflowTemplates", searchQuery];
};

export const getWorkflowTemplateDetailsQueryKey = (templateId: string) => {
  return ["workflowTemplateDetails", templateId];
};

export const getWorkflowTemplateStepsListQueryKey = (
  workflowTemplateId: string
) => {
  return ["workflowTemplateStepsList", workflowTemplateId];
};

export const getWorkflowTemplateConnectionEdges = (
  workflowTemplateId: string
) => {
  return ["workflowTemplateConnectionEdges", workflowTemplateId];
};

export const getStepTemplateStatusList = (stepTemplateId: string) => {
  return ["stepTemplateStatusList", stepTemplateId];
};

export const getWorkflowTemplatesConversation = (
  workflowTemplateId: string
) => {
  return ["workflowTemplatesConversation", workflowTemplateId];
};

export const getWorkflowStepTypeQueryKey = () => {
  return ["workflowStepType"];
};

export const getWorkflowMetadataFieldsQueryKey = (
  workflowTemplateId: string
) => {
  return ["workflowMetadataFields", workflowTemplateId];
};

export const useWorkflowTemplatesQuery = ({
  // filters,
  // sorts,
  searchQuery,
}: WorkflowQueryParams) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  return useInfiniteQuery({
    queryKey: [...getWorkflowTemplatesQueryKey(workspace.id, searchQuery)],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetWorkflowTemplateResponse>(
        `/api/v1/workflow_templates/?workspace_id=${workspace.id}${
          pageParam ? `&page=${pageParam}` : ""
        }${searchQuery ? `&search=${searchQuery}` : ""}`
      );
      return data.data;
    },
    enabled: !!workspace.id,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage?.meta?.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useWorkflowTemplateDetailsQuery = (templateId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getWorkflowTemplateDetailsQueryKey(templateId),
    queryFn: async () => {
      const { data } = await api.get<GetWorkflowTemplateDetailsResponse>(
        `/api/v1/workflow_templates/${templateId}/`
      );
      return data;
    },
    enabled: !!templateId,
  });
};

export const useWorkflowTemplateStepsListQuery = (
  workflowTemplateId: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: getWorkflowTemplateStepsListQueryKey(workflowTemplateId),
    queryFn: async () => {
      const { data } = await api.get<GetWorkflowTemplateStepsListResponse>(
        `/api/v1/step_template/workflow-step-templates/?workflow_template_id=${workflowTemplateId}`
      );
      return data;
    },
    enabled: !!workflowTemplateId,
  });
};

export const useWorkflowStepTypeQuery = () => {
  const api = useApi();

  return useQuery({
    queryKey: getWorkflowStepTypeQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<GetWorkflowStepTypeResponse>(
        `/api/v1/step_type/`
      );
      return data;
    },
  });
};

export const useWorkflowTemplateConnectionEdges = (
  workflowTemplateId: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: getWorkflowTemplateConnectionEdges(workflowTemplateId),
    queryFn: async () => {
      const { data } =
        await api.get<GetWorkflowTemplateConnectionEdgesResponse>(
          `/api/v1/step_connection/?workflow_template_id=${workflowTemplateId}`
        );
      return data;
    },
    enabled: !!workflowTemplateId,
  });
};

export const useStepTemplateStatusList = (stepTemplateId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getStepTemplateStatusList(stepTemplateId),
    queryFn: async () => {
      const { data } = await api.get<GetStepTemplateStatusListResponse>(
        `/api/v1/step_template_status_config/?step_template_id=${stepTemplateId}`
      );
      return data;
    },
    enabled: !!stepTemplateId,
  });
};

// Workflow prompts

export const useWorkflowTemplatesConversationQuery = (
  workflowTemplateId: string
) => {
  const api = useApi();

  return useQuery({
    queryKey: getWorkflowTemplatesConversation(workflowTemplateId),
    queryFn: async () => {
      const { data } = await api.get<GetWorkflowTemplatesConversationResponse>(
        `/api/v1/workflow_templates/${workflowTemplateId}/conversation-history/`
      );
      return data;
    },
    enabled: !!workflowTemplateId,
  });
};

// Workflow Metadata

export const useWorkflowMetadataFieldsQuery = (workflowTemplateId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getWorkflowMetadataFieldsQueryKey(workflowTemplateId),
    queryFn: async () => {
      const { data } = await api.get<GetWorkflowMetadataFieldsResponse>(
        `/api/v1/project_metadata_template/?instance_id=${workflowTemplateId}&instance_type=workflow`
      );
      return data;
    },
    enabled: !!workflowTemplateId,
  });
};
