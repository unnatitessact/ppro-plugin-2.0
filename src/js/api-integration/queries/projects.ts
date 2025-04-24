// import { useParams } from "next/navigation"; // Commented out

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useApi } from "../../hooks/useApi";
// import { useProjectLibraryFilterState } from "../../hooks/useProjectLibraryFilterState";
import { useWorkspace } from "../../hooks/useWorkspace";

import { useParamsStateStore } from "../../stores/params-state-store"; // Import store

import { getAIGeneratedFiltersQueryKey } from "./library";
import { generateProjectLibraryQueryParams } from "./utils";
import { AIGeneratedFiltersResponse } from "../types/library";
import { GetModificationDetailsResponse } from "../types/metadata";
import {
  AffectedStepsResponse,
  AssetDetails,
  GlobalTaskListResponse,
  IncomingFileResults,
  LibraryResults,
  ProjectMetadataResults,
  ProjectResults,
  ProjectStatusResults,
  SelectedProjectMembersResults,
  SelectedProjectResults,
  TaskDetailsResult,
  TaskHistoryResults,
  TaskListResponse,
  TaskStatus,
  TaskStatusListResults,
  TaskStepTypeListResults,
} from "../types/projects";
import { ProjectTreeResult } from "../types/tree";
import { WorkflowTemplate } from "../types/workflow";

import { Filter, Sort } from "../../stores/library-store";
import { useProjectStore } from "../../stores/project-store";

// Query types
export type ProjectContentsQueryParams = {
  filters: {
    is_archived: boolean;
    workflow_name: string;
    status_name: string;
  };
  sorts: Sort[];
  flatten: boolean;
  searchQuery: string;
  matchType: "all" | "any";
};

export type SelectedProjectQueryParams = {
  projectId: string;
  searchQuery?: string;
};

// Query Keys
export const getProjectContentsQueryKey = (
  workspaceId: string,
  queryParams?: string
) => {
  return [workspaceId, "projectList", queryParams];
};

export const getProjectStatusesQueryKey = () => ["projectStatus"];

export const getSelectedProjectQueryKey = (projectId: string) => [
  "project",
  projectId,
];

export const getSelectedProjectMembersQueryKey = (
  projectId: string,
  searchQuery?: string
) => ["projectMembers", projectId, searchQuery];

export const getProjectAssetDetailsQueryKey = (assetId: string) => {
  return ["projectAssetDetails", assetId];
};

export const getTaskListQueryKey = (
  id: string,
  type: "project" | "workspace",
  params?: ProjectTasksContentsQueryParams
) => {
  return params ? ["taskList", id, type, params] : ["taskList", id, type];
};

export const getAllTaskListQueryKey = () => {
  return ["AlltaskList"];
};

export const getGlobalTaskListNoFilterQueryKey = () => {
  // Use this when invalidating and you don't have access to filters. It wil invalidate all queries matching global task list
  return ["GlobalTaskList"];
};

export const getGlobalTaskListQueryKey = (
  searchQuery?: string,
  assignedUser?: string,
  team?: string,
  status?: TaskStatus[],
  stepType?: string,
  blocked?: boolean,
  blocking?: boolean,
  match_type?: "all" | "any",
  workflow?: WorkflowTemplate[],
  sorts?: Sort[]
) => {
  return [
    "GlobalTaskList",
    searchQuery,
    assignedUser,
    team,
    status,
    stepType,
    blocked,
    blocking,
    match_type,
    workflow,
    sorts,
  ];
};
export const getTaskHistoryQueryKey = (taskId: string) => {
  return ["taskHistory", taskId];
};

export const getTaskIncomingFilesQueryKey = (stepId: string) => {
  return ["taskIncomingFiles", stepId];
};

export const getTaskOutgoingFilesQueryKey = (stepId: string) => {
  return ["taskOutgoingFiles", stepId];
};

export const getAffectedStepsQueryKey = (statusId: string) => {
  return ["affectedSteps", statusId];
};

export const getProjectLibraryContentsQueryKey = (
  projectId: string,
  parentId: string | null
) => {
  return ["projectLibrary", projectId, parentId];
};

export const getProjectTreeQueryKey = (
  projectId: string,
  parentId: string | null
) => {
  return ["projectTree", projectId, parentId];
};

// Metadata

export const getProjectMetadataQueryKey = (
  instaceId: string,
  instanceType: "project" | "file"
) => {
  return ["projectMetadata", instaceId, instanceType];
};

export const getModificationDetailsQueryKey = (fieldId: string) => {
  return ["projectmodificationDetails", fieldId];
};

export const getTaskStatusListQueryKey = (
  id: string,
  type: "project" | "workspace"
) => {
  return ["taskStatusList", id, type];
};

