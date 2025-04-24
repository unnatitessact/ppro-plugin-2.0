import { User as UserMeta } from '@/api-integration/types/auth';

export interface User {
  id: string;
  email: string;
  last_active?: string;
  profile: {
    first_name: string;
    last_name?: string;
    display_name: string;
    profile_picture?: string;
    color?: string;
  };
  organization: {
    id: string;
    feature_flags: FeatureFlagStatusObj[];
  };
}

export interface FeatureFlagStatusObj {
  title: string;
  value: boolean;
  updated_at: string;
  updated_by: UserMeta;
  id: string;
  description: string;
}

export interface FeatureFlagUpdateDefaultStatus {
  default_enabled: boolean;
}

export interface FeatureFlagUpdateStatus {
  organization: string;
  flags: {
    [key: string]: boolean;
  };
}
export interface Organization {
  id: string;
  title: string;
}

export interface CreateFeatureFlagPayload {
  name: string;
  description: string;
  default_enabled: boolean;
}

export type FeatureFlagResponse = FeatureFlagStatusObj[];
export type FeatureFlagUpdateDefaultStatusPayload = FeatureFlagUpdateDefaultStatus;
export type FeatureFlagUpdateStatusPayload = FeatureFlagUpdateStatus;

export type OrganizationListResponse = Organization[];

