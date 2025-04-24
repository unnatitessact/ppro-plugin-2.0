// import { useParams } from 'next/navigation';

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import fileDownload from "js-file-download";
import { toast } from "sonner";

import { showToast } from "../../components/ui/ToastContent";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import { useParamsStateStore } from "../../stores/params-state-store";

import {
  getProjectAssetDetailsQueryKey,
  getProjectContentsQueryKey,
  getProjectLibraryContentsQueryKey,
  getProjectMetadataQueryKey,
  getProjectTreeQueryKey,
  getSelectedProjectMembersQueryKey,
  getSelectedProjectQueryKey,
  getTaskDetailsQueryKey,
  getTaskHistoryQueryKey,
  getTaskListQueryKey,
  useProjectLibraryContentsQueryKey,
} from "../queries/projects";
import {
  CreateDocumentPayload,
  CreateFolderPayload,
  CreatePhysicalAssetPayload,
  FileStatus,
} from "../types/library";
import { MetadataFieldValue } from "../types/metadata";
import {
  AddFilesToProjectStepMutation,
  AddFileToVersionStackPayload,
  AddLibraryFilesToProjectMutation,
  AddProjectFilesToProjectMutation,
  ArchiveUnarchiveProjectsMutation,
  CreateNewTaskMutation,
  CreateNewWorkflowTaskMutation,
  CreateProjectMutation,
  CreateVersionStackPayload,
  DuplicateProjectMutation,
  EditProjectMutation,
  IncomingFile,
  LibraryResults,
  PassMultipleProjectIdsMutation,
  ProjectMetadata,
  RemoveFileFromVersionStackPayload,
  ReorderVersionStackPayload,
  UpdateProjectMemberMutation,
  UpdateProjectMemberRoleMutation,
  UpdateTaskCardDetailsMutation,
  VersionStackItem,
  LibraryAsset,
} from "../types/projects";

export const getAddMetadataFieldMutationKey = (
  instanceId: string,
  instanceType: "project" | "file"
) => ["add-metadata-field", instanceId, instanceType];

// Library integration starts

export const useCreateFolder = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId as string;
  return useMutation({
    mutationFn: async (folder: CreateFolderPayload) => {
      const { data } = await api.post(`/api/v1/projects_library/folder/`, {
        name: folder.name,
        parent: parentId || undefined,
        project: projectId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      toast.success("Folder created successfully");
    },
    onError: () => {
      toast.error("Failed to create folder");
    },
  });
};

export const useCreatePhysicalAsset = (parentId: string | null) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId as string;

  return useMutation({
    mutationFn: async (asset: CreatePhysicalAssetPayload) => {
      const formData = new FormData();

      formData.append("name", asset.name);
      formData.append("barcode", asset.barcode);
      formData.append("location", asset.location);
      formData.append("workspace", workspace.id);
      formData.append("project", projectId as string);

      if (parentId) {
        formData.append("parent", parentId);
      }
      if (asset.asset_image) {
        formData.append("asset_image", asset.asset_image);
      }

      const { data } = await api.post(
        `/api/v1/projects_library/physical_asset/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      toast.success("Physical asset created successfully");
    },
    onError: () => {
      toast.error("Failed to create physical asset");
    },
  });
};

export const useAddImageToPhysicalAsset = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId;
  // const parentId = useParams().folderId;
  return useMutation({
    mutationFn: async (image: File) => {
      const formData = new FormData();
      formData.append("asset_image", image);

      const { data } = await api.patch(
        `/api/v1/projects_library/${assetId}/update_physical_asset_image/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
    },
    onError: () => {
      toast.error("Failed to add image");
    },
  });
};

export const useRenameAsset = (assetId: string) => {
  const api = useApi();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId as string;
  // const parentId = useParams().folderId as string | null;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await api.patch(
        `/api/v1/projects_library/${assetId}/rename/`,
        {
          name: newName,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectAssetDetailsQueryKey(assetId),
      });
      toast.success("Asset renamed successfully");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description: "You do not have the permission to rename this asset",
        });
      }
      throw error;
    },
  });
};

