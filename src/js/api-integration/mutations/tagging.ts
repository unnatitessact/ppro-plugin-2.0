import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { useApi } from "../../hooks/useApi";

import { getAssetDetailsQueryKey } from "../queries/library";
import {
  getDetectedRunnersListQueryKey,
  getDetectionsQueryKey,
  getMarathonCamerasQueryKey,
  getMarathonDetectedRunnerGroupQueryKey,
  getTaggingLibraryQueryKey,
} from "../queries/tagging";
import { TaggingStatus } from "../types/library";
import {
  AddTagPayload,
  AutoDetection,
  BulkUpdateTagsPayload,
  DetectedRunnerResults,
  MarathonCameraAssignee,
  MarathonCameraResults,
} from "../types/tagging";

import { useTaggingStore } from "../../stores/tagging-store";

export const useUpdateTaggingStatus = (assetId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: TaggingStatus) => {
      const { data } = await api.patch(
        `/api/v1/tagging_jobs/${assetId}/update_status/`,
        {
          status,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAssetDetailsQueryKey(assetId),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Unable to update tagging status", {
        description:
          "An error occurred while updating tagging status. Please try again.",
      });
    },
  });
};

export const useRejectTag = (
  assetId: string,
  tagId: string,
  timestamp: number
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rejectTag", assetId, tagId],
    retry: false,
    networkMode: "always",
    mutationFn: async () => {
      if (!navigator.onLine) {
        return;
      }
      const { data } = await api.post(`/api/v1/autodetections/`, {
        item: assetId,
        tag: tagId,
        timestamp: timestamp,
        is_reject: true,
      });
      return data;
    },
    onMutate: async () => {
      if (!navigator.onLine) {
        toast.error("You are offline", {
          description: "Please check your internet connection and try again",
        });
        return;
      }
      await queryClient.cancelQueries({
        queryKey: getDetectionsQueryKey(assetId),
      });
      const previousTags = queryClient.getQueryData(
        getDetectionsQueryKey(assetId)
      ) as AutoDetection[];
      const updatedTags = previousTags.filter(
        (tag) => !(tag.tag === tagId && tag.timestamp === timestamp)
      );
      queryClient.setQueryData(getDetectionsQueryKey(assetId), updatedTags);
      return { previousTags };
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getDetectionsQueryKey(assetId),
      });
    },
    onError: (error, __, context) => {
      console.error("Tag rejection error:", error);
      const e = error as AxiosError;
      queryClient.setQueryData(
        getDetectionsQueryKey(assetId),
        context?.previousTags
      );

      // More informative error message
      let errorDescription = "Please check your network connection";
      if (e?.response) {
        errorDescription = `Server error: ${JSON.stringify(e.response.data)}`;
      } else if (e?.request) {
        errorDescription =
          "No response received from server. Please try again later.";
      } else if (e?.message) {
        errorDescription = `Error: ${e.message}`;
      }

      toast.error("Unable to reject tag", { description: errorDescription });
    },
  });
};

export const useAddTag = (assetId: string, tagId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const detectionsQueryKey = getDetectionsQueryKey(assetId);

  return useMutation({
    mutationKey: ["addTag", assetId, tagId],
    networkMode: "always",
    mutationFn: async (payload: AddTagPayload) => {
      if (!navigator.onLine) {
        return;
      }
      const { data } = await api.post(`/api/v1/autodetections/`, {
        item: assetId,
        tag: payload.tag.id,
        timestamp: payload.timestamp,
        is_reject: false,
      });
      return data;
    },
    retry: false,
    onMutate: async (payload: AddTagPayload) => {
      if (!navigator.onLine) {
        toast.error("You are offline", {
          description: "Please check your internet connection and try again",
        });
        return;
      }
      await queryClient.cancelQueries({ queryKey: detectionsQueryKey });
      const previousTags = queryClient.getQueryData(
        detectionsQueryKey
      ) as AutoDetection[];
      const optimisticId = `optimistic-${crypto.randomUUID()}`;
      queryClient.setQueryData(detectionsQueryKey, [
        ...previousTags,
        {
          id: optimisticId,
          tag: payload.tag.id,
          timestamp: payload.timestamp,
        },
      ] as AutoDetection[]);
      return { previousTags, optimisticId };
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: detectionsQueryKey,
      });
    },
    onError: (err, __, context) => {
      console.error(err);
      const e = err as AxiosError;
      queryClient.setQueryData(detectionsQueryKey, context?.previousTags);
      toast.error("Unable to add tag", {
        description: e?.response
          ? JSON.stringify(e.response.data)
          : JSON.stringify(e),
      });
    },
  });
};

