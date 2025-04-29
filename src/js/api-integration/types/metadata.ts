import { z } from "zod";

import { UserMeta } from "../types/meta";
import { SubtitleLanguageCode } from "../types/video";

// import { CreateMetadataTemplateSchema } from "../../schemas/library/metadata";

import { PaginatedAPIResponse } from "../../types/api";
import { CreateMetadataTemplateSchema } from "@/schema/library/library";

export type MetadataFieldType =
  | "text"
  | "number"
  | "date"
  | "text_area"
  | "person"
  | "location"
  | "timecode"
  | "timecode_range"
  | "select"
  | "multiselect"
  | "rating"
  | "toggle"
  | "attachment"
  // Remove these two when we have a better way to handle file status
  | "file_status"
  | "tagging_status";

export interface MetadataFieldInfo {
  id: string;
  name: string;
  field_type: MetadataFieldType;
  options: FieldOption[];
}

export type GetMetadataFieldInfoResponse =
  PaginatedAPIResponse<MetadataFieldInfo>;

export interface MetadataTemplateSummary {
  id: string;
  name: string;
  description: string | null;
  total_categories: number;
  created_by: UserMeta;
}

// export type GetMetadataTemplatesResponse = PaginatedAPIResponse<MetadataTemplateSummary>;
export type GetMetadataTemplatesResponse = MetadataTemplateSummary[];

export interface BaseMetadataTemplateCategory {
  id: string;
  name: string;
  is_table: boolean;
}

export type GetMetadataCategoriesResponse = BaseMetadataTemplateCategory[];

export type AttachmentValue =
  | {
      id: string;
      name: string;
      url: string;
      file_type: string;
      preview_url: string;
    }
  | Record<string, never>;

export type PersonValue =
  | {
      id: string;
      display_name: string;
      profile_picture: string | null;
    }
  | Record<string, never>;

export type TimecodeRangeValue = [string, string] | [];

export type LocationValue =
  | {
      name: string;
      latitude: number;
      longitude: number;
    }
  | Record<string, never>;

export type SelectValue = FieldOption | Record<string, never>;

export type MultiselectValue = SelectValue[];

export type MetadataFieldValue =
  | string
  | boolean
  | number
  | AttachmentValue
  | TimecodeRangeValue
  | LocationValue
  | PersonValue
  | SelectValue
  | MultiselectValue;

export type MetadataTableRowValueInstance = {
  id: string;
  field_membership: string;
  value: MetadataFieldValue;
};

export type FieldOption = {
  id: string;
  value: string;
};

export interface FieldMembership {
  id: string;
  options: FieldOption[];

  field: {
    id: string;
    name: string;
    field_type: MetadataFieldType;
  };
}

export interface MetadataTableRow {
  id: string;
  order: number;
  value_instances: MetadataTableRowValueInstance[];
}

interface MetadataTemplateKeyValueCategory
  extends BaseMetadataTemplateCategory {
  is_table: false;
  field_memberships: FieldMembership[];
}

interface MetadataTemplateTableCategory extends BaseMetadataTemplateCategory {
  is_table: true;
  field_memberships: FieldMembership[];
  rows: MetadataTableRow[];
}

export type MetadataTemplateCategoryAndFields = (
  | MetadataTemplateKeyValueCategory
  | MetadataTemplateTableCategory
)[];

export interface MetadataTemplateDetail {
  id: string;
  name: string;
  categories: MetadataTemplateCategoryAndFields;
  created_by: UserMeta;
}

export type GetMetadataTemplateDetailResponse = MetadataTemplateDetail;

interface MetadataCategoryField {
  id: string;
  field_membership: FieldMembership;
}

export interface MetadataKeyValueCategoryField extends MetadataCategoryField {
  value: MetadataFieldValue;
  is_ai_generated?: boolean;
  reason?: string;
}

export interface MetadataTableCategoryField {
  field_memberships: FieldMembership[];
  rows: MetadataTableRow[];
}

export type GetCategoryMetadataFieldsResponse =
  | MetadataKeyValueCategoryField[]
  | MetadataTableCategoryField;

export interface ModificationDetails {
  id: string;
  modified_by: UserMeta;
  modified_on: string;
}

export interface AutoFillMetadataField {
  value_instance_ids?: string[];
  file_id: string;
  category_instance_id?: string;
}

export interface AutoTranslateMetadataField {
  file_id: string;
  language_code: string;
}

export interface AutoTranslateProjectMetadataField {
  language_code: string;
  instance_id: string;
  instance_type: "project" | "file";
}

export interface AutoFillProjectMetadataField {
  instance_id: string;
  instance_type: "project" | "file";
  select_all: boolean;
  value_instance_ids: string[];
}

export type GetModificationDetailsResponse = ModificationDetails;

export type SelectOption = {
  id: string;
  value: string;
};

export type ActiveTranslationJob = {
  instance_id: string;
  instance_type: "project" | "file";
  status: "in_progress";
  language_code: SubtitleLanguageCode;
  error_message: string;
  eta: number;
  translation_job_type: "library_ai_metadata_translation";
};

export type GetSelectOptionsResponse = SelectOption[];

export type ActiveTranslationJobList = ActiveTranslationJob[];

// Payload
// export type CreateMetadataTemplatePayload = z.infer<
//   typeof CreateMetadataTemplateSchema
// >;
export type CreateMetadataTemplatePayload = z.infer<
  typeof CreateMetadataTemplateSchema
>;

export type CreateMetadataCategoryPayload = { name: string; isTable: boolean };
export type AutoFillMetadataFieldPayload = AutoFillMetadataField;
export type AutoTranslateMetadataFieldPayload = AutoTranslateMetadataField;
export type AutoTranslateProjectMetadataFieldPayload =
  AutoTranslateProjectMetadataField;
export type AutoFillProjectMetadataFieldPayload = AutoFillProjectMetadataField;
