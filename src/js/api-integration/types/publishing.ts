// import { SocialMedia } from '@/stores/publishing-store';

// Add more social media types to this enum as we add more integrations
export type SocialMediaPlatform = 'google';

export interface YoutubeAccountInfo {
  id: string;
  user_id: string;
  user_name: string;
  user_picture: string;
  user_email: string;
  created_on: Date;
  is_active: boolean;
  reauth_required: boolean;
  channel_info: {
    channel_description: string;
    channel_id: string;
    channel_name: string;
    channel_published_on: Date;
    channel_url: string;
    channel_thumbnails: {
      height: number;
      url: string;
      width: number;
    };
  }[];
}

export interface SocialMediaAccount {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  channelName?: string;
  channelId?: string;
  channelDescription?: string;
  mediaType: string;
  createdOn: Date;
}

export interface YoutubePost {
  title: string;
  description: string;
  privacy: string;
  // unknown
  post_type: string;
  page_id: string;
  image_file: File | null;

  video: string;
  is_video_made_for_kids: boolean;
  age_restriction: string | null;
  // paid_promotion: boolean | null;
  // altered_content: boolean | null;
  // automatic_chapters: boolean | null;
  // featured_places: boolean | null;
  // automatic_concepts: boolean | null;
  tags: string;
  video_language: string | null;
  recording_date: Date | null;
  licence: string | null;
  // shorts_remixing: boolean | null;
  category: string | null;
  // comment_moderation: string | null;
  // comment_sort_by: string | null;
  // first_comment: string | null;
  embeddable: boolean;
  notify_subscribers: boolean;
  channel_id: string | null;
  account_id: string;
  start_time?: number;
  end_time?: number;
  is_shorts?: boolean;
  loc_x?: number;
}

export interface VideoShareDetails {
  id: string;
  post_type: string;
  social_media_type: string;
  post_id: string | null;
  post_link: string | null;
  eta: number;
  process_status: string;
  metadata: {
    tags: string;
    title: string;
    privacy: string;
    end_time: string;
    file_url: string;
    start_time: string;
    description: string;
    snippetCropX: number | null;
    video_language: string;
    thumbnailXOffset: number;
  };
  // response_data: {};
  publish_time: Date | null;
  error: string | null;
  created_by: string;
}

export type GetYoutubeAccountsResponse = YoutubeAccountInfo[];
