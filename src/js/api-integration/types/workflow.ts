import { UserMeta } from "../types/meta";
import { FieldMembership } from "../types/metadata";

export interface PaginatedResult<T> {
  data: {
    results: T[];
    meta: {
      total_count: number;
      total_pages: number;
      page_size: number;
      next: string | null;
      previous: string | null;
      current_page: number;
    };
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string | null;
  number_of_projects: number;
  total_step_templates: number;
  updated_at: string;
  created_by: UserMeta;
}

export interface StepType {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  title: string;
  color: string;
}

export interface StepStatus {
  status_icon: string;
  id: string;
  name: string;
  step_type: string;
  data_flow_direction: "Input" | "Output";
  color: string;
  status_category: string;
  is_default: boolean;
}

export interface StatusConnector {
  id: string;
  status: string;
  connector_type: "No-File" | "File";
}

export interface StatusConfig {
  id: string;
  status: StepStatus;
  status_connectors: StatusConnector[];
  is_default: boolean;
  category_position: number;
}

export interface DefaultStatus {
  id: string;
  name: string;
}

export interface StatusDivider {
  Active: StatusConfig[];
  Inactive: StatusConfig[];
  Completed: StatusConfig[];
}

export interface WorkflowStepTemplate {
  id: string;
  step_type: StepType;
  team: Team;
  assigned_user: UserMeta;
  created_at: string;
  updated_at: string;
  x_coordinate: number;
  y_coordinate: number;
  name: string;
  description: string | null;
  due_date: string | null;
  workflow_template: string;
  status_configs: StatusDivider;
  configuration?: Configuration | null;
}

export interface WorkflowStepTemplateDraw {
  default_status: string;
  relative_due_date: number;
  relative_due_date_status: string;
  id: string;
  step_type: StepType;
  team: Team;
  assigned_user: UserMeta;
  created_at: string;
  updated_at: string;
  x_coordinate: number;
  y_coordinate: number;
  name: string;
  description: string;
  due_date: string;
  workflow_template: string;
  status_configs: StatusDivider;
  emoji: string;
  job: string;
  handles: WorkflowTemplateConnectionEdges[] | [];
  configuration?: Configuration;
}

export interface DummyWorkflowStepTemplate {
  name: string;
  position: {
    x: number;
    y: number;
  };
  id: string;
  type: string;
  data: WorkflowStepTemplateDraw;
}

export interface CreateWorkflowTemplatePayload {
  name: string;
  description: string;
  workspace: string;
}

export interface Remix {
  prompt?: string;
  attachments?: File[];
  duration?: number;
}

export interface MetadataGen {
  through_time?: number;
  category?: string;
}

export interface Reframing {
  aspect_ratio?: string;
}

export interface Configuration {
  prompt?: string | null;
  attachments?: File[] | null;
  duration?: number | null;
  aspect_ratio?: string | null;
  through_time?: number | null;
  category?: "basic" | "advanced" | null;
  compliance_level?: "Basic" | "Advanced";
  include_profanity_check?: boolean;
  // type: string | null;
}

export interface CreateWorkflowStepPayload {
  step_type_id: string;
  team_id?: string | null;
  assigned_user_id?: string | null;
  x_coordinate: number;
  y_coordinate: number;
  name: string;
  description: string;
  due_date?: string | null;
  workflow_template: string;
  relative_due_date?: number;
  configuration?: Configuration;
}

export interface EditWorkflowStepPayload {
  team_id?: string | null;
  assigned_user_id?: string | null;
  name?: string;
  description?: string;
  due_date?: string | null;
  x_coordinate?: number;
  y_coordinate?: number;
  default_status?: string | null;
  relative_due_date?: number | null;
  relative_due_date_status?: string | null;
  step_type_id?: string;
  configuration?: Configuration;
}

export interface EditWorkflowStepPositionPayload {
  x_coordinate: number;
  y_coordinate: number;
}

export interface WorkflowStepType {
  id: string;
  name: string;
  category?: "AUTOMATED" | "MANUAL";
}

export interface CreatePromptPayload {
  prompt: string;
  image_file: File | null;
  audio_file: Blob | null;
}

export interface WorkflowTemplatesConversation {
  user: UserMeta;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  id: string;
  is_explanation: boolean;
}

export interface CorrectionResponse {
  message: string;
  original_action: {
    action: string;
    name: string;
    new_name: string;
    step_name_correction: string;
  };
}

export interface CreatePromptResponse {
  corrections: CorrectionResponse[];
  corrections_needed: boolean;
  executed_actions: [];
}

export interface CreateCustomStatusPayload {
  name: string;
  step_status: null;
  status_icon: string;
  is_preset: false;
  status_category: "Active" | "Inactive" | "Completed";
}

export interface WorkflowTemplateConnectionEdges {
  id: string;
  workflow_template: string;
  from_status_connector: string;
  to_status_connector: string;
  from_step_template_id: string;
  to_step_template_id: string;
  connection_type?: "Reset" | "Standard";
}

export interface CreateWorkflowConnectionPayload {
  workflow_template: string;
  from_status_connector: string;
  to_status_connector: string;
  from_step_template_id: string;
  to_step_template_id: string;
}

export interface UpdateStepStatusDefaultPayload {
  is_default: boolean;
}

export interface DeleteWorkflowConnectionPayload {
  ids: string[];
}

export interface UpdateStepConnectionTypePayload {
  connection_type: "Reset" | "Standard";
}

export interface AddFieldToWorkflowMetadataPayload {
  instance_type: string;
  instance_id: string;
  field: string;
}

export interface EditWorkflowMetadataFieldOptionsPayload {
  options: string[];
}
export interface ReorderFieldsInTemplateCategoryPayload {
  instance_id: string;
  instance_type: string;
  metadata_id: string;
  new_position: number;
}

export type CreateWorkflowTemplateMutation = CreateWorkflowTemplatePayload;
export type CreateWorkflowStepMutation = CreateWorkflowStepPayload;
export type CreateCustomStatusMutation = CreateCustomStatusPayload;
export type CreateWorkflowConnectionMutation = CreateWorkflowConnectionPayload;
export type DeleteWorkflowConnectionMutation = DeleteWorkflowConnectionPayload;
export type UpdateStepConnectionTypeMutation = UpdateStepConnectionTypePayload;
export type EditWorkflowStepMutation = EditWorkflowStepPayload;
export type EditWorkflowStepPositionMutation = EditWorkflowStepPositionPayload;
export type UpdateStepStatusDefaultMutation = UpdateStepStatusDefaultPayload;
export type CreatePromptMutation = CreatePromptPayload;
export type AddFieldToWorkflowMetadataMutation =
  AddFieldToWorkflowMetadataPayload;
export type EditWorkflowMetadataFieldOptionsMutation =
  EditWorkflowMetadataFieldOptionsPayload;
export type ReorderFieldsInTemplateCategoryMutation =
  ReorderFieldsInTemplateCategoryPayload;

export type GetWorkflowTemplateResponse = PaginatedResult<WorkflowTemplate>;
export type GetWorkflowTemplateDetailsResponse = WorkflowTemplate;
export type GetWorkflowTemplateStepsListResponse = WorkflowStepTemplate[];
export type GetWorkflowStepTypeResponse = WorkflowStepType[];
export type GetWorkflowTemplateConnectionEdgesResponse =
  WorkflowTemplateConnectionEdges[];
export type GetStepTemplateStatusListResponse = StatusConfig[];
export type GetWorkflowTemplatesConversationResponse =
  WorkflowTemplatesConversation[];
export type GetWorkflowMetadataFieldsResponse = FieldMembership[];