export const getTaskStepTypeListQueryKey = (workspaceId: string) => {
  return ["taskStepTypeList", workspaceId];
};

export const getTaskDetailsQueryKey = (taskId: string) => {
  return ["taskDetails", taskId];
};

// Hooks
export const useProjectLibraryContentsQueryKey = (parentId: string | null) => {
  const { projectId } = useParamsStateStore(); // Use store
  // const { projectId } = useParams() as { projectId: string };

  // const { filters, sorts, filterMatchType } = useProjectLibraryFilterState();

  const { flattenFolders, search } = useProjectStore();

  // const { filters, sorts, flattenFolders, search, filterMatchType } = useProjectStore();

  const queryParams = generateProjectLibraryQueryParams({
    filters: [],
    sorts: [],
    flatten: flattenFolders,
    searchQuery: search.trim(),
    matchType: "all",
  });

  return [
    ...getProjectLibraryContentsQueryKey(projectId as string, parentId),
    queryParams,
  ];
};

// Queries
export const useProjectsQuery = ({
  filters,
  sorts,
  // flatten,
  searchQuery,
  matchType,
}: ProjectContentsQueryParams) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  let queryParams = "";

  if (filters.is_archived) {
    queryParams += `&is_archived=${filters.is_archived}`;
  }

  if (filters.workflow_name) {
    queryParams += `&workflow=${filters.workflow_name}`;
  }

  if (filters.status_name) {
    queryParams += `&status=${filters.status_name}`;
  }

  if (sorts && sorts?.length > 0) {
    queryParams += `&sort=${sorts
      ?.map((sort) =>
        sort.direction === "asc" ? `${sort.key}` : `-${sort.key}`
      )
      .join(",")}`;
  }

  if (searchQuery) {
    queryParams += `&search=${searchQuery}`;
  }

  if (matchType) {
    queryParams += `&match_type=${matchType}`;
  }

  return useInfiniteQuery({
    queryKey: getProjectContentsQueryKey(workspace.id, queryParams),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<ProjectResults>(
        `/api/v1/projects/?workspace=${workspace.id}&page=${pageParam}${queryParams}`
      );
      return data.data;
    },
    enabled: !!workspace.id,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useProjectStatusesQuery = () => {
  const api = useApi();

  return useQuery({
    queryKey: getProjectStatusesQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<ProjectStatusResults>(
        `/api/v1/project_status/`
      );
      return data;
    },
  });
};

