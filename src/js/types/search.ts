import { ResourceType } from "../api-integration/types/library";
import { ResourceType as ProjectResourceType } from "../api-integration/types/projects";

export interface Command {
  label: string;
  description: string;
  command: React.ReactNode;
  key: string;
}

export type Tab =
  | "anywhere"
  | "in-library"
  | "in-project"
  | "in-single-project"
  | "in-folder"
  | "in-review-page";

export type ClipForPayload = {
  id: string;
  start_time: number;
  end_time: number;
  thumbnail: string;
  name?: string;
  url: string;
};

export type QuickSearchResult = {
  id: string;
  name: string;
  thumbnail: string;
  resourcetype: ResourceType | "Project" | ProjectResourceType;
  file_extension?: string;
  file_type?: string;
  project?: string;
  status: {
    description: string;
    id: string;
    is_default: boolean;
    name: string;
  };
};

export type ScopeType =
  | "workspace"
  | "library"
  | "project"
  | "folder"
  | "asset"
  | "projects"
  | null;

export type ClipSearchResult = {
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

export interface SelectedProject {
  id: string;
  name: string;
  status: string;
}
