// Payloads

import { User } from "../types/auth";
import {
  AssetDetails,
  BlockedTask,
  StatusOption,
  TaskConnection,
  TaskHistory,
  Team,
  WorkflowInstance,
} from "../types/projects";
import { PaginatedAPIResponse } from "../types/api";

export type TaskShareCreationPayload = {
  /** The ID of the task to be shared */
  task: string;
  /** Email address of the recipient */
  email: string;
  /** The ID of the project the task belongs to */
  project: string;
  /** Whether to allow the recipient to download assets @default true */
  allow_download?: boolean;
  /** Whether to allow the recipient to add comments @default true */
  allow_comments?: boolean;
  /** Whether to allow the recipient to change task status */
  allow_status_change?: boolean;
  /** Whether to allow the recipient to upload files */
  allow_upload?: boolean;
};

// Responses

export type ViewTaskShareResponse = {
  id: string;
  share_token: string;
  allow_download: boolean;
  allow_comment: boolean;
  allow_status_change: boolean;
  allow_upload: boolean;
  task: {
    id: string;
    project_id: string;
    project_name: string;
    task_user_file_access: boolean;
    workflow_instance: WorkflowInstance;
    incoming_connections: TaskConnection[];
    outgoing_connections: TaskConnection[];
    status_change_history: TaskHistory[];
    assigned_user: User;
    team: Team;
    created_by: User | null;
    modified_by: User | null;
    status_options: StatusOption[];
    due_date_status: StatusOption;
    blocked_tasks: BlockedTask[];
    blocked_by: BlockedTask[];
    current_status: StatusOption;
    step_instance_attachment: [];
    task_category: null;
    created_on: string;
    modified_on: string;
    name: string;
    step_type: string;
    step_type_category: string;
    x_coordinate: number;
    y_coordinate: number;
    description: string;
    is_persistent: boolean;
    due_date: string;
    relative_due_date: number;
    step_order_number: number;
    configuration: object;
    open_task_file_selector: boolean;
    shared_users_download_access: boolean;
  };
  project: string;
  created_by: {
    id: string;
    email: string;
    profile: {
      display_name: string;
      profile_picture: string;
      color: string;
    };
    is_default_system_user: boolean;
  };
  created_on: string;
  modified_on: string;
  modified_by: string;
  email: string;
  token: string;
};

export type ShareTaskFilesResponse = {
  attached_files: AssetDetails[];
  incoming_assets: AssetDetails[];
  outgoing_assets: AssetDetails[];
};

export type TreeViewResponse = PaginatedAPIResponse<AssetDetails>;
