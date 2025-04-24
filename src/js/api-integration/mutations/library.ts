import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import fileDownload from "js-file-download";
import { toast } from "sonner";

import { useActionsToasts } from "../../hooks/useActionsToasts";
import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  getAssetDetailsQueryKey,
  getConnectionsQueryKey,
  getLibraryContentsQueryKey,
  getTreeQueryKey,
  getViewQueryKey,
  getViewsQueryKey,
  useLibraryContentsQueryKey,
} from "../queries/library";
import { ConnectionPayload } from "../types/connected-folders";
import {
  AddFileToVersionStackPayload,
  CreateDocumentPayload,
  CreateFolderPayload,
  CreatePhysicalAssetPayload,
  CreateVersionStackPayload,
  CreateViewPayload,
  FileStatus,
  LibraryContentPermissions,
  LibraryContentSubContents,
  LibraryResults,
  RemoveFileFromVersionStackPayload,
  ReorderVersionStackPayload,
  ResourceType,
  VersionStackItem,
  LibraryAsset,
} from "../types/library";

import { useParamsStateStore } from "../../stores/params-state-store";

export const useCreateFolder = (parentId: string | null) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { showToast } = useActionsToasts();

  return useMutation({
    mutationFn: async (folder: CreateFolderPayload) => {
      const { data } = await api.post(`/api/v1/library/folder/`, {
        name: folder.name,
        parent: parentId || undefined,
        workspace: workspace.id,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
      showToast("on_folder_creation", parentId);
    },
  });
};

export const useRenameAsset = (assetId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { folderId } = useParamsStateStore();

  const parentId = folderId ? folderId : null;

  const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getTreeQueryKey(workspace?.id, parentId);

  return useMutation({
    mutationFn: async (newName: string) => {
      const { data } = await api.patch(`/api/v1/library/${assetId}/rename/`, {
        name: newName,
      });
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
                results: page.results
                  .map((result: LibraryAsset) => {
                    if (result.id === assetId) {
                      return {
                        ...result,
                        name: payload,
                      };
                    }
                    return result;
                  })
                  .filter((item: LibraryAsset | null) => item !== null),
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
    onError: (error: AxiosError, _, context) => {
      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description: "You do not have the permission to rename this asset",
        });
      }
      queryClient.setQueryData(
        libraryContentQueryKey,
        context?.previousLibraryContentData
      );
      queryClient.setQueryData(
        treeContentQueryKey,
        context?.previousTreeContentData
      );
      throw error;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, data.parent),
      });
      queryClient.invalidateQueries({
        queryKey: getAssetDetailsQueryKey(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, data.parent),
      });
    },
  });
};

export const useRenameTableAsset = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { folderId } = useParamsStateStore();

  const parentId = folderId ? folderId : null;

  const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getTreeQueryKey(workspace?.id, parentId);

  return useMutation({
    mutationFn: async ({
      newName,
      assetId,
    }: {
      newName: string;
      assetId: string;
    }) => {
      const { data } = await api.patch(`/api/v1/library/${assetId}/rename/`, {
        name: newName,
      });
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
                results: page.results
                  .map((result: LibraryAsset) => {
                    if (result.id === payload?.assetId) {
                      return {
                        ...result,
                        name: payload?.newName,
                      };
                    }
                    return result;
                  })
                  .filter((item: LibraryAsset | null) => item !== null),
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
    onError: (error: AxiosError, _, context) => {
      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description: "You do not have the permission to rename this asset",
        });
      }
      queryClient.setQueryData(
        libraryContentQueryKey,
        context?.previousLibraryContentData
      );
      queryClient.setQueryData(
        treeContentQueryKey,
        context?.previousTreeContentData
      );
      throw error;
    },
    onSettled: (data, _, variables) => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, data.parent),
      });
      queryClient.invalidateQueries({
        queryKey: getAssetDetailsQueryKey(variables?.assetId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, data.parent),
      });
    },
  });
};

