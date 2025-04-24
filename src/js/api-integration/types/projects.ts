import { DateValue } from "@internationalized/date";
import { JsonObject } from "@liveblocks/client";

import { User } from "./auth";
import { UserMeta } from "./meta";
import { FieldOption, MetadataFieldType, MetadataFieldValue } from "./metadata";
import { ExternalUser } from "./review";
import { PaginatedResult } from "./workflow";

import { PaginatedLibraryResult } from "./api";
import { PaginatedProjectResult } from "../../types/projects";

export interface StackedFiles {
  id: string;
  thumbnail: string;
  type: "video" | "image" | "audio" | "physical_asset" | "folder";
}
export interface Project {
  id: string;
  name: string;
  description: string;
  due_date: string | null;
  is_archived: boolean;
  created_by: string;
  modified_by: string;
  created_on: DateValue | null;
  modified_on: DateValue | null;
  completed_tasks: number;
  total_tasks: number;
  status: ProjectStatus;
  workspace: string;
  assigned_workflow: ProjectWorkflow;
  file_count: number;
  files: StackedFiles[];
  task_user_file_access: boolean;
  user_type: "owner" | "project_user" | "task_member" | "full_access";
  all_task_access_to_project_members: boolean;
  shared_users_download_access: boolean;
}

export interface ProjectWorkflow {
  id: string;
  name: string;
  description: string;
}

export interface ProjectStatus {
  id: string;
  name: string;
}

export interface ProjectMemberProfile {
  first_name: string;
  last_name: string;
  color: string;
  display_name: string;
  profile_picture: string;
}

export interface ProjectMemberTeam {
  color: string;
  id: string;
  name: string;
}

export interface ProjectMember {
  id: string;
  email: string;
  role: string;
  teams?: ProjectMemberTeam[] | [];
  profile: ProjectMemberProfile;
}

export interface ProjectMembersList {
  project_users: ProjectMember[];
  team_and_task_users: ProjectMember[];
}

export type ProjectResults = PaginatedProjectResult<Project>;
export type ProjectStatusResults = ProjectStatus[];
export type SelectedProjectResults = Project;
export type SelectedProjectMembersResults = ProjectMembersList;

export interface CreateProjectPayload {
  name: string;
  description: string;
  workspace: string;
  assigned_workflow?: string;
}

interface EditProjectPayload {
  name?: string;
  description?: string;
  due_date?: string;
  is_archived?: boolean;
  status?: string;
  workspace: string;
  task_user_file_access?: boolean;
  all_task_access_to_project_members?: boolean;
  shared_users_download_access?: boolean;
}
export interface UpdateProjectMemberPayload {
  user_id: string;
  role?: "full_access" | "viewer";
  action: "ADD_USER" | "RM_USER";
}

export interface UpdateProjectMemberRolePayload {
  user_id: string;
  role: "full_access" | "viewer";
}

export interface TaskConnection {
  to_status_connector_status_icon: string;
  from_status_connector_status_icon: string;
  to_step_description: string;
  from_step_description: string;
  attachment: LibraryAsset[];
  from_status_connector: string;
  from_step: string;
  id: string;
  is_active_version_required: boolean;
  to_status_connector: string;
  to_step: string;
}

export interface Team {
  id: string;
  color: string;
  title: string;
}

export interface StatusOption {
  id: string;
  outgoing_connections: number;
  status_icon: string;
  status_name: string;
  category_position?: number;
  status_category?: string;
}

export interface BlockedTask {
  id: string;
  name: string;
  description: string;
  current_status: StatusOption;
}

export interface AffectedStatus {
  current_status: string;
  current_status_icon: string;
  id: string;
  status_icon: string;
  status_name: string;
  step_instance_id: string;
  step_instance_name: string;
  connection_id: string;
}

export interface WorkflowInstance {
  created_by: User | null;
  created_on: string;
  id: string;
  modified_by: User | null;
  modified_on: string;
  project: {
    id: string;
    name: string;
  };
  workflow_template: string | null;
}