export const useSelectedProjectQuery = ({
  projectId,
}: SelectedProjectQueryParams) => {
  const api = useApi();

  return useQuery({
    queryKey: getSelectedProjectQueryKey(projectId),
    enabled: !!projectId,
    queryFn: async () => {
      const { data } = await api.get<SelectedProjectResults>(
        `/api/v1/projects/${projectId}/`
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

export const useSelectedProjectMembersQuery = ({
  projectId,
  searchQuery,
}: SelectedProjectQueryParams) => {
  const api = useApi();

  return useQuery({
    queryKey: getSelectedProjectMembersQueryKey(projectId, searchQuery),
    enabled: !!projectId,
    queryFn: async () => {
      const { data } = await api.get<SelectedProjectMembersResults>(
        `/api/v1/projects/${projectId}/users/${
          searchQuery ? `?search=${searchQuery}` : ""
        }`
      );
      return data;
    },
  });
};

export type ProjectLibraryContentsQueryParams = {
  filters: Filter[];
  sorts: Sort[];
  flatten: boolean;
  searchQuery: string;
  matchType: "all" | "any";
};

export type ProjectTaskFilterType =
  | "name"
  | "assigned_user"
  | "team"
  | "status"
  | "step_type"
  | "blocked"
  | "blocking";

export interface ProjectTaskFilter {
  id: string;
  key?: string;
  label: string;
  type: ProjectTaskFilterType;
  value: string | null;
}

export const useProjectLibraryContentsQuery = (
  projectId: string,
  parentId: string | null = null,
  { filters, sorts, searchQuery, matchType }: ProjectLibraryContentsQueryParams
) => {
  const api = useApi();
  // const { workspace } = useWorkspace();

  // const { flattenFolders } = useProjectStore();

  // const { isFlattened } = useProjectLibraryFilterState();

  const queryParams = generateProjectLibraryQueryParams({
    filters,
    sorts,
    flatten: false,
    searchQuery,
    matchType,
  });

  return useInfiniteQuery({
    queryKey: [
      ...getProjectLibraryContentsQueryKey(projectId as string, parentId),
      queryParams,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<LibraryResults>(
        `/api/v1/projects_library/?project=${projectId}${
          parentId ? `&parent=${parentId}` : ""
        }&page=${pageParam}${queryParams}`
      );
      return data.data;
    },
    enabled: !!projectId,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
  });
};

export const useProjectAssetDetailsQuery = (
  assetId: string,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {}
) => {
  const api = useApi();

  return useQuery({
    queryKey: getProjectAssetDetailsQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<AssetDetails>(
        `/api/v1/projects_library/${assetId}/`
      );
      return data;
    },
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
    enabled: !!assetId && enabled,
    refetchOnWindowFocus: false,
  });
};

export interface ProjectTasksContentsQueryParams {
  searchQuery: string;
  assignedUser: string;
  team: string;
  status: TaskStatus[];
  stepType: string;
  blocked: boolean;
  blocking: boolean;
  match_type: "all" | "any";
  workflow: WorkflowTemplate[];
  sorts?: Sort[];
}

export const useTaskListQuery = (
  id: string,
  type: "project" | "workspace",
  {
    searchQuery,
    assignedUser,
    team,
    status,
    stepType,
    blocked,
    blocking,
    workflow,
    sorts,
  }: ProjectTasksContentsQueryParams
) => {
  const api = useApi();

  return useQuery({
    queryKey: [
      ...getTaskListQueryKey(id, type, {
        searchQuery,
        assignedUser,
        team,
        status,
        stepType,
        blocked,
        blocking,
        match_type: "all",
        workflow,
        sorts,
      }),
    ],
    queryFn: async () => {
      const mappedString = workflow
        ?.map((s) => "workflow=".concat(s.id))
        .join("&");
      const statusString = status
        ?.map((s) => "status=".concat(s.status_name))
        .join("&");
      let queryParams = "";
      if (sorts && sorts?.length > 0) {
        queryParams = `&sort=${sorts
          ?.map((sort) =>
            sort.direction === "asc" ? `${sort.key}` : `-${sort.key}`
          )
          .join(",")}`;
      }
      const { data } = await api.get<TaskListResponse>(
        `/api/v1/project_step_instance/all-tasks/${
          type === "project"
            ? `?project_id=${id}`
            : type === "workspace"
            ? `?workspace_id=${id}`
            : ""
        }${queryParams ? queryParams : ""}${
          searchQuery ? `&search=${searchQuery}` : ""
        }${assignedUser ? `&assigned_user=${assignedUser}` : ""}${
          team ? `&team=${team}` : ""
        }${stepType ? `&step_type=${stepType}` : ""}${
          blocked ? `&blocked=${blocked}` : ""
        }${blocking ? `&blocking=${blocking}` : ""}${
          workflow?.length > 0 ? `&${mappedString}` : ""
        }${status?.length > 0 ? `&${statusString}` : ""}`
      );
      return data;
    },
    enabled: !!id,
  });
};

export const useAffectedStepsQuery = (statusId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getAffectedStepsQueryKey(statusId),
    queryFn: async () => {
      const { data } = await api.get<AffectedStepsResponse>(
        `/api/v1/project_step_status/${statusId}/affected-steps/`
      );
      return data;
    },
    enabled: !!statusId,
  });
};

// task history API
export const useTaskHistoryQuery = (taskId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getTaskHistoryQueryKey(taskId),
    queryFn: async () => {
      const { data } = await api.get<TaskHistoryResults>(
        `/api/v1/project_step_instance/${taskId}/history/`
      );
      return data;
    },
    enabled: !!taskId && taskId !== "1",
  });
};

export const useTaskIncomingFiles = (stepId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getTaskIncomingFilesQueryKey(stepId),
    queryFn: async () => {
      const { data } = await api.get<IncomingFileResults>(
        `/api/v1/project_step_instance/${stepId}/incoming-assets/`
      );
      return data;
    },
    enabled: !!stepId,
  });
};

export const useTaskOutgoingFiles = (stepId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getTaskOutgoingFilesQueryKey(stepId),
    queryFn: async () => {
      const { data } = await api.get<IncomingFileResults>(
        `/api/v1/project_step_instance/${stepId}/outgoing-assets/`
      );
      return data;
    },
    enabled: !!stepId,
  });
};

export const useProjectTreeQuery = (
  projectId: string,
  parentId: string | null,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {}
) => {
  const api = useApi();
  // const { workspace } = useWorkspace();

  return useInfiniteQuery({
    queryKey: getProjectTreeQueryKey(projectId, parentId),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<ProjectTreeResult>(
        `/api/v1/projects_library/library_tree/?project=${projectId}${
          parentId ? `&parent=${parentId}` : ""
        }&page=${pageParam}`
      );
      return data.data;
    },
    enabled: !!projectId && enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useAllTaskListQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  return useQuery({
    queryKey: getAllTaskListQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<TaskListResponse>(
        `/api/v1/project_step_instance/get-user-all-tasks/?workspace=${workspace?.id}`
      );
      return data;
    },
  });
};

