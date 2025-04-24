// import { useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

const workflowId = "123";

import {
  getWorkflowMetadataFieldsQueryKey,
  getWorkflowTemplateConnectionEdges,
  getWorkflowTemplatesConversation,
  getWorkflowTemplatesQueryKey,
  getWorkflowTemplateStepsListQueryKey,
} from "../queries/workflow";
import {
  AddFieldToWorkflowMetadataMutation,
  CreateCustomStatusMutation,
  CreatePromptMutation,
  // CreatePromptResponse,
  CreateWorkflowConnectionMutation,
  CreateWorkflowStepMutation,
  CreateWorkflowTemplateMutation,
  DeleteWorkflowConnectionMutation,
  EditWorkflowMetadataFieldOptionsMutation,
  EditWorkflowStepMutation,
  EditWorkflowStepPositionPayload,
  ReorderFieldsInTemplateCategoryMutation,
  UpdateStepConnectionTypeMutation,
  UpdateStepStatusDefaultMutation,
  WorkflowTemplate,
} from "../types/workflow";

export const useRenameWorkflowTemplate = (templateId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await api.patch(
        `/api/v1/workflow_templates/${templateId}/`,
        {
          name: newName,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplatesQueryKey(workspace.id, ""),
      });
      toast.success("Workflow renamed successfully");
    },
    onError: () => {
      toast.error("Failed to rename workflow");
    },
  });
};

export const useDeleteWorkflowTemplate = (templateId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(
        `/api/v1/workflow_templates/${templateId}/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplatesQueryKey(workspace.id, ""),
      });
      toast.success("Workflow deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete workflow");
    },
  });
};

export const useDuplicateWorkflowTemplate = (stepId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/api/v1/workflow_templates/${stepId}/duplicate/`
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplatesQueryKey(workspace.id, ""),
      });
      toast.success("Workflow duplicated successfully");
    },
    onError: () => {
      toast.error("Failed to duplicate workflow");
    },
  });
};

export const useCreateWorkflowTemplate = (
  onSuccess?: (data: WorkflowTemplate) => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: CreateWorkflowTemplateMutation) => {
      const { data } = await api.post(`/api/v1/workflow_templates/`, payload);
      return data;
    },
    onSuccess: (data: WorkflowTemplate) => {
      onSuccess?.(data);
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplatesQueryKey(workspace.id, ""),
      });
      toast.success("Workflow created successfully");
    },
    onError: () => {
      toast.error("Failed to create workflow");
    },
  });
};

export const useCreateWorkflowStep = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateWorkflowStepMutation) => {
      const { data } = await api.post(`/api/v1/step_template/`, payload);
      return { data };
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateStepsListQueryKey(data.workflow_template),
      });
      toast.success("Workflow step created successfully");
    },
    onError: () => {
      toast.error("Failed to create workflow step");
    },
  });
};

export const useEditWorkflowStep = (stepId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditWorkflowStepMutation) => {
      const { data } = await api.patch(
        `/api/v1/step_template/${stepId}/`,
        payload
      );
      return { data };
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateStepsListQueryKey(data.workflow_template),
      });
      toast.success("Workflow step updated");
    },
    onError: () => {
      toast.error("Failed to update workflow step");
    },
  });
};

export const useEditWorkflowStepPosition = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stepId,
      payload,
    }: {
      stepId: string;
      payload: EditWorkflowStepPositionPayload;
    }) => {
      const { data } = await api.patch(
        `/api/v1/step_template/${stepId}/`,
        payload
      );
      return { data };
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateStepsListQueryKey(data.workflow_template),
      });
    },
  });
};

export const useDeleteWorkflowStep = (
  stepId: string,
  workflowTemplateId: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/api/v1/step_template/${stepId}/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateStepsListQueryKey(workflowTemplateId),
      });
      toast.success("Workflow step deleted");
    },
    onError: () => {
      toast.error("Failed to delete workflow step");
    },
  });
};

