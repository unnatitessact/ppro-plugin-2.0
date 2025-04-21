import { z } from "zod";

import { PermissionPayload } from "../security-group";

import { FieldOption, MetadataFieldType } from "../metadata";

import { CreateFolderSchema } from "../../../schema/library/folders";

import { PaginatedLibraryResult } from "../api";

import { UserMeta } from "../meta";
import { ExternalUser } from "../review";

export type ResourceType =
  | "ImageFile"
  | "AudioFile"
  | "Folder"
  | "VideoFile"
  | "File"
  | "PhysicalAsset"
  | "VersionStack";

export type FileStatus =
  // | 'inactive'
  | "not_started"
  // | 'waiting'
  | "needs_edit"
  | "processed"
  | "in_progress"
  | "approved"
  | "rejected";

export type IndexStatus =
  | "not_started"
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  | "transcoding"
  | "corrupted";

export type TaggingStatus =
  | "not_yet_ready"
  | "ready_for_tagging"
  | "in_progress"
  | "completed"
  | "cancelled";

export type SharedStatus = "public" | "private" | "public_and_private";
export interface BaseAsset {
  id: string;
  name: string;
  parent: string | null;
  created_on: string;
  size: number;
  resourcetype: ResourceType;
  file_extension: string;
  file_status: FileStatus;
  comments_count: number;
  permissions?: PermissionPayload[];
  share_status?: SharedStatus | null;
  connection_id?: string | null;
  // Add file_type back when we have a fixed set of file types
  //   file_type: string;
}

export type BaseAssetMinimal = Omit<BaseAsset, "permissions">;

export interface FileAsset extends BaseAsset {
  resourcetype: "File";
}

export type FileAssetMinimal = Omit<FileAsset, "permissions">;

export interface VideoAsset extends BaseAsset {
  resourcetype: "VideoFile";
  duration: number;
  video_width: number;
  video_height: number;
  codec: string;
  scrub_url: string | null;
  thumbnail: string | null;
  scrub_width: number;
  scrub_height: number;
  tagging_status: TaggingStatus;
  index_status: IndexStatus;
  index_percent: number;
  url: string;
}

export type VideoAssetMinimal = Omit<VideoAsset, "permissions">;

export interface AudioAsset extends BaseAsset {
  resourcetype: "AudioFile";
  duration: number;
  wave_form: string;
  codec: string;
}

export type AudioAssetMinimal = Omit<AudioAsset, "permissions">;

export interface ImageAsset extends BaseAsset {
  resourcetype: "ImageFile";
  resolution:
    | {
        width: number;
        height: number;
      }
    | Record<string, never>;
  thumbnail: string | null;
}

export type ImageAssetMinimal = Omit<ImageAsset, "permissions">;

export interface PhysicalAsset extends BaseAsset {
  id: string;
  name: string;
  parent: string | null;
  created_on: string;
  resourcetype: "PhysicalAsset";
  barcode: string;
  asset_image: string | null;
  location: string;
}

export type PhysicalAssetMinimal = Omit<PhysicalAsset, "permissions">;

export interface VersionStackItem {
  id: string;
  version_number: number;
  file: Exclude<LibraryAsset, VersionStackAsset | Folder>; //  a version stack cannot be nested inside version stack
  created_on: string;
}

export type VersionStackItemMinimal = Omit<VersionStackItem, "permissions">;

export interface VersionStackItemDetailed {
  id: string;
  version_number: number;
  file: Exclude<AssetDetails, VersionStackAssetDetails | FolderDetails>; //  a version stack cannot be nested inside version stack
  created_on: string;
}

export interface VersionStackAsset extends BaseAsset {
  id: string;
  name: string;
  resourcetype: "VersionStack";
  versions: VersionStackItem[];
}

export type VersionStackAssetMinimal = Omit<VersionStackAsset, "permissions">;

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

export type FolderSubContent =
  | BaseSubContent
  | VideoSubContent
  | ImageSubContent
  | AudioSubContent
  | PhysicalAssetSubContent;

export interface Folder {
  id: string;
  name: string;
  parent: string | null;
  created_on: string;
  children_count: number;
  sub_contents: FolderSubContent[];
  resourcetype: "Folder";
  connection_id?: string | null;
  permissions?: PermissionPayload[];
}