export const useAllGlobalTaskListQuery = ({
  searchQuery,
  assignedUser,
  team,
  status,
  stepType,
  blocked,
  blocking,
  match_type,
  workflow,
  sorts,
}: ProjectTasksContentsQueryParams) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  return useInfiniteQuery({
    queryKey: [
      ...getGlobalTaskListQueryKey(
        searchQuery,
        assignedUser,
        team,
        status,
        stepType,
        blocked,
        blocking,
        match_type,
        workflow,
        sorts
      ),
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const mappedString = workflow
        ?.map((s) => "workflow=".concat(s.id))
        .join("&");
      const statusString = status
        ?.map((s) => "status=".concat(s.status_name))
        .join("&");
      let queryParams = "";

      if (sorts && sorts?.length > 0) {
        queryParams = `&sort=${sorts
          ?.map((sort) =>
            sort.direction === "asc" ? `${sort.key}` : `-${sort.key}`
          )
          .join(",")}`;
      }

      const { data } = await api.get<GlobalTaskListResponse>(
        `/api/v1/project_step_instance/all-global-tasks/?workspace_id=${
          workspace?.id
        }${pageParam ? `&page=${pageParam}` : ""}${
          queryParams ? queryParams : ""
        }${searchQuery ? `&search=${searchQuery}` : ""}${
          match_type ? `&match_type=${match_type}` : ""
        }${assignedUser ? `&assigned_user=${assignedUser}` : ""}${
          team ? `&team=${team}` : ""
        }${stepType ? `&step_type=${stepType}` : ""}${
          blocked ? `&blocked=${blocked}` : ""
        }${blocking ? `&blocking=${blocking}` : ""}${
          workflow?.length > 0 ? `&${mappedString}` : ""
        }${status?.length > 0 ? `&${statusString}` : ""}`
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

// Metadata

export const useProjectMetadataQuery = (
  instaceId: string,
  instanceType: "project" | "file"
) => {
  const api = useApi();
  return useQuery({
    queryKey: getProjectMetadataQueryKey(instaceId, instanceType),
    queryFn: async () => {
      const { data } = await api.get<ProjectMetadataResults>(
        `/api/v1/project_metadata/?instance_id=${instaceId}&instance_type=${instanceType}`
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

export const useModificationDetails = (fieldId: string, enabled: boolean) => {
  const api = useApi();

  return useQuery({
    queryKey: getModificationDetailsQueryKey(fieldId),
    queryFn: async () => {
      const { data } = await api.get<GetModificationDetailsResponse>(
        `/api/v1/project_metadata/${fieldId}/get_modification_details/`
      );
      return data;
    },
    enabled,
  });
};

export const useTaskStatusList = (
  id: string,
  type: "project" | "workspace"
) => {
  const api = useApi();
  return useQuery({
    queryKey: getTaskStatusListQueryKey(id, type),
    queryFn: async () => {
      const { data } = await api.get<TaskStatusListResults>(
        `/api/v1/project-step-status-configs/unique-status-names/${
          type === "project"
            ? `?project_id=${id}`
            : type === "workspace"
            ? `?workspace_id=${id}`
            : ""
        }`
      );
      return data;
    },
  });
};

export const useTaskStepTypeList = (workspaceId: string) => {
  const api = useApi();
  return useQuery({
    queryKey: getTaskStepTypeListQueryKey(workspaceId),
    queryFn: async () => {
      const { data } = await api.get<TaskStepTypeListResults>(
        `/api/v1/step_type/${workspaceId ? `?workspace_id=${workspaceId}` : ""}`
      );
      return data;
    },
  });
};

export const useGenerateFiltersWithAI = (query: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getAIGeneratedFiltersQueryKey(workspace.id, query),
    queryFn: async () => {
      const { data } = await api.get<AIGeneratedFiltersResponse>(
        `/api/v1/projects_library/generate_filters/?workspace=${workspace.id}&query=${query}`
      );
      return data;
    },
    enabled: !!workspace.id && !!query,
  });
};

// get task details
export const useTaskDetails = (taskId: string) => {
  const api = useApi();
  return useQuery({
    queryKey: getTaskDetailsQueryKey(taskId),
    queryFn: async () => {
      const { data } = await api.get<TaskDetailsResult>(
        `/api/v1/project_step_instance/${taskId}`
      );
      return data;
    },
    enabled: !!taskId && taskId !== "1",
  });
};
