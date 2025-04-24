import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useApi } from "../../hooks/useApi";
import { useLibraryFilterState } from "../../hooks/useLibraryFilterState";
import { useWorkspace } from "../../hooks/useWorkspace";

// import { useGetLibraryContentPermissions } from '@/api-integration/mutations/library';
import { generateLibraryQueryParams } from "../queries/utils";
import { ConnectionResults } from "../types/connected-folders";
import {
  AIGeneratedFiltersResponse,
  AssetDetails,
  GetViewsResponse,
  HasDeleteAccessResponse,
  LibraryContentPermissions,
  LibraryContentSubContents,
  LibraryResults,
  ListFoldersOfConnection,
  ResourceType,
  SpriteSheet,
  View,
} from "../types/library";
import { TreeFolderResult, TreeResult } from "../types/tree";

import { Filter, Sort } from "../../stores/library-store";

import { createUrlParams } from "./review";

// Query Keys
export const getLibraryContentsQueryKey = (
  workspaceId: string,
  parentId: string | null
) => {
  return [workspaceId, "library", parentId];
};

// export const getLibraryContentPermissionsQueryKey = (workspaceId: string, assetId: string) => {
//   return [workspaceId, 'libraryContentPermissions', assetId];
// };

export const getLibrarySubcontentsQueryKey = (
  workspaceId: string,
  parentId: string | null,
  isView?: boolean
) => {
  return [
    ...getLibraryContentsQueryKey(workspaceId, parentId),
    "subcontents",
    ...(isView ? ["view"] : []),
  ];
};

export const getLibraryPermissionsQueryKey = (
  workspaceId: string,
  parentId: string | null,
  itemIds: string[],
  isView?: boolean
) => {
  return [
    ...getLibraryContentsQueryKey(workspaceId, parentId),
    "permissions",
    ...(isView ? ["view"] : []),
    [itemIds],
  ];
};

export const getAssetDetailsQueryKey = (assetId: string) => {
  return ["assetDetails", assetId];
};

export const getTreeQueryKey = (
  workspaceId: string,
  parentId: string | null
) => {
  return [workspaceId, "tree", parentId];
};

export const getFoldersQueryKey = (
  workspaceId: string,
  parentId: string | null
) => {
  return [workspaceId, "folders", parentId];
};

export const getConnectionsQueryKey = (workspaceId: string) => {
  return [workspaceId, "connections"];
};

export const getFoldersOfConnectionQueryKey = (
  connectionId: string,
  prefix: string | null
) => {
  return [connectionId, "connectionFolders", prefix];
};

export const getAIGeneratedFiltersQueryKey = (
  workspaceId: string,
  query: string
) => {
  return [workspaceId, "aiFilters", query];
};

export const getViewsQueryKey = (workspaceId: string) => {
  return [workspaceId, "views"];
};

export const getViewQueryKey = (workspaceId: string, viewId: string) => {
  return [workspaceId, "views", viewId];
};

export const getAIViewContentsQueryKey = (
  workspaceId: string,
  aiSearchQuery: string | null
) => {
  return [workspaceId, "aiViews", aiSearchQuery];
};

export const getSpriteSheetQueryKey = (assetId: string) => {
  return ["spriteSheet", assetId];
};

export const getDeleteAccessQueryKey = (
  workspaceId: string,
  items_ids: string[]
) => {
  return [workspaceId, "deleteAccess", items_ids];
};

export type LibraryContentsQueryParams = {
  filters: Filter[];
  sorts: Sort[];
  flatten: boolean;
  searchQuery: string;
  matchType: "all" | "any";
};

// Hooks
export const useLibraryContentsQueryKey = (parentId: string | null) => {
  const { workspace } = useWorkspace();

  // const { search } = useLibraryStore();
  const { filters, filterMatchType, isFlattened, sorts, search } =
    useLibraryFilterState();

  const queryParams = generateLibraryQueryParams({
    filters,
    sorts,
    flatten: isFlattened ?? false,
    searchQuery: search,
    matchType: filterMatchType,
  });

  return [...getLibraryContentsQueryKey(workspace.id, parentId), queryParams];
};

