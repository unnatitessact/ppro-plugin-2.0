import type { User } from "./auth";
import type { PaginatedAPIResponse } from "./api";

import { Shape, ShapeType } from "../../types/shape";

import { AIEditResponse } from "./editor";

export interface ReviewCommentCreator {
  display_name: string;
  email: string;
  profile_picture?: string;
  color: string;
}

export interface ExternalUser {
  display_name: string;
  email: string;
  user_type: "external" | "guest" | "task_share";
}

export interface Tag {
  id: string;
  name: string;
}

export interface Marker {
  shape: ShapeType;
  color: string;
  data: Shape;
}

export interface Reply {
  id: string;
  text: string;
  mentions?: User[];
  tags?: Tag[];
  created_by: User;
  created_on: string;
  is_ai_reply: boolean;
  is_external: boolean;
  external_user: ExternalUser | null;
  ai_editor: {
    timeline_data: AIEditResponse;
  } | null;
}

export interface ReviewComment {
  id: string;
  file?: string;
  text?: string;
  plain_text?: string;
  tags?: Tag[];
  mentions?: User[];
  markers?: Marker[];
  attachments?: string[];
  replies?: Reply[];
  in_time?: number;
  out_time?: number;
  marked_as_done?: boolean;
  created_by: User | null;
  created_on: string;
  is_read?: boolean;
  is_ai_comment: boolean;
  ai_editor: {
    timeline_data: AIEditResponse;
  } | null;
  is_external: boolean;
  external_user: ExternalUser | null;
}

export interface ReviewCommentState {
  text: string;
  tagIds: string[];
  mentionIds: string[];
  markers: Shape;
}

export interface Count {
  count: number;
}

export interface FileReviewFilter {
  mentioned_users: (User & Count)[];
  tags: (Tag & Count)[];
  commented_users: (User & Count)[];
}

export interface AddReviewComment {
  file_id: string;
  text: string;
  plain_text?: string;
  mentions?: string[];
  tags?: string[];
  markers?: Marker[];
  attachments?: string[];
  in_time?: number;
  out_time?: number;
  marked_as_done?: boolean;
  is_read?: boolean;
  is_ai_comment?: boolean;
}

export interface UpdateReviewCommentRequest {
  text?: string;
  plain_text?: string;
  mentions?: string[];
  tags?: string[];
  markers?: Marker[];
  attachments?: string[];
  in_time?: number;
  out_time?: number;
  marked_as_done?: boolean;
  is_read?: boolean;
  is_ai_comment?: boolean;
}

export interface AddReviewCommentReply {
  text: string;
  plain_text: string;
  mentions?: string[];
  tags?: string[];
  is_ai_reply?: boolean;
}

export interface AddReviewCommentReplyResponse {
  id: string;
  mentions?: string[];
  text: string;
  tags?: string[];
  is_ai_reply?: boolean;
}

export type CommentDownloadFileType =
  | "edl"
  | "csv"
  | "resolve"
  | "premier"
  | "pdf";
export type CommentDownloadFileExtension =
  | "csv"
  | "txt"
  | "edl"
  | "xml"
  | "pdf";

// GET Request
export type GetReviewCommentResponse = PaginatedAPIResponse<ReviewComment>;
export type GetFileReviewFiltersResponse = FileReviewFilter;
export type ReviewCommentSort =
  | "created_on"
  | "-created_on"
  | "in_time"
  | "created_by__profile__display_name";

export type GetHashtagsResponse = Tag[];

// POST Request
export type CreateAddReviewCommentRequest = AddReviewComment;
export type CreateAddReviewCommentResponse = ReviewComment;
export type CreateMarkReviewCommentAsDoneRequest = string[];
export type CreateAddReviewCommentReplyRequest = AddReviewCommentReply;
export type CreateAddReviewCommentReplyResponse = AddReviewCommentReplyResponse;