export interface Task {
  showBucketHeading: boolean;
  assigned_user: User;
  created_by: User;
  created_on: string;
  current_status: StatusOption;
  description: string;
  due_date: string;
  id: string;
  is_persistent: boolean;
  modified_by: User | null;
  modified_on: string;
  name: string;
  step_type: string;
  team: Team;
  workflow_instance: WorkflowInstance;
  x_coordinate: number;
  y_coordinate: number;
  incoming_connections: TaskConnection[];
  outgoing_connections: TaskConnection[];
  bucket: "Your tasks" | "Assigned to your team" | "Assigned to any team";
  status_options: StatusOption[];
  status_change_history: TaskHistory[];
  blocked_by: BlockedTask[];
  blocked_tasks: BlockedTask[];
  step_instance_attachment: LibraryAsset[];
  task_category:
    | "Your tasks"
    | "Assigned to your teams"
    | "Assigned to other teams";
  project_id: string;
  step_order_number: number;
  project_name?: string;
  open_task_file_selector?: boolean;
  task_user_file_access?: boolean;
  external_user_email?: string | null;
}

interface AddFilesToProjectStepPayload {
  attachment_ids: string[];
}

// export interface TaskListResults {
//   my_tasks: Task[];
//   my_team_tasks: Task[];
//   other_team_tasks: Task[];
// }

export type ResourceType =
  | "ProjectImageFile"
  | "ProjectAudioFile"
  | "ProjectFolder"
  | "ProjectVideoFile"
  | "ProjectFile"
  | "ProjectPhysicalAsset"
  | "ProjectVersionStack";

export interface BaseAsset {
  id: string;
  name: string;
  parent: string | null;
  created_on: string;
  size: number;
  resourcetype: ResourceType;
  file_extension: string;
  is_attached_to_task: boolean;
}

export interface VideoAsset extends BaseAsset {
  resourcetype: "ProjectVideoFile";
  duration: number;
  video_width: number;
  video_height: number;
  codec: string;
  scrub_url: string | null;
  thumbnail: string | null;
  scrub_width: number;
  scrub_height: number;
  comments_count: number;
  file_status: string;
  url: string;
}

export interface AudioAsset extends BaseAsset {
  resourcetype: "ProjectAudioFile";
  duration: number;
  wave_form: string;
  codec: string;
  file_status: string;
}

export interface ImageAsset extends BaseAsset {
  resourcetype: "ProjectImageFile";
  resolution:
    | {
        width: number;
        height: number;
      }
    | Record<string, never>;
  thumbnail: string | null;
  file_status: string;
}

export interface PhysicalAsset extends BaseAsset {
  id: string;
  name: string;
  parent: string | null;
  created_on: string;
  resourcetype: "ProjectPhysicalAsset";
  barcode: string;
  asset_image: string | null;
  location: string;
  file_status: string;
}

export interface VersionStackItem {
  id: string;
  version_number: number;
  file: Exclude<LibraryAsset, VersionStackAsset | Folder>; //  a version stack cannot be nested inside version stack
  created_on: string;
}

export interface VersionStackItemDetailed {
  id: string;
  version_number: number;
  file: Exclude<AssetDetails, VersionStackAssetDetails | FolderDetails>; //  a version stack cannot be nested inside version stack
  created_on: string;
}

export interface VersionStackAsset {
  id: string;
  name: string;
  resourcetype: "ProjectVersionStack";
  versions: VersionStackItem[];
  is_attached_to_task: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parent: string | null;
  created_on: string;
  children_count: number;
  sub_contents: FolderSubContent[];
  resourcetype: "ProjectFolder";
  connection_id?: string;
  is_attached_to_task: boolean;
}

export interface FileAsset extends BaseAsset {
  resourcetype: "ProjectFile";
  file_status: string;
}

export interface BaseSubContent {
  id: string;
  type: "video" | "image" | "audio" | "physical_asset" | "folder";
}

export interface VideoSubContent extends BaseSubContent {
  type: "video";
  thumbnail: string | null;
}

export interface ImageSubContent extends BaseSubContent {
  type: "image";
  thumbnail: string | null;
}

export interface AudioSubContent extends BaseSubContent {
  type: "audio";
  wave_form: string;
}

export interface PhysicalAssetSubContent extends BaseSubContent {
  type: "physical_asset";
  barcode: string;
  asset_image: string | null;
}

export interface IncomingFileBase {
  id: string;
  name: string;
  resourcetype: ResourceType;
}
export interface IncomingFileAsset extends IncomingFileBase {
  resourcetype: Exclude<ResourceType, "ProjectVersionStack">;
}

export interface IncomingFileVersionStack extends IncomingFileBase {
  resourcetype: "ProjectVersionStack";
  versions: VersionStackItem[];
}

