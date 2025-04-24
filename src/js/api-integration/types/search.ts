import {
  AudioDetails,
  FileDetails,
  FolderDetails,
  ImageDetails,
  PhysicalAssetDetails,
  ResourceType,
  VideoDetails,
} from "./library";
import {
  FieldMembership,
  MetadataFieldValue,
  MetadataKeyValueCategoryField,
} from "./metadata";
import { ResourceType as ProjectResourceType } from "./projects";

// import {
//   AudioDetails as ProjectAudioDetails,
//   FileDetails as ProjectFileDetails,
//   FolderDetails as ProjectFolderDetails,
//   ImageDetails as ProjectImageDetails,
//   ResourceType as ProjectResourceType,
//   VideoDetails as ProjectVideoDetails
// } from '@/api-integration/types/projects';

import { PaginatedAPIResponse } from "../../types/api";

export interface QuickSearch {
  id: string;
  name: string;
  thumbnail: string;
  resourcetype: ResourceType | "Project" | ProjectResourceType;
  connection_id?: string;
  file_extension?: string;
  file_type?: string;
  project?: string;
  status: {
    description: string;
    id: string;
    is_default: boolean;
    name: string;
  };
}

export interface QuickSearchResultTable {
  id: string;
  order: number;
  value_instances: {
    field_membership: FieldMembership;
    value: MetadataFieldValue;
    id: string;
  }[];
}

export interface ReportBugPayload {
  moduleName: string;
  error: string;
}

export interface VideoSearchResultDetail
  extends Omit<VideoDetails, "resourcetype"> {
  resourcetype: "VideoFile" | "ProjectVideoFile";
  project: {
    name: string;
    id: string;
    status: {
      description: string;
      id: string;
      is_default: boolean;
      name: string;
    };
  };
  key_value_instances: MetadataKeyValueCategoryField[];
  rows: QuickSearchResultTable[];
  thumbnail: string;
}

export interface AudioSearchResultDetail
  extends Omit<AudioDetails, "resourcetype"> {
  resourcetype: "AudioFile" | "ProjectAudioFile";
  project: {
    name: string;
    id: string;
    status: {
      description: string;
      id: string;
      is_default: boolean;
      name: string;
    };
  };
  key_value_instances: MetadataKeyValueCategoryField[];
  rows: QuickSearchResultTable[];
}

export interface ImageSearchResultDetail
  extends Omit<ImageDetails, "resourcetype"> {
  resourcetype: "ImageFile" | "ProjectImageFile";
  project: {
    name: string;
    id: string;
    status: {
      description: string;
      id: string;
      is_default: boolean;
      name: string;
    };
  };
  key_value_instances: MetadataKeyValueCategoryField[];
  rows: QuickSearchResultTable[];
}

export interface FolderSearchResultDetail
  extends Omit<FolderDetails, "resourcetype"> {
  resourcetype: "Folder" | "ProjectFolder";
  project: {
    name: string;
    id: string;
    status: {
      description: string;
      id: string;
      is_default: boolean;
      name: string;
    };
  };
  key_value_instances: MetadataKeyValueCategoryField[];
  rows: QuickSearchResultTable[];
}

export interface FileSearchResultDetail
  extends Omit<FileDetails, "resourcetype"> {
  resourcetype: "File" | "ProjectFile";
  project: {
    name: string;
    id: string;
    status: {
      description: string;
      id: string;
      is_default: boolean;
      name: string;
    };
  };
  key_value_instances: MetadataKeyValueCategoryField[];
  rows: QuickSearchResultTable[];
}

export interface PhysicalAssetSearchResultDetail
  extends Omit<PhysicalAssetDetails, "resourcetype"> {
  resourcetype: "PhysicalAsset" | "ProjectPhysicalAsset";
  project: {
    name: string;
    id: string;
    status: {
      description: string;
      id: string;
      is_default: boolean;
      name: string;
    };
  };
  key_value_instances: MetadataKeyValueCategoryField[];
  rows: QuickSearchResultTable[];
}

export type QuickSearchDetailedResult =
  | VideoSearchResultDetail
  | AudioSearchResultDetail
  | ImageSearchResultDetail
  | FolderSearchResultDetail
  | FileSearchResultDetail
  | PhysicalAssetSearchResultDetail;

export type SearchForClips = {
  _index: string;
  _id: string;
  _score: number;
  _ignored: string[];
  _source: {
    start_time: number;
    end_time: number;
    in_this_scene: string;
    video_id: string;
    workspace_id: string;
    duration: number;
    scene_title: string;
    video_title: string;
    video_url: string;
    thumbnail: string;
    scrub: string;
    frame_width: number;
    frame_height: number;
    frame_number: number;
    transcripts: {
      transcript: string;
      start_time: number;
      end_time: number;
    }[];
  };
};

export type FilteredQuickSearch = {
  asset_image: string;
  name: string;
  id: string;
  image: string;
  resourcetype: string;
  thumbnail: string;
  file_extension: string;
  file_type: string;
  project: string;
  status: {
    description: string;
    id: string;
    is_default: boolean;
    name: string;
  };
};

export type AddClipsFromLibraryToSearchPayload = {
  clips: {
    id: string;
    start_time: number;
    end_time: number;
  }[];
  parent: string | null;
  workspace: string;
};

export type AddFilesFromProjectsToSearchPayload = {
  clips: {
    id: string;
    start_time: number;
    end_time: number;
  }[];
  parent: string | null;
  project: string;
};

export type GetQuickSearchResponse = PaginatedAPIResponse<QuickSearch>;
export type GetQuickSearchDetailedResultResponse = QuickSearchDetailedResult;
export type GetSearchForClipsResponse = SearchForClips[];
export type GetFilterSearchClipsResponse =
  PaginatedAPIResponse<FilteredQuickSearch>;

export type PostAddClipsFromLibraryToSearchPayload =
  AddClipsFromLibraryToSearchPayload;
export type PostAddFilesFromProjectsToSearchPayload =
  AddFilesFromProjectsToSearchPayload;