export type FolderMinimal = Omit<Folder, "permissions" | "sub_contents">;

export type LibraryAsset =
  | VideoAsset
  | AudioAsset
  | ImageAsset
  | Folder
  | FileAsset
  | PhysicalAsset
  | VersionStackAsset;

export type LibraryAssetMinimal =
  | VideoAssetMinimal
  | AudioAssetMinimal
  | ImageAssetMinimal
  | FolderMinimal
  | FileAssetMinimal
  | PhysicalAssetMinimal
  | VersionStackAssetMinimal;

export type LibraryResults = PaginatedLibraryResult<LibraryAssetMinimal>;

export interface LibraryContentPermissions {
  [key: string]: PermissionPayload[];
}

export interface LibraryContentSubContents {
  [key: string]: FolderSubContent[];
}

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
  file_status: FileStatus;
  comments_count: number;
  permissions: PermissionPayload[];
  external_user: ExternalUser | null;
}

export interface FolderDetails extends BaseDetails {
  resourcetype: "Folder";
  total_files: number;
  total_folders: number;
  total_size: number;
}

export interface FileDetails extends BaseDetails {
  resourcetype: "File";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  url: string;
}

export interface VideoDetails extends BaseDetails {
  resourcetype: "VideoFile";
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
  tagging_status: TaggingStatus;
  frame_rate?: number;
  transcoded_480p_key?: string;
  index_status?: IndexStatus;
  index_percent?: number;
  start_time?: number;
  end_time?: number;
}

export interface AudioDetails extends BaseDetails {
  resourcetype: "AudioFile";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  duration: number;
  url: string;
}

export interface ImageDetails extends BaseDetails {
  resourcetype: "ImageFile";
  size: number;
  file_extension: string;
  technical_metadata: Record<string, string>;
  resolution: {
    width: number;
    height: number;
  };
  thumbnail: string | null;
  url: string;
}

export interface PhysicalAssetDetails extends BaseDetails {
  resourcetype: "PhysicalAsset";
  barcode: string;
  asset_image: string | null;
  location: string;
}

export interface VersionStackAssetDetails extends BaseDetails {
  resourcetype: "VersionStack";
  versions: VersionStackItemDetailed[];
}

export type AssetDetails =
  | FolderDetails
  | VideoDetails
  | AudioDetails
  | ImageDetails
  | FileDetails
  | PhysicalAssetDetails
  | VersionStackAssetDetails;

interface AIGeneratedFilter {
  meta_field_name: string;
  static_field_name: string;
  field_type: MetadataFieldType;
  operator: string;
  value: string;
  options: FieldOption[];
}

export type AIGeneratedFiltersResponse = AIGeneratedFilter[];

export type ListFoldersOfConnection = string[];

export interface View {
  id: string;
  created_by: UserMeta;
  modified_by: UserMeta;
  created_on: string;
  modified_on: string;
  name: string;
  description: string | null;
  ai_search_query: string | null;
  workspace: string;
}

export type GetViewsResponse = View[];

export interface SpriteSheet {
  columns: number;
  rows: number;
  frame_width: number;
  frame_height: number;
  sprite_sheet: string;
  number_of_frames: number;
}

export interface HasDeleteAccessResponse {
  has_access: boolean;
}

// Request payloads
export type CreateFolderPayload = z.infer<typeof CreateFolderSchema>;

export type CreatePhysicalAssetPayload = {
  name: string;
  barcode: string;
  asset_image: File | null;
  location: string;
};

export type CreateViewPayload = {
  name: string;
  ai_search_query: string;
  // visible_to_all: boolean;
  // filters: Filter[];
  // filter_match_type: 'all' | 'any';
};

export type CreateDocumentPayload = {
  name: string;
  category: string;
};

// export type CreateVersionPayload = {
//   pk: string;
//   version_file_id: string;
// };

// export type DeleteVersionPayload = {
//   pk: string;
//   file_version_id: string;
// };

// export type ReorderVersionPayload = {
//   pk: string;
//   new_order: string[];
// };

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
