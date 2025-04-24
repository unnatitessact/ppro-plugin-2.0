import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  ActiveTranslationJobList,
  GetCategoryMetadataFieldsResponse,
  GetMetadataCategoriesResponse,
  GetMetadataFieldInfoResponse,
  GetMetadataTemplateDetailResponse,
  GetMetadataTemplatesResponse,
  GetModificationDetailsResponse,
  GetSelectOptionsResponse,
} from "../types/metadata";

// Query keys
export const getMetadataTemplatesQueryKey = (workspaceId: string) => {
  return [workspaceId, "metadataTemplates"];
};

export const getMetadataTemplateQueryKey = (templateId: string) => {
  return ["metadataTemplate", templateId];
};

export const getMetadataFieldsQueryKey = (workspaceId: string) => {
  return [workspaceId, "metadataFields"];
};

export const getMetadataCategoriesQueryKey = (assetId: string) => {
  return ["metadataCategories", assetId];
};

export const getMetadataFieldsForAllCategoriesQueryKey = () => {
  return ["metadataCategoryFields"];
};

export const getMetadataFieldsForCategoryQueryKey = (categoryId: string) => {
  return ["metadataCategoryFields", categoryId];
};

export const getModificationDetailsQueryKey = (fieldId: string) => {
  return ["modificationDetails", fieldId];
};

export const getSelectOptionsQueryKey = () => {
  return ["selectOptions"];
};

export const getActiveJobsQueryKey = (
  instanceId: string,
  instanceType: string
) => {
  return ["activeJobs", instanceId, instanceType];
};

// Queries
export const useMetadataTemplatesQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getMetadataTemplatesQueryKey(workspace.id),
    queryFn: async () => {
      const { data } = await api.get<GetMetadataTemplatesResponse>(
        `/api/v1/metadata_templates/?workspace_id=${workspace.id}`
      );
      return data;
    },
    enabled: !!workspace.id,
  });
};

export const useMetadataTemplateQuery = (templateId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getMetadataTemplateQueryKey(templateId),
    queryFn: async () => {
      const { data } = await api.get<GetMetadataTemplateDetailResponse>(
        `/api/v1/metadata_templates/${templateId}/`
      );
      return data;
    },
  });
};

export const useMetadataFieldsQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useInfiniteQuery({
    queryKey: getMetadataFieldsQueryKey(workspace.id),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<GetMetadataFieldInfoResponse>(
        `/api/v1/metadata_fields/?workspace_id=${workspace.id}&page=${pageParam}`
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

export const useMetadataCategoriesQuery = (assetId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getMetadataCategoriesQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<GetMetadataCategoriesResponse>(
        `/api/v1/library/${assetId}/get_metadata_categories/`
      );
      return data;
    },
  });
};

export const useMetadataFieldsForCategoryQuery = (categoryId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
    queryFn: async () => {
      const { data } = await api.get<GetCategoryMetadataFieldsResponse>(
        `/api/v1/category_instances/${categoryId}/get_metadata_for_category_instance/`
      );
      return data;
    },
    enabled: !!categoryId,
  });
};

export const useModificationDetails = (fieldId: string, enabled: boolean) => {
  const api = useApi();

  return useQuery({
    queryKey: getModificationDetailsQueryKey(fieldId),
    queryFn: async () => {
      const { data } = await api.get<GetModificationDetailsResponse>(
        `/api/v1/value_instances/${fieldId}/get_modification_details/`
      );
      return data;
    },
    enabled,
  });
};

export const useSelectOptionsQuery = () => {
  const api = useApi();

  return useQuery({
    queryKey: getSelectOptionsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<GetSelectOptionsResponse>(
        `/api/v1/options/`
      );
      return data;
    },
  });
};

export const useActiveJobsQuery = (
  instanceId: string,
  instanceType: "project" | "file"
) => {
  const api = useApi();

  return useQuery({
    queryKey: getActiveJobsQueryKey(instanceId, instanceType),
    queryFn: async () => {
      const { data } = await api.get<ActiveTranslationJobList>(
        `/api/v1/active_jobs/?instance_id=${instanceId}&instance_type=${instanceType}`
      );
      return data;
    },
    enabled: !!instanceId && !!instanceType,
  });
};