export const useDeleteAsset = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId as string;
  // const parentId = useParams().folderId as string | null;

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/api/v1/projects_library/${assetId}/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      toast.success("Asset deleted successfully");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description: "You do not have the permission to delete this asset",
        });
      }
      throw error;
    },
  });
};

export const useConnectExternalFolder = (
  connectionId: string,
  parent: string | null
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId as string;

  return useMutation({
    mutationFn: async ({ prefix, name }: { prefix: string; name: string }) => {
      const { data } = await api.post(
        `/api/v1/connected_folders/${connectionId}/connect/`,
        {
          workspace: workspace.id,
          name,
          prefix,
          parent,
          project: projectId,
          category: "project",
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parent ? (parent as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parent),
      });
    },
  });
};

// Library integration ends

export const useCreateProject = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: CreateProjectMutation) => {
      await api.post(`/api/v1/projects/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspace.id, "projectList"],
      });
      queryClient.invalidateQueries({
        queryKey: [workspace.id, "projectList"],
      });
      toast.success("Project created successfully");
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
};

export const useEditProject = (projectId: string, onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: EditProjectMutation) => {
      await api.patch(`/api/v1/projects/${projectId}/`, payload);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: getProjectContentsQueryKey(workspace.id),
      });
      showToast({
        state: "success",
        title: "Project updated successfully",
      });
    },
    onError: () => {
      showToast({
        state: "error",
        title: "Failed to update project",
      });
    },
  });
};

export const useDuplicateProject = (projectId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: DuplicateProjectMutation) => {
      await api.post(`/api/v1/projects/${projectId}/duplicate/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectContentsQueryKey(workspace.id),
      });
      toast.success("Project duplicated successfully");
    },
    onError: () => {
      toast.error("Failed to duplicate project");
    },
  });
};

export const useDeleteProject = (projectId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/api/v1/projects/${projectId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectContentsQueryKey(workspace.id),
      });
      toast.success("Project deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
};

export const useDeleteMultipleProjects = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: PassMultipleProjectIdsMutation) => {
      await api.post(`/api/v1/projects/delete_multiple/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectContentsQueryKey(workspace.id),
      });
      toast.success("Projects deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete projects");
    },
  });
};

export const useArchiveMultipleProjects = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: ArchiveUnarchiveProjectsMutation) => {
      await api.post(`/api/v1/projects/archive_multiple/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectContentsQueryKey(workspace.id),
      });
      toast.success("Projects archived successfully");
    },
    onError: () => {
      toast.error("Failed to archive projects");
    },
  });
};

export const useUnarchiveMultipleProjects = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: PassMultipleProjectIdsMutation) => {
      await api.post(`/api/v1/projects/unarchive_multiple/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectContentsQueryKey(workspace.id),
      });
      toast.success("Projects unarchived successfully");
    },
    onError: () => {
      toast.error("Failed to unarchive projects");
    },
  });
};

export const useUpdateProjectMember = (projectId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProjectMemberMutation) => {
      await api.post(`/api/v1/projects/${projectId}/manage_users/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSelectedProjectMembersQueryKey(projectId, ""),
      });
      toast.success("Project member updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project member");
    },
  });
};

export const useUpdateProjectMemberRole = (projectId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProjectMemberRoleMutation) => {
      await api.post(
        `/api/v1/projects/${projectId}/update_user_role/`,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSelectedProjectMembersQueryKey(projectId, ""),
      });
      // toast.success('Project member role updated successfully');
    },
    onError: () => {
      // toast.error('Failed to update project member role');
    },
  });
};

export const useAddFilesToProjectStep = (onSuccess?: () => void) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async ({
      payload,
      connectionId,
    }: {
      payload: AddFilesToProjectStepMutation;
      connectionId: string;
    }) => {
      await api.patch(
        `/api/v1/project_step_connection/${connectionId}/update-attachment/`,
        payload
      );
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: getTaskListQueryKey(projectId as string, "project"),
      });
      toast.success("Files added to task successfully");
    },
    onError: () => {
      toast.error("Failed to add files to task");
    },
  });
};