export type IncomingFile = IncomingFileAsset | IncomingFileVersionStack;

export type FolderSubContent =
  | BaseSubContent
  | VideoSubContent
  | ImageSubContent
  | AudioSubContent
  | PhysicalAssetSubContent;

export type LibraryAsset =
  | VideoAsset
  | AudioAsset
  | ImageAsset
  | Folder
  | FileAsset
  | PhysicalAsset
  | VersionStackAsset;

interface BaseDetails {
  id: string;
  connection_id: string | null;
  name: string;
  parent: {
    id: string;
    name: string;
    parent: string | null;
    created_on: string;
  };
  created_on: string;
  created_by: UserMeta | null;
  modified_on: string;
  modified_by: UserMeta | null;
  resourcetype: ResourceType;
  is_attached_to_task: boolean;
  external_user: ExternalUser | null;
}

export interface FolderDetails extends BaseDetails {
  resourcetype: "ProjectFolder";
  total_files: number;
  total_folders: number;
  total_size: number;
}

export interface FileDetails extends BaseDetails {
  resourcetype: "ProjectFile";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  url: string;
  file_status: string;
}

export interface VideoDetails extends BaseDetails {
  resourcetype: "ProjectVideoFile";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  duration: number;
  video_width: number;
  video_height: number;
  codec: string;
  scrub_url: string | null;
  thumbnail: string | null;
  scrub_width: number;
  scrub_height: number;
  url: string;
  playlist_file: string | null;
  frame_rate?: number;
  file_status: string;
  start_time?: number;
  end_time?: number;
}

export interface AudioDetails extends BaseDetails {
  resourcetype: "ProjectAudioFile";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  duration: number;
  url: string;
  file_status: string;
}

export interface ImageDetails extends BaseDetails {
  resourcetype: "ProjectImageFile";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  resolution: {
    width: number;
    height: number;
  };
  thumbnail: string | null;
  url: string;
  file_status: string;
}

export interface PhysicalAssetDetails extends BaseDetails {
  resourcetype: "ProjectPhysicalAsset";
  barcode: string;
  asset_image: string | null;
  location: string;
}

export interface VersionStackAssetDetails extends BaseDetails {
  resourcetype: "ProjectVersionStack";
  versions: VersionStackItemDetailed[];
}

export interface UpdateTaskCardDetailsPayload {
  updates: {
    user_id?: string | null;
    team_id?: string | null;
    due_date?: string | null;
    current_status?: string | null;
    name?: string | null;
    description?: string | null;
    step_instance_attachment?: string[];
    step_type?: string;
  };
}

export interface AddLibraryFilesToProjectPayload {
  content_ids: string[];
  project_id: string;
  parent: string | null;
}

export interface AddProjectFilesToProjectPayload {
  item_ids: string[];
  project_id: string;
  parent: string | null;
}

export interface TaskStatus {
  status_icon: string;
  status_name: string;
}

export interface AttachmentDetails {
  attachment: LibraryAsset;
  related_step_instance: {
    name: string;
    id: string;
    description: string;
    incoming_connections: TaskConnection[];
    outgoing_connections: TaskConnection[];
    status_change_history: TaskHistory[];
  };
}

export interface AttachmentChangeDetails {
  added_attachments: AttachmentDetails[];
  removed_attachments: AttachmentDetails[];
  new_attachments: AttachmentDetails[];
  old_attachments: AttachmentDetails[];
}

export interface AddtionalHistoryData {
  assigned_user: UserMeta;
  user: UserMeta;
  current_status: TaskStatus;
  team: Team;
  old_status: StatusOption;
  new_status: StatusOption;
  attachments_details?: AttachmentDetails[];
  file_direction: "input" | "output";
  external_user_email?: string;
}
export interface TaskHistory {
  id: string;
  user: UserMeta;
  history_type: "created" | "assigned_to_person" | "status_changed";
  created_at: string;
  additional_data: AddtionalHistoryData | AttachmentChangeDetails;
  external_user_email?: string;
}

export interface CreateNewTaskPayload {
  name: string;
  step_type: string;
  assigned_user?: string;
  description?: string;
  team?: string;
  due_date?: string | null;
  project: string;
}

export interface CreateNewWorkflowTaskPayload {
  name: string;
  step_type: string;
  assigned_user?: string;
  description?: string;
  team?: string;
  due_date?: string | null;
  configuration?: {
    [key: string]: string;
  };
}