// Queries
export const useLibraryContentsQuery = (
  parentId: string | null,
  {
    filters,
    sorts,
    flatten,
    searchQuery,
    matchType,
  }: LibraryContentsQueryParams,
  isProjectFolder?: boolean,
  staleTime?: number
) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  // const { mutate: getLibraryContentPermissions } = useGetLibraryContentPermissions();
  // const { mutate: getLibraryContentSubContents } = useGetLibraryContentSubContents();

  const queryParams = generateLibraryQueryParams({
    filters,
    sorts,
    flatten,
    searchQuery,
    matchType,
  });

  const queryKey = [
    ...getLibraryContentsQueryKey(workspace.id, parentId),
    queryParams,
  ];

  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<LibraryResults>(
        `/api/v1/library/?workspace=${workspace.id}${
          parentId ? `&parent=${parentId}` : ""
        }&page=${pageParam}${queryParams}`
      );

      // const assets = data.data.results.map((asset) => ({
      //   id: asset.id,
      //   resourcetype: asset.resourcetype
      // }));
      // getLibraryContentPermissions({ items: assets, queryKey });
      // getLibraryContentSubContents({ items: assetIds, queryKey });

      return data.data;
    },
    enabled: !!workspace.id && !isProjectFolder,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
    staleTime,
    retry: (_, error) => {
      return !(
        isAxiosError(error) &&
        (error?.response?.status === 404 || error?.response?.status === 403)
      );
    },
    refetchOnWindowFocus: false,
    throwOnError: (error) => {
      return (
        (isAxiosError(error) && error?.response?.status === 404) ||
        (isAxiosError(error) && error?.response?.status === 403)
      );
    },
  });
};

export const useLibraryPermissionsQuery = (
  items: { id: string; resourcetype: ResourceType }[]
) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getLibraryPermissionsQueryKey(
      workspace.id,
      null,
      items.map((item) => item.id)
    ),
    queryFn: async () => {
      const { data } = await api.post<LibraryContentPermissions>(
        `/api/v1/library/asset_permissions/`,
        {
          item_ids: items.map((item) => item.id),
        }
      );
      return data;
    },
    enabled: !!workspace.id && items.length > 0,
  });
};

export const useLibrarySubcontentsQuery = (
  items: { id: string; resourcetype: ResourceType }[]
) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  // Determine folder ids by filtering items whose resourcetype is 'Folder'
  const folderIds = items
    .filter((item) => item.resourcetype === "Folder")
    .map((item) => item.id);

  return useQuery({
    queryKey: getLibrarySubcontentsQueryKey(workspace.id, null),
    queryFn: async () => {
      const { data } = await api.post<LibraryContentSubContents>(
        `/api/v1/library/sub_contents/`,
        {
          item_ids: folderIds,
        }
      );
      return data;
    },
    enabled: !!workspace.id && folderIds.length > 0,
  });
};

export const useAssetDetailsQuery = (
  assetId: string,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {}
) => {
  const api = useApi();

  return useQuery({
    queryKey: getAssetDetailsQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<AssetDetails>(
        `/api/v1/library/${assetId}/`
      );
      return data;
    },

    retry: (_, error) => {
      return !(
        isAxiosError(error) &&
        (error?.response?.status === 404 || error?.response?.status === 403)
      );
    },
    throwOnError: (error) => {
      return (
        (isAxiosError(error) && error?.response?.status === 404) ||
        (isAxiosError(error) && error?.response?.status === 403)
      );
    },
    enabled: !!assetId && enabled,
    refetchOnWindowFocus: false,
  });
};