export const useCreateCustomStatus = (stepId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  // const { workflowId } = useParams();

  return useMutation({
    mutationFn: async (payload: CreateCustomStatusMutation) => {
      const { data } = await api.post(
        `/api/v1/step_template/${stepId}/add-custom-status/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateStepsListQueryKey(workflowId as string),
      });
    },
  });
};

export const useCreateWorkflowConnection = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  // const { workflowId } = useParams();

  return useMutation({
    mutationFn: async (payload: CreateWorkflowConnectionMutation) => {
      const { data } = await api.post(`/api/v1/step_connection/`, payload);
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateConnectionEdges(workflowId as string),
      });
    },
  });
};

export const useDeleteWorkflowConnection = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  // const { workflowId } = useParams();

  return useMutation({
    mutationFn: async (payload: DeleteWorkflowConnectionMutation) => {
      const { data } = await api.post(
        `/api/v1/step_connection/delete/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateConnectionEdges(workflowId as string),
      });
    },
  });
};

export const useUpdateStepConnectionType = (id: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  // const { workflowId } = useParams();

  return useMutation({
    mutationFn: async (payload: UpdateStepConnectionTypeMutation) => {
      const { data } = await api.patch(
        `/api/v1/step_connection/${id}/update-connection-type/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateConnectionEdges(workflowId as string),
      });
    },
  });
};

export const useDefaultStatusUpdate = (status_id: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  // const { workflowId } = useParams();

  return useMutation({
    mutationFn: async (payload: UpdateStepStatusDefaultMutation) => {
      const { data } = await api.post(
        `/api/v1/step_template_status_config/${status_id}/set_default_status/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowTemplateStepsListQueryKey(workflowId as string),
      });
    },
  });
};

export const useDownloadWorkflow = (workflowId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(
        `/api/v1/workflow_templates/${workflowId}/gen-pdf-doc/`
      );
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute(
        "download",
        `Workflow_template-${dayjs().format("DD-MM-YYYY")}.pdf`
      );
      a.click();
    },
  });
};

export const useCreatePrompt = (workflowId: string, onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePromptMutation) => {
      const formData = new FormData();
      formData.append("prompt", payload.prompt);
      if (payload.image_file) {
        formData.append("image_file", payload.image_file);
      }
      if (payload.audio_file) {
        formData.append("audio_file", payload.audio_file);
      }
      const response = await api.post(
        `/api/v1/workflow_templates/${workflowId}/unified-prompt/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const contentType = response.headers["content-type"];

      if (contentType === "application/pdf") {
        // Handle PDF download
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `workflow-${workflowId}-${dayjs().format("DD-MM-YYYY")}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        return { isPdf: true };
      } else {
        // Handle JSON response
        const data = JSON.parse(await response.data.text());
        return { data, isPdf: false };
      }
    },
    onSuccess: (result) => {
      if (!result.isPdf) {
        onSuccess?.();
        queryClient.invalidateQueries({
          queryKey: getWorkflowTemplatesConversation(workflowId as string),
        });
        queryClient.invalidateQueries({
          queryKey: getWorkflowTemplateStepsListQueryKey(workflowId as string),
        });
        queryClient.invalidateQueries({
          queryKey: getWorkflowTemplateConnectionEdges(workflowId as string),
        });
      }
    },
  });
};

// Workflow Metadata

export const useAddFieldToWorkflowMetadata = (workflowId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddFieldToWorkflowMetadataMutation) => {
      const { data } = await api.post(
        `/api/v1/project_metadata_template/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowMetadataFieldsQueryKey(workflowId as string),
      });
    },
  });
};

export const useDeleteFieldFromWorkflowMetadata = (workflowId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { data } = await api.delete(
        `/api/v1/project_metadata_template/${fieldId}/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowMetadataFieldsQueryKey(workflowId as string),
      });
      toast.success("Metadata field deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete metadata field");
    },
  });
};

export const useEditWorkflowMetadataFieldOptions = (fieldId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  // const { workflowId } = useParams();

  return useMutation({
    mutationFn: async (payload: EditWorkflowMetadataFieldOptionsMutation) => {
      const { data } = await api.put(
        `/api/v1/project_metadata_template/${fieldId}/`,
        payload
      );
      return { data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowMetadataFieldsQueryKey(workflowId as string),
      });
    },
  });
};

export const useReorderFieldsInTemplateCategory = (workflowId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReorderFieldsInTemplateCategoryMutation) => {
      const { data } = await api.post(
        `/api/v1/project_metadata_template/reorder/`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getWorkflowMetadataFieldsQueryKey(workflowId as string),
      });
    },
  });
};