export interface ProjectMetadata {
  plain_value: string;
  value: MetadataFieldValue;
  id: string;
  name: string;
  field: {
    id: string;
    name: string;
    field_type: MetadataFieldType;
  };
  options: FieldOption[];
  modified_on: string;
  modified_by: UserMeta;
  is_ai_generated: boolean;
  reason: string;
}

export interface TaskStepType {
  id: string;
  name: string;
}

export interface TaskDetail {
  id: string;
  name: string;
  description: string;
  current_status: StatusOption;
  incoming_connections: TaskConnection[];
  outgoing_connections: TaskConnection[];
  step_instance_attachment: LibraryAsset[];
  status_options: StatusOption[];
  status_change_history: TaskHistory[];
  step_type: string;
  project_id: string;
  open_task_file_selector: boolean;
  team: Team;
  assigned_user: User;
}

export interface ArchiveProjectsPayload {
  project_ids: string[];
  archive: boolean;
}

export interface ProjectIds {
  project_ids: string[];
}

export interface ProjectTaskStatusUpdatedEvent extends JsonObject {
  type:
    | "PROJECT_UPDATE"
    | "PROJECTS_LIST_UPDATED"
    | "PROJECT_TASK_UPDATE"
    | "PROJECT_STATUS_CHANGED"
    | "PROJECT_MEMBERS_UPDATED"
    | "PROJECT_METADATA_UPDATED";
  // data: JsonObject;
}

export interface ProjectLibraryUpdatedEvent extends JsonObject {
  type: "PROJECT_LIBRARY_UPDATED" | "METADATA_UPDATED";
}

export interface GlobalTaskListUpdatedEvent extends JsonObject {
  type:
    | "PROJECT_UPDATE"
    | "PROJECTS_LIST_UPDATED"
    | "PROJECT_TASK_UPDATE"
    | "PROJECT_STATUS_CHANGED"
    | "PROJECT_MEMBERS_UPDATED"
    | "PROJECT_METADATA_UPDATED";
  // data: JsonObject;
}

export interface DuplicateProjectPayload {
  copy_content: boolean;
}

export type AssetDetails =
  | FolderDetails
  | VideoDetails
  | AudioDetails
  | ImageDetails
  | FileDetails
  | PhysicalAssetDetails
  | VersionStackAssetDetails;

export type LibraryResults = PaginatedLibraryResult<LibraryAsset>;

// mutations
export type CreateProjectMutation = CreateProjectPayload;
export type EditProjectMutation = EditProjectPayload;
export type UpdateProjectMemberMutation = UpdateProjectMemberPayload[];
export type UpdateProjectMemberRoleMutation = UpdateProjectMemberRolePayload;
export type AddFilesToProjectStepMutation = AddFilesToProjectStepPayload;
export type UpdateTaskCardDetailsMutation = UpdateTaskCardDetailsPayload;
export type AddLibraryFilesToProjectMutation = AddLibraryFilesToProjectPayload;
export type AddProjectFilesToProjectMutation = AddProjectFilesToProjectPayload;
export type CreateNewTaskMutation = CreateNewTaskPayload;
export type CreateNewWorkflowTaskMutation = CreateNewWorkflowTaskPayload;
export type ArchiveUnarchiveProjectsMutation = ArchiveProjectsPayload;
export type PassMultipleProjectIdsMutation = ProjectIds;
export type DuplicateProjectMutation = DuplicateProjectPayload;

export type CreateVersionStackPayload = {
  file_ids: string[];
};

export type AddFileToVersionStackPayload = {
  file_ids: string[];
  version_stack_id: string;
};

export type RemoveFileFromVersionStackPayload = {
  version_stack_item_id: string;
  version_stack_id: string;
};

export type ReorderVersionStackPayload = {
  version_stack_id: string;
  new_order: string[]; // file ids in a new order
};

// queries
export type TaskListResponse = Task[];
export type GlobalTaskListResponse = PaginatedResult<Task>;
export type AffectedStepsResponse = AffectedStatus[];
export type IncomingFileResults = IncomingFile[];
export type TaskHistoryResults = TaskHistory[];

// metadata
export type ProjectMetadataResults = ProjectMetadata[];
export type TaskStatusListResults = TaskStatus[];
export type TaskStepTypeListResults = TaskStepType[];
export type TaskDetailsResult = TaskDetail;
