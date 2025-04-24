import { FlipDirection } from "@remotion/transitions/flip";
import { SlideDirection } from "@remotion/transitions/slide";
import { WipeDirection } from "@remotion/transitions/wipe";

import { UserMeta } from "../types/meta";

import { PaginatedAPIResponse } from "../../types/api";
import { ITitle } from "../../types/remixes";

export type TransitionType =
  | "fade"
  | "slide"
  | "wipe"
  | "flip"
  | "clockWipe"
  | "star"
  | "circle"
  | "rectangle"
  | "slidingDoors";

export interface BaseTransition {
  type: "transition";
  transitionType: TransitionType;
  duration: number;
  direction?: SlideDirection | WipeDirection | FlipDirection;
  height?: number;
  width?: number;
}

export interface FadeTransition extends BaseTransition {
  transitionType: "fade";
}

export interface SlideTransition extends BaseTransition {
  transitionType: "slide";
  direction: SlideDirection;
}

export interface WipeTransition extends BaseTransition {
  transitionType: "wipe";
  direction: WipeDirection;
}

export interface FlipTransition extends BaseTransition {
  transitionType: "flip";
  direction: FlipDirection;
}

export interface ClockWipeTransition extends BaseTransition {
  transitionType: "clockWipe";
  height: number;
  width: number;
}

export interface StarTransition extends BaseTransition {
  transitionType: "star";
  height: number;
  width: number;
}

export interface CircleTransition extends BaseTransition {
  transitionType: "circle";
  height: number;
  width: number;
}

export interface RectangleTransition extends BaseTransition {
  transitionType: "rectangle";
  height: number;
  width: number;
}

export interface SlidingDoorsTransition extends BaseTransition {
  transitionType: "slidingDoors";
  height: number;
  width: number;
}

export type TransitionOutput =
  | FadeTransition
  | SlideTransition
  | WipeTransition
  | FlipTransition
  | ClockWipeTransition
  | StarTransition
  | CircleTransition
  | RectangleTransition
  | SlidingDoorsTransition;

export interface BaseCompositionOutput {
  type: "video" | "text" | "graphic" | "audio" | "subtitle" | "code";
  start_time: number;
  end_time: number;
  selected?: boolean;
}

export interface VideoOutput extends BaseCompositionOutput {
  type: "video";
  id: string;
  url: string;
  speed?: number;
  volume?: number;
}

export interface TextOutput extends BaseCompositionOutput {
  type: "text";
  text: string;
  isTitleOverlay?: boolean;
  titleOverlayProperties?: ITitle;
}

export interface SubtitleOutput extends BaseCompositionOutput {
  type: "subtitle";
  text: string;
}

export interface GraphicOutput extends BaseCompositionOutput {
  type: "graphic";
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  opacity?: number;
}

export interface AudioOutput extends BaseCompositionOutput {
  type: "audio";
  id: string;
  title: string;
  url: string;
  speed?: number;
  volume?: number;
}

export interface CodeOutput extends BaseCompositionOutput {
  type: "code";
  code: string;
}

export type CompositionOutput = (
  | VideoOutput
  | TextOutput
  | GraphicOutput
  | AudioOutput
  | SubtitleOutput
  | CodeOutput
)[];

export interface TimelineOutput {
  name: string;
  timestamps: {
    start_time: number;
    end_time: number;
    desc: string;
  }[];
}

export interface AIResponse {
  content: string;
  timeline_output: TimelineOutput[];
  video_output: VideoOutput[];
}

export interface AIConversation {
  id: string;
  title: string;
  created_at: string;
  created_by: (UserMeta & { is_default_system_user: boolean }) | null;
  updated_by: (UserMeta & { is_default_system_user: boolean }) | null;
  last_response: AIResponse[] | null;
}

export interface AIConversationChat {
  id: string;
  content: string;
  response: AIResponse;
  created_at: string;
  template: Preset | null;
}

export interface SystemPrompt {
  key: string;
  title: string;
  description: string;
  prefill_input: string;
}

export interface CreateTemplateFromConversation {
  workspace: string;
  guideline: string;
  title: string;
  duration: number;
  is_public: boolean;
  intent: string;
}

export interface GuidelineAndTitleForPromptResponse {
  title: string;
  guideline: string;
  duration: number;
  intent: {
    intent: string;
    sub_intent: string;
    conversation_title: string;
    search_query: string;
  };
}

export interface Preset {
  id: string;
  title: string;
  generated_guidelines: string;
  created_at: string;
  mentions: string[];
  intent: "data_out" | "timeline_out" | "text_out";
  created_by: {
    id: string;
    email: string;
    profile: {
      display_name: string;
      profile_picture: string;
      color: string;
    };
    is_default_system_user: boolean;
  };
  prompt_id: string;
}

export type PresetListResponse = PaginatedAPIResponse<Preset>;

export type AIConversationsResponse = PaginatedAPIResponse<AIConversation>;
export type AIConversationChatsResponse =
  PaginatedAPIResponse<AIConversationChat>;

export type SendUserMessageInput = {
  conversation_id: string;
  message: string;
  mentions: string[];
  timeRange: [number, number] | null;
  current_timeline?: CompositionOutput;
};

export type GetGuidelineAndTitleForPromptResponse =
  GuidelineAndTitleForPromptResponse;
