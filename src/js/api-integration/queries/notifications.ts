import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useApi } from "../../hooks/useApi";
import { useWorkspace } from "../../hooks/useWorkspace";

// import { createUrlParams } from "../utils";
import {
  GetNotificationListResponse,
  GetNotificationPreferencesResponse,
  GetNotificationSettingsResponse,
} from "../types/notifications";

export const notificationPreferencesQueryKey = (userId?: string) => [
  "notification",
  "preferences",
  userId,
];
export const notificationSettingsQueryKey = (userId?: string) => [
  "notification",
  "settings",
  userId,
];
export const notificationListQueryKey = (workspaceId?: string) => [
  "notification",
  "list",
  workspaceId ? workspaceId : "all-workspaces",
];

export const notificationUnreadCountQueryKey = (workspaceId?: string) => [
  "notification",
  "unread-count",
  workspaceId ? workspaceId : "all-workspaces",
];

export const useNoticationPreferences = (userId?: string) => {
  const api = useApi();

  return useQuery({
    queryKey: notificationPreferencesQueryKey(userId),
    queryFn: async () => {
      const { data } = await api.get<GetNotificationPreferencesResponse>(
        `/api/v1/notification_preferences/?user_id=${userId}`
      );
      const groupedPreferences = Object.groupBy(data, ({ module }) => module);
      return groupedPreferences;
    },
    enabled: !!userId,
  });
};

export const useNotificationSettings = (userId?: string) => {
  const api = useApi();

  return useQuery({
    queryKey: notificationSettingsQueryKey(userId),
    queryFn: async () => {
      const { data } = await api.get<GetNotificationSettingsResponse>(
        `/api/v1/notification_settings/?user_id=${userId}`
      );
      return data;
    },
    enabled: !!userId,
  });
};

// export const useNotificationListQuery = () => {
//   const api = useApi();
//   const { workspace } = useWorkspace();

//   return useInfiniteQuery({
//     queryKey: notificationListQueryKey(workspace?.id),
//     queryFn: async ({ pageParam = 1 }) => {
//       const params = createUrlParams({
//         page: `${pageParam}`
//       });
//       if (workspace && workspace?.id) {
//         params.append('workspace', workspace?.id);
//       }
//       const { data } = await api.get<GetNotificationListResponse>(
//         `/api/v1/user_notifications/?${params.toString()}`
//       );
//       return data.data;
//     },
//     getNextPageParam: (lastPage) =>
//       lastPage.meta.next ? lastPage.meta.current_page + 1 : undefined,
//     getPreviousPageParam: (lastPage) =>
//       lastPage.meta.previous ? lastPage.meta.current_page - 1 : undefined,
//     initialPageParam: 1
//   });
// };

// export const useNotificationUnreadCountQuery = () => {
//   const api = useApi();
//   const { workspace } = useWorkspace();

//   return useQuery({
//     queryKey: notificationUnreadCountQueryKey(workspace?.id),
//     queryFn: async () => {
//       const params = createUrlParams({
//         ...(workspace && workspace?.id ? { workspace: workspace?.id } : {}),
//       });
//       const { data } = await api.get<{ unread_count: number }>(
//         `/api/v1/user_notifications/unread_count/?${params.toString()}`
//       );
//       return data.unread_count;
//     },
//   });
// };
