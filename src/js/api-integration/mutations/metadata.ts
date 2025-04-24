import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  getActiveJobsQueryKey,
  getMetadataCategoriesQueryKey,
  getMetadataFieldsForCategoryQueryKey,
  getMetadataFieldsQueryKey,
  getMetadataTemplateQueryKey,
  getMetadataTemplatesQueryKey,
  getModificationDetailsQueryKey,
  getSelectOptionsQueryKey,
} from "../queries/metadata";
import { getProjectMetadataQueryKey } from "../queries/projects";
import {
  AutoFillMetadataFieldPayload,
  AutoFillProjectMetadataFieldPayload,
  AutoTranslateMetadataFieldPayload,
  AutoTranslateProjectMetadataFieldPayload,
  CreateMetadataCategoryPayload,
  CreateMetadataTemplatePayload,
  MetadataFieldType,
  MetadataFieldValue,
  MetadataKeyValueCategoryField,
} from "../types/metadata";

export const getAddLibraryMetadataFieldMutationKey = (categoryId: string) => [
  "add-metadata-field",
  categoryId,
];

export const useCreateMetadataTemplate = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMetadataTemplatePayload) => {
      const { data } = await api.post("/api/v1/metadata_templates/", {
        workspace_id: workspace.id,
        name: payload.name,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplatesQueryKey(workspace.id),
      });
    },
  });
};

export const useRenameMetadataTemplate = (templateId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await api.patch(
        `/api/v1/metadata_templates/${templateId}/`,
        {
          name: newName,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplatesQueryKey(workspace.id),
      });
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useDeleteMetadataTemplate = (templateId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(
        `/api/v1/metadata_templates/${templateId}/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplatesQueryKey(workspace.id),
      });
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useCreateMetadataCategory = (templateId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, isTable }: CreateMetadataCategoryPayload) => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/create_new_category/`,
        { name, is_table: isTable }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useRenameCategoryInTemplate = (
  templateId: string,
  categoryId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/rename_metadata_category/`,
        {
          category_id: categoryId,
          name: newName,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useRemoveCategoryFromTemplate = (
  templateId: string,
  categoryId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/remove_category_from_template/`,
        {
          category_id: categoryId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useCreateNewMetadataField = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fieldName,
      fieldType,
    }: {
      fieldName: string;
      fieldType: MetadataFieldType;
    }) => {
      const { data } = await api.post("/api/v1/metadata_fields/", {
        name: fieldName,
        field_type: fieldType,
        workspace_id: workspace.id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsQueryKey(workspace.id),
      });
    },
  });
};