export const useUpdateTaskCardDetails = (
  taskId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async (payload: UpdateTaskCardDetailsMutation) => {
      await api.post(
        `/api/v1/project_step_instance/${taskId}/update-instance/`,
        payload
      );
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: getTaskListQueryKey(projectId as string, "project", {
          searchQuery: "",
          assignedUser: "",
          team: "",
          status: [],
          stepType: "",
          blocked: false,
          blocking: false,
          match_type: "all",
          workflow: [],
          sorts: [],
        }),
      });
      queryClient.invalidateQueries({
        queryKey: getTaskHistoryQueryKey(taskId),
      });
      queryClient.invalidateQueries({
        queryKey: getSelectedProjectQueryKey(projectId as string),
      });
      queryClient.invalidateQueries({
        queryKey: getTaskDetailsQueryKey(taskId),
      });
      // toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
};

export const useAddLibraryFilesToProject = (
  onSuccess?: (data: IncomingFile[]) => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId;
  // const parentId = useParams().folderId;

  return useMutation({
    mutationFn: async (payload: AddLibraryFilesToProjectMutation) => {
      const { data } = await api.post(
        `/api/v1/projects_library/add_files_to_project/`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      onSuccess?.(data?.data);
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      toast.success("Files added to project library successfully");
    },
    onError: () => {
      toast.error("Failed to add files to project library");
    },
  });
};

export const useAddProjectFilesToProject = (
  onSuccess?: (data: IncomingFile[]) => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId;
  // const parentId = useParams().folderId;

  return useMutation({
    mutationFn: async (payload: AddProjectFilesToProjectMutation) => {
      const { data } = await api.post(
        `/api/v1/projects_library/copy_project_items/`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      onSuccess?.(data?.data);
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      toast.success("Files added to project library successfully");
    },
    onError: () => {
      toast.error("Failed to add files to project library");
    },
  });
};

export const useCreateNewTask = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async (payload: CreateNewTaskMutation) => {
      const { data } = await api.post(
        `/api/v1/project_step_instance/${projectId}/create-step-instance/`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTaskListQueryKey(projectId as string, "project"),
      });
      queryClient.invalidateQueries({
        queryKey: getSelectedProjectQueryKey(projectId as string),
      });
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};

export const useCreateNewWorkflowTask = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async (payload: CreateNewWorkflowTaskMutation) => {
      const { data } = await api.post(
        `/api/v1/project_step_instance/${projectId}/add-custom-step/`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTaskListQueryKey(projectId as string, "project"),
      });
      queryClient.invalidateQueries({
        queryKey: getSelectedProjectQueryKey(projectId as string),
      });
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};

export const useUpdateMetadataValue = (
  fieldId: string,
  instanceId: string,
  instanceType: "project" | "file"
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: MetadataFieldValue) => {
      const { data } = await api.patch(`/api/v1/project_metadata/${fieldId}/`, {
        value,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectMetadataQueryKey(instanceId, instanceType),
      });
    },
  });
};

export const useAddFieldToMetadataList = (
  instanceId: string,
  instanceType: "project" | "file"
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getAddMetadataFieldMutationKey(instanceId, instanceType),
    mutationFn: async (fieldId: string) => {
      const { data } = await api.post<ProjectMetadata>(
        `/api/v1/project_metadata/`,
        {
          field: fieldId,
          instance_id: instanceId,
          instance_type: instanceType,
          value: "",
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectMetadataQueryKey(instanceId, instanceType),
      });
    },
  });
};

