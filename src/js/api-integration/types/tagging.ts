import { User } from "../types/auth";
import {
  VideoDetails as LibraryVideoAssetDetails,
  TaggingStatus,
} from "../types/library";
import { VideoDetails as ProjectVideoAssetDetails } from "../types/projects";
import { PaginatedResult } from "../types/workflow";

export interface Tag {
  id: string;
  name: string;
}

export interface AutoDetection {
  id: string;
  tag: string;
  timestamp: number;
  confidence_score: number;
  created_on: string;
}

export type AddTagPayload = {
  tag: Tag;
  timestamp: number;
};

export type BulkUpdateTagsPayload = {
  tag: string;
  timestamp: number;
  is_reject: boolean;
}[];

export interface TaggingLibrary {
  id: string;
  file: LibraryVideoAssetDetails | ProjectVideoAssetDetails | null;
  tagged_by: User | null;
  tagging_completion_time: number | null;
  file_upload_time: string;
  file_duration: number | null;
  file_size: number | null;
  workspace: string;
  file_type: "library" | "project";
  tagging_status: TaggingStatus;
  origin: "library" | "project";
  process_complete_time: string | null;
}

export type TaggingLibraryResults = PaginatedResult<TaggingLibrary>;

export type TaggingUser = {
  id: string;
  email: string;
  profile: {
    display_name: string;
    profile_picture: string;
    color: string;
  };
  is_default_system_user: false;
};

export type TaggingUserResults = TaggingUser[];

export interface DetectedRunner {
  id: string;
  marathon_participant: null;
  camera_feed: string;
  detected_bib_number: null;
  detected_confidence: number;
  manual_bib_number: null;
  primary_image_url: string;
  track_video_url: null;
  yolo_track_id: string;
  process_status: "yolo_identified";

  images: string[];
}

export type DetectedRunnerResults = PaginatedResult<DetectedRunner>;

export interface MarathonCamera {
  id: string;
  camera_number: string;
  marathon_name: string;
  feed_name: string;
  processing_status: string;
  reprocessed: boolean;
  reprocessing_time: number | null;
  original_url: string;
  person_identified_output_url: string | null;
  transcoded_url: string;
  is_active: boolean;
  total_detections: number;
  manual_tagged_count: number;
  remaining_count: number;
  assigned_to: MarathonCameraAssignee | null;
}

export interface MarathonCameraAssignee {
  id: string;
  email: string;
  profile: {
    display_name: string;
    profile_picture: string | null;
    color: string;
  };
}

export type MarathonCameraResults = PaginatedResult<MarathonCamera>;