export const useDeleteAsset = (assetId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { folderId } = useParamsStateStore();
  const parentId = folderId ? folderId : null;

  const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getTreeQueryKey(workspace?.id, parentId);

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/api/v1/library/${assetId}/`);
      return data;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: libraryContentQueryKey,
      });
      await queryClient.cancelQueries({
        queryKey: treeContentQueryKey,
      });

      // Snapshot the previous value
      const previousLibraryContentData = queryClient.getQueryData(
        libraryContentQueryKey
      );
      const previousTreeContentData =
        queryClient.getQueryData(treeContentQueryKey);

      // Optimistically remove the asset from the list
      queryClient.setQueryData(
        libraryContentQueryKey,
        (prevData: InfiniteData<LibraryResults["data"]> | undefined) => {
          if (!prevData) return prevData;

          const newData: InfiniteData<LibraryResults["data"]> = {
            ...prevData,
            pages: prevData.pages.map((page) => ({
              ...page,
              results: page.results.filter((result) => result.id !== assetId),
            })),
          };
          return newData;
        }
      );

      return { previousLibraryContentData, previousTreeContentData };
    },
    onError: (error: AxiosError, _, context) => {
      // If the mutation fails, restore the previous data
      queryClient.setQueryData(
        libraryContentQueryKey,
        context?.previousLibraryContentData
      );
      queryClient.setQueryData(
        treeContentQueryKey,
        context?.previousTreeContentData
      );

      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description:
            (error.response?.data as { detail?: string })?.detail ||
            "You do not have the permission to delete this asset",
        });
      }
      throw error;
    },
    onSettled: (data) => {
      // Invalidate and refetch to ensure server-side consistency
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, data?.parent),
      });
      queryClient.invalidateQueries({
        queryKey: getAssetDetailsQueryKey(assetId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, data?.parent),
      });
    },
  });
};

export const useDeleteTableAsset = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { folderId } = useParamsStateStore();
  const parentId = folderId ? folderId : null;

  const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getTreeQueryKey(workspace?.id, parentId);

  return useMutation({
    mutationFn: async ({ assetId }: { assetId: string }) => {
      const { data } = await api.delete(`/api/v1/library/${assetId}/`);
      return data;
    },
    onMutate: async ({ assetId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: libraryContentQueryKey,
      });
      await queryClient.cancelQueries({
        queryKey: treeContentQueryKey,
      });

      // Snapshot the previous value
      const previousLibraryContentData = queryClient.getQueryData(
        libraryContentQueryKey
      );
      const previousTreeContentData =
        queryClient.getQueryData(treeContentQueryKey);

      // Optimistically remove the asset from the list
      queryClient.setQueryData(
        libraryContentQueryKey,
        (prevData: InfiniteData<LibraryResults["data"]> | undefined) => {
          if (!prevData) return prevData;

          const newData: InfiniteData<LibraryResults["data"]> = {
            ...prevData,
            pages: prevData.pages.map((page) => ({
              ...page,
              results: page.results.filter((result) => result.id !== assetId),
            })),
          };
          return newData;
        }
      );

      return { previousLibraryContentData, previousTreeContentData };
    },
    onError: (error: AxiosError, _, context) => {
      // If the mutation fails, restore the previous data
      queryClient.setQueryData(
        libraryContentQueryKey,
        context?.previousLibraryContentData
      );
      queryClient.setQueryData(
        treeContentQueryKey,
        context?.previousTreeContentData
      );

      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description: "You do not have the permission to delete this asset",
        });
      }
      throw error;
    },
    onSettled: (data) => {
      // Invalidate and refetch to ensure server-side consistency
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, data?.parent),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, data?.parent),
      });
    },
  });
};

export const useDeleteAssets = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  const { folderId } = useParamsStateStore();
  const parentId = folderId ? folderId : null;

  const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getTreeQueryKey(workspace?.id, parentId);

  return useMutation({
    mutationFn: async (items: string[]) => {
      const { data } = await api.post(`/api/v1/library/delete_multiple/`, {
        ids: items,
      });
      return data;
    },
    onMutate: async (items) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: libraryContentQueryKey,
      });
      await queryClient.cancelQueries({
        queryKey: treeContentQueryKey,
      });

      // Snapshot the previous value
      const previousLibraryContentData = queryClient.getQueryData(
        libraryContentQueryKey
      );
      const previousTreeContentData =
        queryClient.getQueryData(treeContentQueryKey);

      // Optimistically remove the assets from the list
      queryClient.setQueryData(
        libraryContentQueryKey,
        (prevData: InfiniteData<LibraryResults["data"]> | undefined) => {
          if (!prevData) return prevData;

          const newData: InfiniteData<LibraryResults["data"]> = {
            ...prevData,
            pages: prevData.pages.map((page) => ({
              ...page,
              results: page.results.filter(
                (result) => !items.includes(result.id)
              ),
            })),
          };
          return newData;
        }
      );

      return { previousLibraryContentData, previousTreeContentData };
    },
    onError: (error: AxiosError, _, context) => {
      // If the mutation fails, restore the previous data
      queryClient.setQueryData(
        libraryContentQueryKey,
        context?.previousLibraryContentData
      );
      queryClient.setQueryData(
        treeContentQueryKey,
        context?.previousTreeContentData
      );

      if (error.response?.status === 403) {
        toast.error("Permission denied", {
          description:
            "You do not have the permission to delete some or all of these assets",
        });
      }
      throw error;
    },
    onSettled: () => {
      // Invalidate and refetch to ensure server-side consistency
      queryClient.invalidateQueries({
        queryKey: [workspace.id, "library"],
      });
      queryClient.invalidateQueries({
        queryKey: [workspace.id, "tree"],
      });
    },
  });
};

export const useCopyAssets = (destinationFolderId: string | null) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: string[]) => {
      const { data } = await api.post(`/api/v1/library/copy_contents/`, {
        items,
        parent: destinationFolderId,
        workspace: workspace.id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, destinationFolderId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, destinationFolderId),
      });
    },
    onError: () => {
      toast.error("Failed to copy assets", {
        description:
          "Something went wrong while trying to copy the assets. Please try again.",
      });
    },
  });
};

export const useMoveAssets = () => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
      destinationFolderId,
    }: {
      items: string[];
      destinationFolderId: string | null;
    }) => {
      const { data } = await api.post(`/api/v1/library/move_contents/`, {
        items,
        parent: destinationFolderId,
      });
      return data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(
          workspace.id,
          payload.destinationFolderId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, payload.destinationFolderId),
      });
    },
    onError: () => {
      toast.error("Failed to move assets", {
        description:
          "Something went wrong while trying to move the assets. Please try again.",
      });
    },
  });
};

export const useCreatePhysicalAsset = (parentId: string | null) => {
  const api = useApi();
  const { workspace } = useWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asset: CreatePhysicalAssetPayload) => {
      const formData = new FormData();

      formData.append("name", asset.name);
      formData.append("barcode", asset.barcode);
      formData.append("location", asset.location);
      formData.append("workspace", workspace.id);

      if (parentId) {
        formData.append("parent", parentId);
      }
      if (asset.asset_image) {
        formData.append("asset_image", asset.asset_image);
      }

      const { data } = await api.post(
        `/api/v1/library/physical_asset/`,
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
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useAddImageToPhysicalAsset = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: File) => {
      const formData = new FormData();
      formData.append("asset_image", image);

      const { data } = await api.patch(
        `/api/v1/library/${assetId}/update_physical_asset_image/`,
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
        queryKey: getAssetDetailsQueryKey(assetId),
      });
    },
  });
};

export const useAddConnection = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: ConnectionPayload) => {
      const { data } = await api.post(`/api/v1/connected_folders/`, {
        name: payload.name,
        provider: "s3",
        workspace: workspace.id,
        // url: payload.url,
        access_key: payload.access_key,
        secret_key: payload.secret_key,
        bucket_name: payload.bucket_name,
        region: payload.region,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getConnectionsQueryKey(workspace.id),
      });
    },
  });
};

export const useRenameConnection = (connectionId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.patch(
        `/api/v1/connected_folders/${connectionId}/`,
        { name }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getConnectionsQueryKey(workspace.id),
      });
    },
  });
};

export const useDeleteConnection = (connectionId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(
        `/api/v1/connected_folders/${connectionId}/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getConnectionsQueryKey(workspace.id),
      });
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

  return useMutation({
    mutationFn: async ({ prefix, name }: { prefix: string; name: string }) => {
      const { data } = await api.post(
        `/api/v1/connected_folders/${connectionId}/connect/`,
        {
          workspace: workspace.id,
          name,
          prefix,
          parent,
          category: "library",
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parent),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parent),
      });
    },
  });
};