export const useDeleteMetadataField = (
  instanceId: string,
  instanceType: "project" | "file"
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      await api.delete(`/api/v1/project_metadata/${fieldId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectMetadataQueryKey(instanceId, instanceType),
      });
      toast.success("Metadata field deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete metadata field");
    },
  });
};

export const useDeleteAssets = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId;
  // const parentId = useParams().folderId;

  return useMutation({
    mutationFn: async (items: string[]) => {
      const { data } = await api.post(
        `/api/v1/projects_library/delete_multiple/`,
        { ids: items }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      toast.success("Assets deleted successfully");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description:
            "You do not have the permission to delete some or all of these assets",
        });
      } else {
        toast.error("Failed to delete assets", {
          description:
            "Something went wrong while trying to delete the assets. Please try again.",
        });
      }
      throw error;
    },
  });
};

export const useCopyAssets = (
  projectId: string,
  destinationFolderId: string | null
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: string[]) => {
      const { data } = await api.post(
        `/api/v1/projects_library/copy_contents/`,
        {
          items,
          parent: destinationFolderId,
          project: projectId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId,
          destinationFolderId
        ),
      });
      toast.success("Assets copied successfully");
    },
    onError: () => {
      toast.error("Failed to copy assets", {
        description:
          "Something went wrong while trying to copy the assets. Please try again.",
      });
    },
  });
};

export const useMoveAssets = (hideToast?: boolean) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { projectId, projectFolderId: folderId } = useParamsStateStore();
  // const { projectId, folderId } = useParams() as {
  //   projectId: string;
  //   folderId: string | null;
  // };

  return useMutation({
    mutationFn: async ({
      items,
      destinationFolderId,
    }: {
      items: string[];
      projectId?: string;
      destinationFolderId: string | null;
    }) => {
      const { data } = await api.post(
        `/api/v1/projects_library/move_contents/`,
        {
          items,
          parent: destinationFolderId,
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          variables?.projectId ?? projectId,
          folderId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          variables?.projectId ?? projectId,
          variables?.destinationFolderId
        ),
      });
      if (!hideToast) {
        toast.success("Assets moved successfully");
      }
    },
    onError: () => {
      if (!hideToast) {
        toast.error("Failed to move assets", {
          description:
            "Something went wrong while trying to move the assets. Please try again.",
        });
      }
    },
  });
};

export const useDeleteTask = (
  projectId: string,
  taskId: string,
  onSuccess?: () => void
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/api/v1/project_step_instance/${taskId}/`);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: getTaskListQueryKey(projectId as string, "project"),
      });
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
};

export const useDownloadMetadata = (assetId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(
        `/api/v1/projects_library/${assetId}/metadata_report/`,
        {
          responseType: "blob",
        }
      );
      fileDownload(data, `metadata-${assetId}.xlsx`);
    },
  });
};

// New modals

export const useCreateDocument = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      const { data } = await api.post(
        `/api/v1/projects_library/new_document_file/`,
        {
          name: payload.name,
          parent: parentId,
          category: payload.category,
          project: projectId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId as string, parentId),
      });
      toast.success("Document created successfully");
    },
  });
};

export const useCreateCanvas = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      const { data } = await api.post(
        `/api/v1/projects_library/new_canvas_file/`,
        {
          name: payload.name,
          parent: parentId,
          category: payload.category,
          project: projectId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId as string, parentId),
      });
      toast.success("Canvas created successfully");
    },
  });
};

export const useCreateVideoDraft = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId } = useParamsStateStore();
  // const projectId = useParams().projectId;

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      const { data } = await api.post(
        `/api/v1/projects_library/new_draft_file/`,
        {
          name: payload.name,
          parent: parentId,
          category: payload.category,
          project: projectId,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId as string, parentId),
      });
      toast.success("Video draft created successfully");
    },
  });
};

export const useUpdateProjectFileStatus = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { projectId, projectFolderId: parentId } = useParamsStateStore();
  // const projectId = useParams().projectId;
  // const parentId = useParams().folderId;

  return useMutation({
    mutationFn: async (status: FileStatus) => {
      const { data } = await api.patch(
        `/api/v1/projects_library/${assetId}/update_file_status/`,
        {
          file_status: status,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(
          projectId as string,
          parentId ? (parentId as string) : null
        ),
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description:
            "You do not have the permission to update the file status",
        });
      }
      throw error;
    },
  });
};

export const useCreateProjectVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { projectId, projectFolderId: folderId } = useParamsStateStore();
  // const { folderId, projectId } = useParams() as {
  //   folderId?: string;
  //   projectId: string;
  // };

  const parentId = folderId ? folderId : null;

  return useMutation({
    mutationKey: ["add-version-stack"],
    mutationFn: async (payload: CreateVersionStackPayload) => {
      const { data } = await api.post(
        `/api/v1/projects_library/create_version_stack/`,
        {
          ...(folderId ? { parent_folder_id: folderId } : {}),
          file_ids: payload.file_ids,

          project_id: projectId,
        }
      );

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(projectId, parentId),
      });
    },
  });
};