export const useAddMetadataFieldToCategory = (
  templateId: string,
  categoryId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/add_field_to_category/`,
        {
          category_id: categoryId,
          field_id: fieldId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useRemoveFieldFromCategory = (templateId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/remove_field_from_category/`,
        {
          membership_id: fieldId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useReorderFieldsInTemplateCategory = (
  templateId: string,
  categoryId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/reorder_fields/`,
        {
          membership_ids: newOrder,
          category_id: categoryId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataTemplateQueryKey(templateId),
      });
    },
  });
};

export const useAddNewMetadataCategory = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      isTable,
    }: {
      name: string;
      isTable: boolean;
    }) => {
      const { data } = await api.post(`/api/v1/category_instances/`, {
        file_system_item_id: assetId,
        name: name,
        is_table: isTable,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useApplyMetadataTemplate = (
  templateId: string,
  assetId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/${templateId}/apply_template/`,
        {
          file_system_id: assetId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useCreateNewCategoryInstance = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      isTable,
    }: {
      name: string;
      isTable: boolean;
    }) => {
      const { data } = await api.post(`/api/v1/category_instances/`, {
        file_system_item_id: assetId,
        name: name,
        is_table: isTable,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useEditCategoryInstance = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      name,
    }: {
      categoryId: string;
      name: string;
    }) => {
      const { data } = await api.put(
        `/api/v1/category_instances/${categoryId}/`,
        {
          name: name,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useDeleteCategoryInstance = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { data } = await api.delete(
        `/api/v1/category_instances/${categoryId}/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useReorderCategoryInstances = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      const { data } = await api.post(
        `/api/v1/library/${assetId}/reorder_category_instances/`,
        {
          category_instance_ids: newOrder,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useAddFieldToCategoryInstance = (categoryId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getAddLibraryMetadataFieldMutationKey(categoryId),
    mutationFn: async (fieldId: string) => {
      const { data } = await api.post<MetadataKeyValueCategoryField>(
        `/api/v1/category_instances/${categoryId}/add_field/`,
        {
          field_id: fieldId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
      });
    },
  });
};

export const useUpdateMetadataValue = (fieldId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: MetadataFieldValue) => {
      const { data } = await api.put(`/api/v1/value_instances/${fieldId}/`, {
        value,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getModificationDetailsQueryKey(fieldId),
      });
      queryClient.invalidateQueries({
        queryKey: ["metadataCategoryFields"],
      });
    },
  });
};

export const useResetMetadata = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/library/${assetId}/reset_metadata/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataCategoriesQueryKey(assetId),
      });
    },
  });
};

export const useDeleteMetadataField = (categoryId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { data } = await api.post(
        `/api/v1/category_instances/${categoryId}/delete_field_membership/`,
        {
          membership_id: fieldId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
      });
    },
  });
};

export const useAddRowToTable = (categoryId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/category_instances/${categoryId}/add_row/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
      });
    },
  });
};

export const useCreateOption = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: string) => {
      const { data } = await api.post(`/api/v1/options/`, {
        value: value,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSelectOptionsQueryKey(),
      });
    },
  });
};

export const useAddOptionToField = (fieldMembershipId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async (optionIds: string[]) => {
      const { data } = await api.post(
        `/api/v1/category_instances/add_options/`,
        {
          field_membership_id: fieldMembershipId,
          options: optionIds,
        }
      );
      return data;
    },
  });
};

export const useAddOptionToTemplateField = (fieldMembershipId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async (optionIds: string[]) => {
      const { data } = await api.post(
        `/api/v1/metadata_templates/add_options/`,
        {
          field_membership_id: fieldMembershipId,
          options: optionIds,
        }
      );
      return data;
    },
  });
};

export const useDeleteMetadataRow = (categoryId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rowId: string) => {
      const { data } = await api.post(
        `/api/v1/category_instances/${categoryId}/delete_row/`,
        {
          row_id: rowId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
      });
    },
  });
};

export const useAutoFillMetadataField = (
  categoryId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AutoFillMetadataFieldPayload) => {
      const { data } = await api.post(
        `/api/v1/category_instances/autofill_metadata/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
      });
      onSuccess?.();
    },
    onError: () => {},
  });
};

export const useAutoTranslateMetadataField = (
  categoryId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AutoTranslateMetadataFieldPayload) => {
      const { data } = await api.post(
        `/api/v1/category_instances/translate_metadata/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMetadataFieldsForCategoryQueryKey(categoryId),
      });
      onSuccess?.();
    },
    onError: () => {},
  });
};

export const useAutoTranslateProjectMetadataField = (
  instanceId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AutoTranslateProjectMetadataFieldPayload) => {
      const { data } = await api.post(
        `/api/v1/project_metadata/translate_metadata/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectMetadataQueryKey(instanceId, "file"),
      });
      queryClient.invalidateQueries({
        queryKey: getActiveJobsQueryKey(instanceId, "file"),
      });
      onSuccess?.();
    },
    onError: () => {},
  });
};

export const useAutoFillProjectMetadataField = (
  instance_id: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AutoFillProjectMetadataFieldPayload) => {
      const { data } = await api.post(
        `/api/v1/project_metadata/autofill_metadata/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectMetadataQueryKey(instance_id, "file"),
      });
      onSuccess?.();
    },
    onError: () => {},
  });
};
