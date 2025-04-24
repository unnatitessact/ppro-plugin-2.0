import { JsonObject } from '@liveblocks/client';
import { InfiniteData } from '@tanstack/react-query';

import { PaginatedAPIResponse } from '@/types/api';

export type NotificationModule = 'library' | 'project' | 'workflow';
export type NotificationOption = 'email_enabled' | 'whatsapp_enabled' | 'browser_enabled';

export interface NotificationModulePreference {
  id: string;
  user: string;
  module: NotificationModule;
  event: string;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  browser_enabled: boolean;
  created_on: string;
  modified_on: string;
}

export interface NotificationSettings {
  id: string;
  user: string;
  email: boolean;
  whatsapp: boolean;
  browser: boolean;
  local: boolean;
  created_on: string;
  modified_on: string;
}

export type NotificationEventType =
  | 'PROJECT_STATUS_CHANGE'
  | 'NEW_TASK_CREATED'
  | 'TASK_ASSIGNED_TO_YOU'
  | 'TASK_ASSIGNED_TO_TEAM'
  | 'TASK_UPDATES'
  | 'NEW_FILES_ADDED'
  | 'FILES_REMOVED'
  | 'FILE_METADATA_UPDATES'
  | 'PROJECT_FILE_STATUS_CHANGE'
  | 'LIBRARY_FILE_STATUS_CHANGE'
  | 'NEW_COMMENTS_ON_FILES'
  | 'NEW_COMMENTS_ON_PREV_COMMENTED'
  | 'REPLIES_TO_COMMENTS'
  | 'NEW_MENTIONS_IN_COMMENTS'
  | 'MENTIONS_FOR_YOU'
  | 'MENTIONED_IN_METADATA'
  | 'NEW_FILES_ADDED_LIBRARY';

export interface NotificationRoomEventGenericData {
  id: string;
  title: string;
  body: string;
  event: NotificationEventType;
  module: NotificationModule;
  is_read: boolean;
  created_on: string;
  modified_on: string;
}

