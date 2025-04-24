import { User } from "../types/auth";
import { AIEditResponse } from "../types/editor";
import { AssetDetails } from "../types/library";
import { AssetDetails as ProjectAssetDetails } from "../types/projects";
import { ExternalUser, Marker, Tag } from "../types/review";

import { PaginatedAPIResponse } from "../../types/api";

export type ShareAPIType = "asset" | "task";
export type ShareAPIOptions = {
  share_type: ShareAPIType;
};

// General Share types
export interface ShareDetail {
  id: string;
  short_url: string;
  is_public: boolean; // will be false for private shares
  expires_at: string | null;
  is_password_protected: boolean;
  email?: string; // only exists for private shares
  allow_download: boolean;
  allow_comments: boolean;
  allow_status_change: boolean;
  total_views: number;
  total_downloads: number;
  unique_visitors: number;
  last_accessed: string | null;
  password_hash: string | null; // only exists for public shares
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
  created_on: string;
  modified_on: string;
}

export interface ViewShareResponse {
  id: string;
  // token: string;
  short_url: string;
  is_public: boolean;
  expires_at: string | null;
  is_password_protected: boolean;
  allow_download: boolean;
  allow_comments: boolean;
  allow_status_change: boolean;
  total_views: number;
  total_downloads: number;
  unique_visitors: number;
  last_accessed: string | null;
  shared_items: (AssetDetails | ProjectAssetDetails)[];
  created_on: string;
  modified_on: string;
  email: string;
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
}

export interface ViewProtectedPublicShareResponse extends ViewShareResponse {
  token: string;
}

export interface ShareComment {
  id: string;
  file: string;
  text?: string;
  plain_text?: string;
  tags?: Tag[];
  mentions?: User[];
  markers?: Marker[];

  attachments?: string[];
  replies?: ShareReply[];
  in_time?: number | null;
  out_time?: number | null;
  marked_as_done?: boolean;
  created_by: User;
  created_on: string;
  is_ai_comment: boolean;
  is_external: boolean;
  external_user: ExternalUser | null;
  ai_editor: {
    timeline_data: AIEditResponse;
  } | null;
}

export interface ShareReply {
  id: string;
  text?: string;
  plain_text?: string;
  mentions?: User[];
  tags?: Tag[];
  created_by: User;
  created_on: string;
  is_ai_reply: boolean;
  ai_editor: {
    timeline_data: AIEditResponse;
  } | null;
  is_external: boolean;
  external_user: ExternalUser | null;
}

export interface ShareCreationPayload {
  /** IDs of the assets to be shared */
  items: string[];

  /** ID of the workspace containing the assets */
  workspace: string;

  /** Optional expiration date for the share (ISO string format). Applies to both public and private shares */
  expires_at?: string | null;

  /** Whether downloads are allowed. Applies to both public and private shares */
  allow_download?: boolean;

  /** Whether comments are allowed. Applies to both public and private shares */
  allow_comments?: boolean;

  /**
   * Whether this is a public share.
   * Set to false for private share, otherwise can be omitted
   */
  is_public?: boolean;

  /** Optional password protection. Only valid for public shares */
  password?: string | null;

  /** List of email addresses to invite. Only valid for private shares */
  invited_emails?: string[];
}

export interface TaskShareCreationPayload {
  task: string;
  email: string;
  project: string;
  allow_download?: boolean;
  allow_comment?: boolean;
  allow_status_change?: boolean;
  allow_upload?: boolean;
}

export interface ShareUpdatePayload {
  password?: string | null;
  allow_download?: boolean;
  allow_comments?: boolean;
  expires_at?: string | null;
  remove_password?: boolean;
}

export interface ShareReviewCreateCommentPayload {
  item_id: string;
  text: string;
  plain_text: string;
  tags: string[];
  in_time?: number;
  out_time?: number;
  markers?: Marker[];
  marked_as_done?: boolean;
  is_external: boolean;
  external_user: ExternalUser;
  token?: string;
}

export interface UpdateShareReviewCommentPayload {
  text?: string;
  plain_text?: string;
  tags?: string[];
  in_time?: number;
  out_time?: number;
}

// Queries

export type AssetShareDetailsList = ShareDetail[];
export type ShareCommentResponse = PaginatedAPIResponse<ShareComment>;

export interface ShareCommentCreator {
  display_name: string;
  email: string;
  profile_picture?: string;
  color?: string;
}
