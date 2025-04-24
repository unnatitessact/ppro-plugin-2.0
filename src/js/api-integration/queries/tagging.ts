import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { useApi } from "../../hooks/useApi";

import { createUrlParams } from "../queries/review";
import { User } from "../types/auth";
import {
  AutoDetection,
  DetectedRunner,
  DetectedRunnerResults,
  MarathonCameraResults,
  Tag,
  TaggingLibrary,
  TaggingLibraryResults,
} from "../types/tagging";

// Query keys
export const getAllTagsQueryKey = () => ["tags"];

export const getDetectionsQueryKey = (assetId: string) => [
  "detections",
  assetId,
];

export const getTaggingLibraryQueryKey = (
  origin: "library" | "project",
  search?: string,
  assignedUser?: User | null,
  statusFilter?: string,
  excludeDeletedFiles?: boolean,
  selectedWorkspaceFilter?: string | null
) => {
  return [
    "tagging_library",
    origin,
    search ?? "",
    assignedUser?.id ?? "",
    statusFilter ?? "",
    excludeDeletedFiles,
    selectedWorkspaceFilter,
  ];
};

export const getTaggingJobQueryKey = (jobId: string) => ["tagging_job", jobId];

export const getTaggersListQueryKey = () => ["taggers_list"];

export const getDetectedRunnersListQueryKey = () => ["detected_runners_list"];

export const getDetectedRunnerQueryKey = (id: string) => [
  "detected_runner",
  id,
];

export const getMarathonCamerasQueryKey = () => ["marathon_cameras"];

export const getMarathonDetectedRunnerGroupQueryKey = (
  camera_feed_id: string
) => ["marathon_cameras", camera_feed_id];

// Queries
export const useTagsQuery = () => {
  const api = useApi();

  return useQuery({
    queryKey: getAllTagsQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<Tag[]>("/api/v1/tags/");
      return data;
    },
  });
};

export const useDetectionsQuery = (assetId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getDetectionsQueryKey(assetId),
    queryFn: async () => {
      const { data } = await api.get<AutoDetection[]>(
        `/api/v1/autodetections/?item_id=${assetId}`
      );
      return data;
    },
    enabled: !!assetId,
  });
};

export const useTaggingLibraryQuery = (
  origin: "library" | "project",
  search?: string,
  assignedUser?: User | null,
  statusFilter?: string,
  excludeDeletedFiles?: boolean,
  selectedWorkspaceFilter?: string | null
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getTaggingLibraryQueryKey(
      origin,
      search,
      assignedUser,
      statusFilter,
      excludeDeletedFiles,
      selectedWorkspaceFilter
    ),
    queryFn: async ({ pageParam = 1 }) => {
      const params = createUrlParams({
        page: `${pageParam}`,
        origin,
        ...(search && { search: search?.trim() }),
        ...(assignedUser?.id && { tagged_by: assignedUser.id }),
        ...(statusFilter && { tagging_status: statusFilter }),
        ...(excludeDeletedFiles !== undefined && {
          exclude_deleted_files: excludeDeletedFiles,
        }),
        ...(selectedWorkspaceFilter && {
          workspace_id: selectedWorkspaceFilter,
        }),
      });

      const { data } = await api.get<TaggingLibraryResults>(
        // `api/v1/tagging_jobs/?origin=${origin}&page=${pageParam}${search ? `&search=${search}` : ''}${assignedUser ? `&tagged_by=${assignedUser?.id}` : ''}${statusFilter ? `&tagging_status=${statusFilter}` : ''}`
        `api/v1/tagging_jobs/?${params.toString()}`
      );
      return data.data;
    },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.next ? lastPage?.meta?.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage?.meta?.previous ? lastPage?.meta?.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useTaggingJobQuery = (jobId: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getTaggingJobQueryKey(jobId),
    queryFn: async () => {
      const { data } = await api.get<TaggingLibrary>(
        `/api/v1/tagging_jobs/${jobId}/`
      );
      return data;
    },
    retry: (_, error) => {
      return !(isAxiosError(error) && error?.response?.status === 404);
    },
    throwOnError: (error) => {
      return isAxiosError(error) && error?.response?.status === 404;
    },
    enabled: !!jobId,
    refetchOnWindowFocus: false,
  });
};

export const useTaggersListQuery = (staleTime?: number) => {
  const api = useApi();

  return useQuery({
    queryKey: getTaggersListQueryKey(),
    queryFn: async () => {
      const { data } = await api.get<User[]>(`/api/v1/tagging_jobs/taggers/`);
      return data;
    },
    staleTime,
  });
};

export const useTaggingMarathonDetectedRunnersListQuery = () => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getDetectedRunnersListQueryKey(),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<DetectedRunnerResults>(
        `api/v1/detected_runners?page=${pageParam}`
      );
      return data.data;

      // const { data } = await api.get<TaggingLibraryResults>(
      //   `api/v1/tagging_jobs/?workspace_id=${workspace.id}&origin=${origin}&page=${pageParam}${search ? `&search=${search}` : ''}${assignedUser ? `&tagged_by=${assignedUser?.id}` : ''}${statusFilter ? `&tagging_status=${statusFilter}` : ''}`
      // );
      // return data.data;
    },

    getNextPageParam: (lastPage) =>
      lastPage?.meta?.next ? lastPage?.meta?.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage?.meta?.previous ? lastPage?.meta?.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useTaggingMarathonDetectedRunnerQuery = (id: string) => {
  const api = useApi();

  return useQuery({
    queryKey: getDetectedRunnerQueryKey(id),
    queryFn: async () => {
      const { data } = await api.get<DetectedRunner>(
        `api/v1/detected_runners/${id}`
      );
      return data;
    },
  });
};

export const useTaggingMarathonCamerasQuery = () => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getMarathonCamerasQueryKey(),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<MarathonCameraResults>(
        `api/v1/camera_feeds/?page=${pageParam}`
      );
      return data.data;
    },

    getNextPageParam: (lastPage) =>
      lastPage?.meta?.next ? lastPage?.meta?.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage?.meta?.previous ? lastPage?.meta?.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};

export const useTaggingMarathonDetectedRunnersCameraGroupedListQuery = (
  camera_feed_id: string
) => {
  const api = useApi();

  return useInfiniteQuery({
    queryKey: getMarathonDetectedRunnerGroupQueryKey(camera_feed_id),
    queryFn: async ({ pageParam = 1 }) => {
      const params = createUrlParams({
        page: `${pageParam}`,
        camera_feed_id,
      });

      const { data } = await api.get<DetectedRunnerResults>(
        `api/v1/detected_runners?${params.toString()}`
      );
      return data.data;

      // const { data } = await api.get<TaggingLibraryResults>(
      //   `api/v1/tagging_jobs/?workspace_id=${workspace.id}&origin=${origin}&page=${pageParam}${search ? `&search=${search}` : ''}${assignedUser ? `&tagged_by=${assignedUser?.id}` : ''}${statusFilter ? `&tagging_status=${statusFilter}` : ''}`
      // );
      // return data.data;
    },
    enabled: !!camera_feed_id,
    select: (data) => {
      return {
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.filter(
            (runner) => runner.images && runner.images.length > 0
          ),
        })),
        pageParams: data.pageParams,
      };
    },

    getNextPageParam: (lastPage) =>
      lastPage?.meta?.next ? lastPage?.meta?.current_page + 1 : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage?.meta?.previous ? lastPage?.meta?.current_page - 1 : undefined,
    initialPageParam: 1,
  });
};