export interface NotificationRoomEventProjectStatusChangeData
  extends NotificationRoomEventGenericData {
  event: 'PROJECT_STATUS_CHANGE';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    old_status?: string;
    new_status?: string;
    new_status_name?: string;
    old_status_name?: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventNewTaskCreatedData extends NotificationRoomEventGenericData {
  event: 'NEW_TASK_CREATED';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    task_id: string;
    task_name: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventTaskAssignedToYouData
  extends NotificationRoomEventGenericData {
  event: 'TASK_ASSIGNED_TO_YOU';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    task_id: string;
    task_name: string;
    assigned_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventTaskAssignedToTeamData
  extends NotificationRoomEventGenericData {
  event: 'TASK_ASSIGNED_TO_TEAM';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    task_id: string;
    task_name: string;
    team_id: string;
    team_name: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventTaskUpdatesData extends NotificationRoomEventGenericData {
  event: 'TASK_UPDATES';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    task_id: string;
    task_name: string;
    update_type: 'status' | 'due_date' | 'assignment'; // e.g., "status", "due_date", "assignment"
    old_value?: string;
    new_value?: string;
    old_status?: string;
    new_status?: string;
    status_icon?: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventNewFilesAddedData extends NotificationRoomEventGenericData {
  event: 'NEW_FILES_ADDED';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    file_id: string;
    file_name: string;
    added_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventFilesRemovedData extends NotificationRoomEventGenericData {
  event: 'FILES_REMOVED';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    file_id: string;
    file_name: string;
    removed_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventFileMetadataUpdatesData
  extends NotificationRoomEventGenericData {
  event: 'FILE_METADATA_UPDATES';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    file_id: string;
    file_name: string;
    updated_fields: string[];
    updated_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventProjectFileStatusChangeData
  extends NotificationRoomEventGenericData {
  event: 'PROJECT_FILE_STATUS_CHANGE';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    file_id: string;
    file_name: string;
    old_status: string;
    new_status: string;
    new_status_name?: string;
    old_status_name?: string;
    updated_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventLibraryFileStatusChangeData
  extends NotificationRoomEventGenericData {
  event: 'LIBRARY_FILE_STATUS_CHANGE';
  module: 'library';
  metadata: {
    file_id: string;
    file_name: string;
    old_status: string;
    new_status: string;
    new_status_name?: string;
    old_status_name?: string;
    updated_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventNewCommentsOnFilesData
  extends NotificationRoomEventGenericData {
  event: 'NEW_COMMENTS_ON_FILES';
  module: 'project';
  metadata: {
    project_id: string;
    project_name: string;
    file_id: string;
    file_name: string;
    comment_id: string;
    comment_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventNewCommentsOnPrevCommentedData
  extends NotificationRoomEventGenericData {
  event: 'NEW_COMMENTS_ON_PREV_COMMENTED';
  module: 'library';
  metadata: {
    file_id: string;
    file_name: string;
    comment_id: string;
    comment_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventRepliesToCommentsData
  extends NotificationRoomEventGenericData {
  event: 'REPLIES_TO_COMMENTS';
  module: 'library';
  metadata: {
    file_id: string;
    file_name: string;
    comment_id: string;
    reply_id: string;
    replied_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventNewMentionsInCommentsData
  extends NotificationRoomEventGenericData {
  event: 'NEW_MENTIONS_IN_COMMENTS';
  module: 'library';
  metadata: {
    project_id: string;
    project_name: string;
    file_id: string;
    file_name: string;
    comment_id: string;
    mentioned_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventMentionsForYouData extends NotificationRoomEventGenericData {
  event: 'MENTIONS_FOR_YOU';
  module: 'library';
  metadata: {
    file_id: string;
    file_name: string;
    comment_id: string;
    mentioned_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventMentionedInMetadataData
  extends NotificationRoomEventGenericData {
  event: 'MENTIONED_IN_METADATA';
  module: 'library';
  metadata: {
    file_id: string;
    file_name: string;
    field_name: string;
    mentioned_by: string;
    workspace_name: string;
    workspace_id: string;
  };
}

export interface NotificationRoomEventNewFilesAddedLibraryData
  extends NotificationRoomEventGenericData {
  event: 'NEW_FILES_ADDED_LIBRARY';
  module: 'library';
  metadata: {
    workspace_id: string;
    workspace_name: string;
    file_id: string;
    file_name: string;
    added_by: string;
  };
}
export type NotificationRoomEventData =
  | NotificationRoomEventProjectStatusChangeData
  | NotificationRoomEventNewTaskCreatedData
  | NotificationRoomEventTaskAssignedToYouData
  | NotificationRoomEventTaskAssignedToTeamData
  | NotificationRoomEventTaskUpdatesData
  | NotificationRoomEventNewFilesAddedData
  | NotificationRoomEventFilesRemovedData
  | NotificationRoomEventFileMetadataUpdatesData
  | NotificationRoomEventProjectFileStatusChangeData
  | NotificationRoomEventLibraryFileStatusChangeData
  | NotificationRoomEventNewCommentsOnFilesData
  | NotificationRoomEventNewCommentsOnPrevCommentedData
  | NotificationRoomEventRepliesToCommentsData
  | NotificationRoomEventNewMentionsInCommentsData
  | NotificationRoomEventMentionsForYouData
  | NotificationRoomEventMentionedInMetadataData
  | NotificationRoomEventNewFilesAddedLibraryData;

export interface NotificationRoomEvent extends JsonObject {
  type: 'NEW_NOTIFICATION';
  data: NotificationRoomEventData & JsonObject;
}

export type GetNotificationPreferencesResponse = NotificationModulePreference[];
export type GetNotificationSettingsResponse = NotificationSettings;
export type GetNotificationListResponse = PaginatedAPIResponse<NotificationRoomEventData>;

export type NotificationPages = InfiniteData<GetNotificationListResponse['data']> | undefined;
export type NotificationUnreadCount = number | undefined;

export type UpdateNotificationPreferencePayload = {
  field: NotificationOption;
  value: boolean;
  user_id?: string;
  organization_id?: string;
};
export type UpdateNotificationSettingsPayload = {
  user_id?: string;
  organization_id?: string;
  settings: {
    email?: boolean;
    whatsapp?: boolean;
    browser?: boolean;
    local?: boolean;
  }
};