export const useBulkUpdateTags = (assetId: string) => {
  const api = useApi();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkUpdateTagsPayload) => {
      const { data } = await api.post(
        `/api/v1/autodetections/bulk_create/`,
        payload.map((tag) => ({
          item: assetId,
          item_id: assetId,
          tag: tag.tag,
          tag_id: tag.tag,
          timestamp: tag.timestamp,
          is_reject: tag.is_reject,
        }))
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDetectionsQueryKey(assetId),
      });
    },
    onError: (error) => {
      console.error("Bulk update tags error:", error);
      const e = error as AxiosError;

      // More informative error message
      let errorDescription = "Please check your network connection";
      if (e?.response) {
        errorDescription = `Server error: ${JSON.stringify(e.response.data)}`;
      } else if (e?.request) {
        errorDescription =
          "No response received from server. Please try again later.";
      } else if (e?.message) {
        errorDescription = `Error: ${e.message}`;
      }

      toast.error("Unable to bulk update tags", {
        description: errorDescription,
      });
    },
  });
};

export const useUpdateAssignedTo = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    taggingSelectedTab,
    search,
    assignedUser,
    statusFilter,
    excludeDeletedFiles,
    selectedWorkspaceFilter,
  } = useTaggingStore();

  return useMutation({
    mutationFn: async ({
      user_id,
      job_id,
    }: {
      user_id: string;
      job_id: string;
    }) => {
      const { data } = await api.patch(
        `/api/v1/tagging_jobs/${job_id}/assign_user/`,
        {
          user_id,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTaggingLibraryQueryKey(
          taggingSelectedTab,
          search,
          assignedUser,
          statusFilter,
          excludeDeletedFiles,
          selectedWorkspaceFilter
        ),
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Unable to assign user", {
        description:
          "An error occurred while assigning user. Please try again.",
      });
    },
  });
};

export const useUpdateMarathonDetectedRunner = (camera_feed_id?: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const queryKey = camera_feed_id
    ? getMarathonDetectedRunnerGroupQueryKey(camera_feed_id)
    : getDetectedRunnersListQueryKey();

  return useMutation({
    mutationFn: async ({
      runnerId,
      manual_bib_number,
    }: {
      runnerId: string;
      manual_bib_number: string;
    }) => {
      const { data } = await api.patch(
        `api/v1/detected_runners/${runnerId}/update_bib/`,
        {
          manual_bib_number,
        }
      );
      return data;
    },
    onMutate: ({ runnerId }) => {
      const previousData:
        | InfiniteData<DetectedRunnerResults["data"], unknown>
        | undefined = queryClient.getQueryData(queryKey);
      if (!previousData) return;

      queryClient.setQueryData<
        InfiniteData<DetectedRunnerResults["data"], unknown> | undefined
      >(
        queryKey,
        (
          old: InfiniteData<DetectedRunnerResults["data"], unknown> | undefined
        ) => {
          if (!old) return old;
          const newData = { ...old };
          // Filter out the runner that was updated and return results without the updated runner
          newData.pages.forEach((page) => {
            page.results = page.results.filter(
              (runner) => runner.id !== runnerId
            );
          });
          return newData;
        }
      );

      return { previousData };
    },
    onError: (error, payload, context) => {
      console.error(error);
      toast.error("Failed to update BIB", {
        description: error?.message ?? "Please inform the developer",
      });
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useUpdateCameraFeedAssignee = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const queryKey = getMarathonCamerasQueryKey();

  return useMutation({
    mutationFn: async ({
      camera_feed_id,
      user,
    }: {
      camera_feed_id: string;

      user: MarathonCameraAssignee;
    }) => {
      const { data } = await api.patch(
        `api/v1/camera_feeds/${camera_feed_id}/assign/`,
        {
          user_id: user?.id,
        }
      );
      return data;
    },
    onMutate: ({ camera_feed_id, user }) => {
      const previousData:
        | InfiniteData<MarathonCameraResults["data"], unknown>
        | undefined = queryClient.getQueryData(queryKey);
      if (!previousData) return;

      queryClient.setQueryData<
        InfiniteData<MarathonCameraResults["data"], unknown> | undefined
      >(
        queryKey,
        (
          old: InfiniteData<MarathonCameraResults["data"], unknown> | undefined
        ) => {
          if (!old) return old;
          const newData = { ...old };
          // Filter out the runner that was updated and return results without the updated runner
          newData.pages.forEach((page) => {
            const newResults = page.results.map((camera) => {
              if (camera.id === camera_feed_id) {
                return { ...camera, assigned_to: user };
              }
              return camera;
            });
            page.results = newResults;
          });
          return newData;
        }
      );

      return { previousData };
    },
    onError: (error, payload, context) => {
      console.error(error);
      toast.error("Failed to update BIB", {
        description: error?.message ?? "Please inform the developer",
      });
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};
