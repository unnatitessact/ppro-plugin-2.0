import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "../../components/ui/ToastContent";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

import {
  notificationListQueryKey,
  notificationPreferencesQueryKey,
  notificationSettingsQueryKey,
  notificationUnreadCountQueryKey,
} from "../../api-integration/queries/notifications";
import { createUrlParams } from "../../api-integration/queries/review";
import {
  GetNotificationSettingsResponse,
  NotificationModule,
  NotificationModulePreference,
  NotificationPages,
  NotificationUnreadCount,
  UpdateNotificationPreferencePayload,
  UpdateNotificationSettingsPayload,
} from "../../api-integration/types/notifications";

export const useUpdateNotificationPreference = (userId?: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const queryKey = notificationPreferencesQueryKey(userId);
  return useMutation({
    onMutate: ({ id, payload }) => {
      queryClient.cancelQueries({
        queryKey,
      });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (
          oldData: Partial<
            Record<NotificationModule, NotificationModulePreference[]>
          >
        ) => {
          if (!oldData) return;
          const newData = structuredClone(oldData);
          const array = Object.keys(newData).flatMap(
            (key) => newData[key as NotificationModule]!
          );
          const updatedArray = array.map((preference) => {
            if (preference && preference.id === id) {
              const newPreference = structuredClone(preference);
              newPreference[payload.field] = payload.value;
              return newPreference;
            }
            return preference;
          });
          const groupedPreferences = Object.groupBy(
            updatedArray,
            (key) => key?.module
          );
          return groupedPreferences;
        }
      );
      return { previousData };
    },
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: UpdateNotificationPreferencePayload;
      id: string;
    }) => {
      const { data } = await api.put(
        `/api/v1/notification_preferences/${id}/`,
        payload
      );
      return data;
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);

      showToast({
        state: "fallback",
        title: "Failed to update preference",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useUpdateNotificationSettings = (userId?: string) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const queryKey = notificationSettingsQueryKey(userId);

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateNotificationSettingsPayload;
    }) => {
      const { data } = await api.patch(
        `/api/v1/notification_settings/${id}/`,
        payload
      );
      return data;
    },
    onMutate: ({ payload }: { payload: UpdateNotificationSettingsPayload }) => {
      queryClient.cancelQueries({
        queryKey,
      });

      const previousData = queryClient.getQueryData(
        notificationSettingsQueryKey(userId)
      );

      queryClient.setQueryData(
        notificationSettingsQueryKey(userId),
        (
          oldData: GetNotificationSettingsResponse
        ): GetNotificationSettingsResponse | undefined => {
          if (!oldData) return;
          return {
            ...oldData,
            ...payload,
          };
        }
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);

      showToast({
        state: "fallback",
        title: "Failed to update settings",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  const queryKey = notificationListQueryKey(workspace?.id);
  const queryKeyCount = notificationUnreadCountQueryKey(workspace?.id);

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(
        `/api/v1/user_notifications/${id}/mark_as_read/`
      );
      return data;
    },
    onMutate: async (id: string) => {
      // Cancel the notification list and unread count queries
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({
        queryKey: queryKeyCount,
      });

      // Get the previous data from the cache
      const previousList =
        queryClient.getQueryData<NotificationPages>(queryKey);
      const previousUnreadCount =
        queryClient.getQueryData<NotificationUnreadCount>(queryKeyCount);

      if (!previousList || !previousUnreadCount) return;

      // Update the cache to mark the notification as read
      queryClient.setQueryData(queryKey, (oldData: NotificationPages) => {
        if (!oldData) return;
        const newData = structuredClone(oldData);
        for (const page of newData.pages) {
          for (const notification of page.results) {
            if (notification.id === id) {
              notification.is_read = true;
            }
          }
        }
        return newData;
      });

      queryClient.setQueryData(
        queryKeyCount,
        (oldData: NotificationUnreadCount) => {
          if (!oldData) return;
          return oldData - 1;
        }
      );

      return { previousList, previousUnreadCount };
    },
    onError: (_, __, context) => {
      showToast({
        state: "fallback",
        title: "Failed to mark notification as read",
      });

      // Reset cache to previous state
      queryClient.setQueryData(queryKey, context?.previousList);
      queryClient.setQueryData(queryKeyCount, context?.previousUnreadCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyCount,
      });
    },
  });
};

export const useMarkAllNotificationAsRead = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();

  const queryKey = notificationListQueryKey(workspace?.id);
  const queryKeyCount = notificationUnreadCountQueryKey(workspace?.id);

  return useMutation({
    mutationFn: async () => {
      const params = createUrlParams({
        workspace: workspace.id,
      });
      const { data } = await api.post(
        `/api/v1/user_notifications/mark_all_as_read/?${params.toString()}`
      );
      return data;
    },
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey,
      });
      queryClient.cancelQueries({
        queryKey: queryKeyCount,
      });
      const previousList =
        queryClient.getQueryData<NotificationPages>(queryKey);
      const previousCount =
        queryClient.getQueryData<NotificationUnreadCount>(queryKeyCount);

      if (!previousList || !previousCount) return;

      queryClient.setQueryData(queryKey, (oldData: NotificationPages) => {
        if (!oldData) return;
        const newData = structuredClone(oldData);
        for (const page of newData.pages) {
          for (const notification of page.results) {
            notification.is_read = true;
          }
        }
        return newData;
      });

      queryClient.setQueryData(
        queryKeyCount,
        (oldData: NotificationUnreadCount) => {
          if (!oldData) return;
          return 0;
        }
      );

      return { previousList, previousCount };
    },
    onError: (_, __, context) => {
      showToast({
        state: "fallback",
        title: "Failed to mark all notifications as read",
      });

      queryClient.setQueryData(queryKey, context?.previousList);
      queryClient.setQueryData(queryKeyCount, context?.previousCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyCount,
      });
    },
  });
};