export const useAddToProjectVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { projectId, projectFolderId: folderId } = useParamsStateStore();
  // const { folderId, projectId } = useParams() as {
  //   folderId?: string;
  //   projectId: string;
  // };

  const parentId = folderId ? folderId : null;

  return useMutation({
    mutationKey: ["add-version-stack"],
    mutationFn: async (payload: AddFileToVersionStackPayload) => {
      const { data } = await api.post(
        `/api/v1/projects_library/${payload.version_stack_id}/add_files_to_version_stack/`,
        {
          ...payload,
          project_id: projectId,
        }
      );

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(projectId, parentId),
      });
    },
  });
};

export const useRemoveFromProjectVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { projectId, projectFolderId: folderId } = useParamsStateStore();
  // const { folderId, projectId } = useParams() as {
  //   folderId?: string;
  //   projectId: string;
  // };

  const parentId = folderId ? folderId : null;

  return useMutation({
    mutationKey: ["remove-from-version"],
    mutationFn: async (payload: RemoveFileFromVersionStackPayload) => {
      const { data } = await api.delete(
        `/api/v1/projects_library/${payload.version_stack_id}/remove_file_from_version_stack/`,
        {
          data: {
            ...payload,
            project_id: projectId,
          },
        }
      );

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(projectId, parentId),
      });
    },
  });
};

export const useReorderProjectVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { projectId, projectFolderId: folderId } = useParamsStateStore();
  // const { folderId, projectId } = useParams() as {
  //   folderId?: string;
  //   projectId: string;
  // };

  const parentId = folderId ? folderId : null;

  // const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const libraryContentQueryKey = useProjectLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getProjectTreeQueryKey(projectId, parentId);

  return useMutation({
    mutationFn: async (payload: ReorderVersionStackPayload) => {
      const { data } = await api.post(
        `/api/v1/projects_library/${payload.version_stack_id}/reorder_version_stack/`,
        {
          ...payload,
          project_id: projectId,
        }
      );

      return data;
    },

    onMutate: (payload) => {
      queryClient.cancelQueries({
        queryKey: libraryContentQueryKey,
      });

      queryClient.cancelQueries({
        queryKey: treeContentQueryKey,
      });

      const previousLibraryContentData = queryClient.getQueryData(
        libraryContentQueryKey
      );
      const previousTreeContentData =
        queryClient.getQueryData(treeContentQueryKey);

      queryClient.setQueryData(
        libraryContentQueryKey,
        (prevData: InfiniteData<LibraryResults["data"]> | undefined) => {
          if (!prevData) {
            return prevData;
          }

          const newData: InfiniteData<LibraryResults["data"]> = {
            ...prevData,
            pages: prevData.pages.map((page) => {
              return {
                ...page,
                results: page.results.map((result: LibraryAsset) => {
                  if (
                    result.resourcetype === "ProjectVersionStack" &&
                    result.id === payload.version_stack_id
                  ) {
                    const newVersionOrderWithObjects: VersionStackItem[] = [];
                    payload.new_order.forEach((new_order_file_id, index) => {
                      const newVersionOrderObject = result.versions.find(
                        (version: VersionStackItem) =>
                          version.file.id === new_order_file_id
                      );

                      if (newVersionOrderObject) {
                        newVersionOrderObject.version_number =
                          payload.new_order.length - index;
                        newVersionOrderWithObjects.push(newVersionOrderObject);
                      }
                    });

                    return {
                      ...result,
                      versions: newVersionOrderWithObjects,
                    };
                  }
                  return result;
                }),
              };
            }),
          };

          return newData;
        }
      );

      return {
        previousLibraryContentData,
        previousTreeContentData,
      };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        libraryContentQueryKey,
        context?.previousLibraryContentData
      );
      queryClient.setQueryData(
        treeContentQueryKey,
        context?.previousTreeContentData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getProjectLibraryContentsQueryKey(projectId, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectTreeQueryKey(projectId, parentId),
      });
    },
  });
};

export const useDeleteExternalTaskShare = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async (shareId: string) => {
      const { data } = await api.delete(`/api/v1/task_shares/${shareId}/`);
      return data;
    },
  });
};