export const useUpdateFileStatus = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: FileStatus) => {
      const { data } = await api.patch(
        `/api/v1/library/${assetId}/update_file_status/`,
        {
          file_status: status,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAssetDetailsQueryKey(assetId),
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

export const useCreateView = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: CreateViewPayload) => {
      const { data } = await api.post(`/api/v1/library_views/`, {
        name: payload.name,
        ai_search_query: payload.ai_search_query,
        workspace: workspace.id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getViewsQueryKey(workspace.id),
      });
    },
  });
};

export const useRenameView = (viewId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.patch(`/api/v1/library_views/${viewId}/`, {
        name,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getViewsQueryKey(workspace.id),
      });
    },
  });
};

export const useDeleteView = (viewId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/api/v1/library_views/${viewId}/`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getViewsQueryKey(workspace.id),
      });
    },
  });
};

export const useUpdateView = (viewId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: Partial<CreateViewPayload>) => {
      const { data } = await api.patch(
        `/api/v1/library_views/${viewId}/`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getViewQueryKey(workspace.id, viewId),
      });
    },
  });
};

export const useDownloadMetadata = (assetId: string) => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(
        `/api/v1/library/${assetId}/metadata_report/`,
        {
          responseType: "blob",
        }
      );
      fileDownload(data, `metadata-${assetId}.xlsx`);
    },
  });
};

export const useCreateDocument = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      const { data } = await api.post(`/api/v1/library/new_document_file/`, {
        name: payload.name,
        parent: parentId,
        category: payload.category,
        workspace: workspace.id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useCreateCanvas = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      const { data } = await api.post(`/api/v1/library/new_canvas_file/`, {
        name: payload.name,
        parent: parentId,
        category: payload.category,
        workspace: workspace.id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useCreateVideoDraft = (parentId: string | null) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: CreateDocumentPayload) => {
      const { data } = await api.post(`/api/v1/library/new_draft_file/`, {
        name: payload.name,
        parent: parentId,
        category: payload.category,
        workspace: workspace.id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useCreateVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { workspace } = useWorkspace();

  const { folderId } = useParamsStateStore();

  const parentId = folderId ? folderId : null;

  return useMutation({
    mutationKey: ["add-version-stack"],
    mutationFn: async (payload: CreateVersionStackPayload) => {
      const { data } = await api.post(`/api/v1/library/create_version_stack/`, {
        ...(folderId ? { parent_folder_id: folderId } : {}),
        file_ids: payload.file_ids,
        workspace_id: workspace.id,
      });

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useAddToVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { workspace } = useWorkspace();

  const { folderId } = useParamsStateStore();

  const parentId = folderId ? folderId : null;

  return useMutation({
    mutationKey: ["add-version-stack"],
    mutationFn: async (payload: AddFileToVersionStackPayload) => {
      const { data } = await api.post(
        `/api/v1/library/${payload.version_stack_id}/add_files_to_version_stack/`,
        payload
      );

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useRemoveFromVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { workspace } = useWorkspace();

  const { folderId } = useParamsStateStore();

  const parentId = folderId ? folderId : null;

  return useMutation({
    mutationKey: ["remove-from-version"],
    mutationFn: async (payload: RemoveFileFromVersionStackPayload) => {
      const { data } = await api.delete(
        `/api/v1/library/${payload.version_stack_id}/remove_file_from_version_stack/`,
        {
          data: payload,
        }
      );

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
      await queryClient.invalidateQueries({
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useReorderVersionStack = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { workspace } = useWorkspace();

  const { folderId } = useParamsStateStore();

  const parentId = folderId ? folderId : null;

  const libraryContentQueryKey = useLibraryContentsQueryKey(parentId);
  const treeContentQueryKey = getTreeQueryKey(workspace?.id, parentId);

  return useMutation({
    mutationFn: async (payload: ReorderVersionStackPayload) => {
      const { data } = await api.post(
        `/api/v1/library/${payload.version_stack_id}/reorder_version_stack/`,
        payload
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
                results: page.results
                  .map((result: LibraryAsset) => {
                    if (
                      result.resourcetype === "VersionStack" &&
                      result.id === payload.version_stack_id
                    ) {
                      const newVersionOrderWithObjects: VersionStackItem[] = [];
                      payload.new_order.forEach((new_order_file_id, index) => {
                        const newVersionOrderObject = result.versions.find(
                          (version) => version.file.id === new_order_file_id
                        );

                        if (newVersionOrderObject) {
                          newVersionOrderObject.version_number =
                            payload.new_order.length - index;
                          newVersionOrderWithObjects.push(
                            newVersionOrderObject
                          );
                        }
                      });

                      return {
                        ...result,
                        versions: newVersionOrderWithObjects,
                      };
                    }
                    return result;
                  })
                  .filter((item: LibraryAsset | null) => item !== null),
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
        queryKey: getLibraryContentsQueryKey(workspace.id, parentId),
      });
      queryClient.invalidateQueries({
        queryKey: getTreeQueryKey(workspace.id, parentId),
      });
    },
  });
};

export const useSetThumbnail = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      time,
      assetId,
    }: {
      time: number;
      assetId: string;
    }) => {
      const timestamp = Math.max(time, 0.01);

      const { data } = await api.post(
        `/api/v1/library/${assetId}/set_thumbnail/`,
        {
          timestamp,
        }
      );

      return data;
    },
  });
};

export const useGetLibraryContentPermissions = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      items: { id: string; resourcetype: ResourceType }[];
      queryKey: QueryKey;
    }) => {
      const { data: permissions } = await api.post<LibraryContentPermissions>(
        `/api/v1/library/asset_permissions/`,
        {
          item_ids: variables.items.map((item) => item.id),
        }
      );

      const folderIds = variables.items
        .filter((item) => item.resourcetype === "Folder")
        .map((item) => item.id);
      const { data: subContents } = await api.post<LibraryContentSubContents>(
        `/api/v1/library/sub_contents/`,
        {
          item_ids: folderIds,
        }
      );
      return {
        permissions,
        subContents,
      };
    },
    onSuccess: async (data, variables) => {
      await queryClient.setQueryData(
        variables.queryKey,
        (libraryContent: InfiniteData<LibraryResults["data"]>) => {
          if (!libraryContent) return;

          // Create a deep clone to avoid mutating the original data
          const newLibraryContent = structuredClone(libraryContent);

          // Update results for all pages
          newLibraryContent.pages = newLibraryContent.pages.map((page) => ({
            ...page,
            results: page.results
              .map((result: LibraryAsset) => {
                const contains = variables.items.some(
                  (item) => item.id === result.id
                );
                if (contains) {
                  return {
                    ...result,
                    permissions: data.permissions[result.id],
                    sub_contents: data.subContents[result.id],
                  };
                }
                // Preserve existing permissions and sub_contents if they exist
                return result;
              })
              .filter((item: LibraryAsset | null) => item !== null),
          }));

          return newLibraryContent;
        }
      );
    },
  });
};

// export const useGetLibraryContentSubContents = () => {
//   const api = useApi();

//   return useMutation({
//     mutationFn: async (items: string[]) => {
//       const { data } = await api.post<InfiniteData>(`/api/v1/library/sub_contents/`, {
//         item_ids: items
//       });
//       return data;
//     }
//   });
// };

// queryClient.setQueryData(
//   libraryContentQueryKey,
//   (prevData: InfiniteData<LibraryResults['data']> | undefined) => {
//     if (!prevData) {
//       return prevData;
//     }

//     const newData: InfiniteData<LibraryResults['data']> = {
//       ...prevData,
//       pages: prevData.pages.map((page) => {
//         return {
//           ...page,
//           results: page.results.map((result) => {
//             if (result.id === assetId) {
//               return {
//                 ...result,
//                 name: payload
//               };
//             }
//             return result;
//           })
//         };
//       })
//     };
//     return newData;
//   }
// );
