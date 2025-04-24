import { FileStatus } from "../types/library";

export type TriggerCode =
  | "on_file_creation"
  | "on_folder_creation"
  | "on_file_version_creation"
  | "on_file_status_change";

export type ActionCode =
  | "create_new_project"
  | "transcode"
  | "add_to_project"
  | "reset_task_status_to_default"
  | "move_file_to_folder"
  | "apply_metadata_template";

export type AutomationConfigBase = {
  id: string;
  action: string;
  trigger: string;
  action_code: ActionCode;
  trigger_code: TriggerCode;
  item: string;
  item_id: string;
  created_on: string;
  modified_on: string;
  apply_to_nested_items?: boolean;
};

export type CreateNewProjectAutomationConfig = AutomationConfigBase & {
  action_code: "create_new_project";

  workflow: string;
};

export type AddToProjectAutomationConfig = AutomationConfigBase & {
  action_code: "add_to_project";

  project: string;
};

export type ResetTaskStatusToDefaultConfig = AutomationConfigBase & {
  action_code: "reset_task_status_to_default";
  workflow: string;
};

export type MoveFileToFolderConfig = AutomationConfigBase & {
  action_code: "move_file_to_folder";
  folder: string;
  destination_folder?: {
    id: string;
    name: string;
  };
  destination_file_status: FileStatus;
  status: FileStatus;
};

export type ApplyMetadataTemplateConfig = AutomationConfigBase & {
  action_code: "apply_metadata_template";
  metadata_template_id: string;
};

export type AutomationConfig =
  | CreateNewProjectAutomationConfig
  | AddToProjectAutomationConfig
  | ResetTaskStatusToDefaultConfig
  | MoveFileToFolderConfig;

export type Trigger = {
  id: string;
  trigger_code: TriggerCode;
  name: string;
  description?: string;
};

export type Action = {
  id: string;
  action_code: ActionCode;
  name: string;
  description?: string;
};

// Queries

export type GetAutomationConfigsResponse = AutomationConfig[];
export type GetAutomationTriggersResponse = Trigger[];
export type GetAutomationActionsResponse = Action[];

// Mutations

export interface CreateAutomationConfigRequestPayloadGeneric {
  trigger: string; // ID of the trigger
  action: string; // ID of the action
  action_code: ActionCode;
  workspace_id: string;
  item_id: string;
  apply_to_nested_items: boolean;
}

export interface CreateProjectCreationConfigRequestPayload
  extends CreateAutomationConfigRequestPayloadGeneric {
  action_code: "create_new_project";
  workflow_id: string;
  base_project_name: string;
  add_file_to_task: boolean;
}

export interface CreateTranscodeConfigRequestPayload
  extends CreateAutomationConfigRequestPayloadGeneric {
  action_code: "transcode";
  output_format: string;
  resolution: string;
}

export interface CreateAddToProjectConfigRequestPayload
  extends CreateAutomationConfigRequestPayloadGeneric {
  action_code: "add_to_project";
  project_id: string;
}

export interface ResetTaskStatusConfigRequestPayload
  extends CreateAutomationConfigRequestPayloadGeneric {
  action_code: "reset_task_status_to_default";
  workflow_id: string;
}

export interface MoveFileToFolderConfigRequestPayload
  extends CreateAutomationConfigRequestPayloadGeneric {
  action_code: "move_file_to_folder";
  status: FileStatus;
  destination_file_status: FileStatus;
  folder_id: string;
  destination_folder_id: string;
}

export interface ApplyMetadataTemplateConfigRequestPayload
  extends CreateAutomationConfigRequestPayloadGeneric {
  action_code: "apply_metadata_template";
  metadata_template_id: string;
}

export type CreateAutomationConfigRequestPayload =
  | CreateProjectCreationConfigRequestPayload
  | CreateTranscodeConfigRequestPayload
  | CreateAddToProjectConfigRequestPayload
  | ResetTaskStatusConfigRequestPayload
  | MoveFileToFolderConfigRequestPayload
  | ApplyMetadataTemplateConfigRequestPayload;
