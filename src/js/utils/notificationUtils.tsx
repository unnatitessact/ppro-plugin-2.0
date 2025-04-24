import { NotificationRoomEventData } from "../api-integration/types/notifications";

export const getNotificationItemHref = (
  notification: NotificationRoomEventData
) => {
  if (notification.module === "library") {
    if (
      notification.event === "LIBRARY_FILE_STATUS_CHANGE" ||
      notification.event === "REPLIES_TO_COMMENTS" ||
      notification.event === "MENTIONS_FOR_YOU" ||
      notification.event === "MENTIONED_IN_METADATA" ||
      notification.event === "NEW_COMMENTS_ON_PREV_COMMENTED" ||
      notification.event === "NEW_MENTIONS_IN_COMMENTS" ||
      notification.event === "NEW_FILES_ADDED_LIBRARY"
    ) {
      return `/library/asset/${notification.metadata.file_id}/`;
    }
  }

  if (notification.module === "project") {
    if (
      notification.event === "FILE_METADATA_UPDATES" ||
      notification.event === "NEW_COMMENTS_ON_FILES" ||
      notification.event === "PROJECT_FILE_STATUS_CHANGE" ||
      notification.event === "NEW_FILES_ADDED"
    ) {
      return `/projects/${notification.metadata.project_id}/files/asset/${notification.metadata.file_id}/`;
    }
    if (notification.event === "PROJECT_STATUS_CHANGE") {
      return `/projects/${notification.metadata.project_id}/`;
    }
    if (
      notification.event === "NEW_TASK_CREATED" ||
      notification.event === "TASK_UPDATES" ||
      notification.event === "TASK_ASSIGNED_TO_YOU" ||
      notification.event === "TASK_ASSIGNED_TO_TEAM"
    ) {
      return `/projects/${notification.metadata.project_id}/tasks/${notification.metadata.task_id}/`;
    }
  }
};
