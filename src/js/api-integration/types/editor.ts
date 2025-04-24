import { FaceTrackingData } from "../types/remixes";
import { SubtitleLanguageCode } from "../types/video";

import { ITitle } from "../../types/remixes";

interface BaseAIEdit {
  type: string;
  start_time: number;
  end_time: number;
  timeline_position: number;
}

export interface VideoAIEdit extends BaseAIEdit {
  type: "video";
  video_id: string;
  src: string;
  sprite_sheet: string;
  sprite_width: number;
  sprite_height: number;
  number_of_sprites: number;
  sprite_rows: number;
  sprite_columns: number;
  speed?: number;
  volume?: number;
  is_face_tracked?: boolean;
  face_tracked_data?: FaceTrackingData[];
  subtitles?: {
    start_time: number;
    end_time: number;
    text: string;
    language: SubtitleLanguageCode;
  }[];
  subtitles_language?: SubtitleLanguageCode;
}

export interface TextAIEdit extends BaseAIEdit {
  type: "text";
  text: string;
  isTitleOverlay?: boolean;
  titleOverlayProperties?: ITitle;
}

export interface GraphicAIEdit extends BaseAIEdit {
  type: "graphic";
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  opacity?: number;
}

export interface AudioAIEdit extends BaseAIEdit {
  type: "audio";
  id: string;
  name: string;
  url: string;
  speed?: number;
  volume?: number;
}

export interface GraphicAIEdit extends BaseAIEdit {
  type: "graphic";
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  opacity?: number;
}

export interface AudioAIEdit extends BaseAIEdit {
  type: "audio";
  id: string;
  name: string;
  url: string;
  speed?: number;
  volume?: number;
}

export interface SubtitleAIEdit extends BaseAIEdit {
  type: "subtitle";
  text: string;
}

export interface CodeAIEdit extends BaseAIEdit {
  type: "code";
  code: string;
}

export type AIEditRequest = {
  query: string;
  isComment: boolean;
  itemId: string;
};

export type AIEditResponse = (
  | VideoAIEdit
  | TextAIEdit
  | GraphicAIEdit
  | AudioAIEdit
  | SubtitleAIEdit
  | CodeAIEdit
)[];

export type AutoReframeMarker = {
  start_time: number;
  end_time: number;
  start_frame: number;
  end_frame: number;
  face_middle: number;
  segment_type: 0 | 1;
};
export type ReframingResponse = {
  fps: number;
  time_ranges: AutoReframeMarker[];
};

export type GetSubtitlesPayload = {
  video_id: string;
  in_time: number;
  out_time: number;
  language_code?: SubtitleLanguageCode;
};

export type GetSubtitlesResponse = {
  in_time: number;
  out_time: number;
  language_code: SubtitleLanguageCode;
  video_id: string;
  cues: {
    start_time: number;
    end_time: number;
    text: string;
    language: SubtitleLanguageCode;
  }[];
}[];
