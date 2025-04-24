export type WorkspacePreference = {
  id: string;
  is_deleted: boolean;
  watermarking_enabled: boolean;
  workspace: string;
  created_on: string;
  modified_on: string;
  task_user_file_access: boolean;
  all_task_access_to_project_members: boolean;
};

// Response
export type GetWorkspacePreferencesResponse = WorkspacePreference;

// Payloads
export type UpdateWorkspacePreferencesPayload = {
  workspace: string;
  watermarking_enabled?: boolean;
  is_deleted?: string;
  task_user_file_access?: boolean;
  all_task_access_to_project_members?: boolean;
};
