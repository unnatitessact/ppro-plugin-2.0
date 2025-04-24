import { z } from 'zod';

import { UserMeta } from '@/api-integration/types/meta';

import { PaginatedAPIResponse } from '@/types/api';

import { CodeOutput, TextOutput, TransitionOutput, VideoOutput } from './ai';

export interface PresetCreationPayload {
  title: string;
  category: string;
}

export interface PresetVersion {
  created_at: string;
  metadata_fields: number[];
  enable_code_output: boolean;
  examples: string;
  id?: string;
  instructions: string;
  is_active?: boolean;
  // metadata_explanation: string | null;
  output_format: string[];
  possible_output_types: string[];
  rag_prompt: string;
  role: string | null;
  active_version_number: number;
  version_number: number;
  keywords: string[];
  transition_instructions: string;
  enable_transitions: boolean;
}

export interface Preset {
  category: string;
  created_at: string;
  id: string;
  title: string;
  created_by: UserMeta | null;
  dislikes: number;
  keywords: string[];
  likes: number;
  times_used: number;
  updated_at: string;
  updated_by: UserMeta | null;
  versions: PresetVersion[];
  status: string;
}

export interface PresetEditPayload {
  category?: string;
  created_at?: string;
  title?: string;
  dislikes?: number;
  keywords?: string[];
  likes?: number;
  version?: number | null;
  status?: string;
}

export interface PresetDuplicatePayload {
  preset_id: string;
}

export interface PresetsDeleteMultiplePayload {
  preset_ids: string[];
}

export type PresetPromptsFieldResponse = {
  elastic_search_field: string;
  id: number;
  name: string;
}[];

export interface ReelData {
  description: string;
  video_data: (VideoOutput | TransitionOutput | TextOutput | CodeOutput)[];
  reasoning: string;
}

export interface PresetStatusObj {
  id: string;
  name: string;
}

export interface GetGeneratedPromptMutation {
  role: string;
  metadata_fields: number[];
  instructions: string;
  examples: string;
  model_id: string;
  rag_prompt: string;
  output_format: string[];
  possible_output_types: string[];
  keywords: string[];
  create_new_version: boolean;
  enable_code_output: boolean;
  enable_transitions: boolean;
  transition_instructions: string;
}

export type PresetVersionUpdateMutation = PresetVersion & { create_new_version: boolean };

export type PresetListResponse = PaginatedAPIResponse<Preset>;
export type PresetCreationMutation = PresetCreationPayload;
export type PresetEditMutation = PresetEditPayload;
export type PresetDuplicateMutation = PresetDuplicatePayload;
export type DeleteMultiplePresetsMutation = PresetsDeleteMultiplePayload;

export const presetFormSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  role: z.string().min(1, 'Role is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  ragPrompt: z.string(),
  codeOutput: z.boolean(),
  example: z.string().optional(),
  fields: z.array(z.number()),
  possibleOutputTypes: z.array(z.string()),
  keywords: z.string().min(1, 'Keywords are required'),
  create_new_version: z.boolean().optional(),
  enabledTransitions: z.boolean(),
  transitionsInstructions: z.string().optional()
});

export type PresetFormValues = z.infer<typeof presetFormSchema>;