export const useTreeQuery = (
  parentId: string | null,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {}
) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useInfiniteQuery({
    queryKey: getTreeQueryKey(workspace.id, parentId),
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<TreeResult>(
        `/api/v1/library/library_tree/?workspace=${workspace.id}${
          parentId ? `&parent=${parentId}` : ""
        }&page=${pageParam}`
      );
      return data.data;
    },
    enabled: !!workspace.id && enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useFoldersQuery = (
  parentId: string | null,
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {}
) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useInfiniteQuery({
    queryKey: getFoldersQueryKey(workspace.id, parentId),
    queryFn: async ({ pageParam }) => {
      const params = createUrlParams({
        ...(parentId ? { parent: parentId } : {}),
        workspace: workspace?.id,
        page: `${pageParam}`,
      });

      const { data } = await api.get<TreeFolderResult>(
        `/api/v1/library/list_folders/?${params.toString()}`
      );
      return data.data;
    },
    enabled: !!workspace.id && enabled,
    getNextPageParam: (lastPage) =>
      lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useConnectionsQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getConnectionsQueryKey(workspace.id),
    queryFn: async () => {
      const { data } = await api.get<ConnectionResults>(
        `/api/v1/connected_folders/?workspace=${workspace.id}`
      );
      return data;
    },
    enabled: !!workspace.id,
  });
};

export const useListFoldersOfConnectionQuery = (
  connectionId: string,
  prefix: string | null
) => {
  const api = useApi();

  return useQuery({
    queryKey: getFoldersOfConnectionQueryKey(connectionId, prefix),
    queryFn: async () => {
      const { data } = await api.get<ListFoldersOfConnection>(
        `/api/v1/connected_folders/${connectionId}/list_folders/${
          prefix ? `?prefix=${prefix}` : ""
        }`
      );
      return data;
    },
    enabled: !!connectionId,
  });
};

export const useGenerateFiltersWithAI = (query: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getAIGeneratedFiltersQueryKey(workspace.id, query),
    queryFn: async () => {
      const { data } = await api.get<AIGeneratedFiltersResponse>(
        `/api/v1/library/generate_filters/?workspace=${workspace.id}&query=${query}`
      );
      return data;
    },
    enabled: !!workspace.id && !!query,
  });
};

export const useViewsQuery = () => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getViewsQueryKey(workspace.id),
    queryFn: async () => {
      const { data } = await api.get<GetViewsResponse>(
        `/api/v1/library_views/?workspace=${workspace.id}`
      );
      return data;
    },
    enabled: !!workspace.id,
  });
};

export const useViewQuery = (viewId: string) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getViewQueryKey(workspace.id, viewId),
    queryFn: async () => {
      const { data } = await api.get<View>(`/api/v1/library_views/${viewId}/`);
      return data;
    },
    enabled: !!workspace.id && !!viewId,
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
  });
};

export const useAIViewContentsQuery = (aiSearchQuery: string | null) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useInfiniteQuery({
    queryKey: getAIViewContentsQueryKey(workspace.id, aiSearchQuery),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<LibraryResults>(
        `/api/v1/library/?workspace=${workspace.id}&page=${pageParam}&ai_search_query=${aiSearchQuery}`
      );
      return data.data;
    },
    enabled: !!workspace.id && !!aiSearchQuery,
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

export const useSpriteSheetQuery = (
  assetId: string,
  {
    enabled = false,
  }: {
    enabled?: boolean;
  } = {}
) => {
  const api = useApi();

  return useQuery({
    queryKey: getSpriteSheetQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<SpriteSheet>(
        `/api/v1/library/${assetId}/sprite_sheet/`
      );
      return data;
    },
    enabled: !!assetId && enabled,
  });
};

export const useDeleteAccessQuery = (item_ids: string[], isEnabled = true) => {
  const api = useApi();
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: getDeleteAccessQueryKey(workspace.id, item_ids),
    queryFn: async () => {
      const { data } = await api.post<HasDeleteAccessResponse>(
        `/api/v1/library/has_delete_access/`,
        { item_ids }
      );
      return data;
    },
    enabled: !!workspace.id && isEnabled && item_ids?.length > 0,
  });
};
