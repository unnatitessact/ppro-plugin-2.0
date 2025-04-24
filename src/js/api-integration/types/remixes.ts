// import { AspectRatio } from "../../features/editor-v2/types";

import { IndexStatus } from "./library";
import { SubtitleLanguageCode } from "./video";

import { PaginatedAPIResponse } from "./api";

export type AspectRatio = "16:9" | "1:1" | "4:5" | "9:16";

export interface ProcessedVideo {
  id: string;
  name: string;
  thumbnail: string | null;
  duration: number;
  size: number;
  url: string;
  scrub_url: string | null;
  scrub_width: number;
  scrub_height: number;
  playlist_file: string | null;
  index_status: IndexStatus;
}

export interface Scene {
  _id: string;
  start_time: number;
  end_time: number;
  video_id: string;
  video_url: string;
  face_tracking: ReframeData | null;
  speed?: number;
  volume?: number;
}

export type ReframeData = {
  fps: number;
  time_ranges: FaceTrackingData[];
};

export interface FaceTrackingData {
  start_time: number;
  end_time: number;
  start_frame: number;
  end_frame: number;
  face_middle: number;
  segment_type: 0 | 1;
}

export interface GeneratedReel {
  title: string;
  hashtags: string[];
  scenes: Scene[];
}

export interface TranscriptionItem {
  // id: string;
  // type: string;
  // alternatives: {
  //   content: string;
  //   confidence: number;
  // }[];
  // start_time: number;
  // end_time: number;
  // speaker_label: string;
  start_time: number;
  end_time: number;
  text: string;
  language: SubtitleLanguageCode;
}

export interface Transcription {
  video_id: string;
  items: TranscriptionItem[];
}

export type GetProcessedVideosResponse = PaginatedAPIResponse<ProcessedVideo>;
export type GetGeneratedReelsResponse = GeneratedReel[];
export type GetTranscriptionsResponse = Transcription[];

export type TranscriptionPayload = {
  video_id: string;
  in_time: number;
  out_time: number;
};

export type GetTranscriptionsPayload = TranscriptionPayload[];

export interface PreloadData {
  clips: Scene[];
  transcriptions: Transcription[];
  aspectRatio: AspectRatio;
  titleOverlay: string;
  isFaceTrackingEnabled: boolean;
}

export type CreateDraftFromRemixPayload = {
  preload_data: PreloadData;
  parent_id: string | null;
  name: string;
  destination: "library" | "project";
  project_id?: string;
};

export type CreateVideoFromRemixPayload = {
  url: string;
  parent_id: string | null;
  name: string;
  destination: "library" | "project";
  project_id?: string;
  size: number;
};

export type CreateDraftFromRemixResponse = {
  id: string;
  name: string;
};

export type GenerateRemixesPayload = {
  video_ids: string[];
  user_query: string;
  parent_id?: string | null;
};

export type ReelSuggestions = {
  video_ids: string[];
  prompt: string;
};

export type BulkTranslateSubtitlesPayload = {
  video_ids: string[];
  language_code: string;
};

export type GetRemixSubtitlesPayload = {
  video_id: string;
  language_code: string;
  in_time: number;
  out_time: number;
}[];

export type TranslateTitlePayload = {
  title: string;
  language: string;
};

export type IndexedVideoWithCount = {
  latest_thumbnails: string[];
  total_video_count: number;
  total_folder_count: number;
};
