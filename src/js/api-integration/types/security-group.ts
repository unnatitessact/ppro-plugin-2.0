// import { PermissionPayload } from "@/components/security-groups/files-folders/PermissionDropdown";

import { User } from "../types/auth";
import { ResourceType, VersionStackItem } from "./library/library";
import { Workspace } from "../types/user-management";

import { PaginatedAPIResponse } from "../types/api";

export type PermissionPayload =
  | "can_view_asset"
  | "can_edit_asset"
  | "can_delete_asset";

export interface SecurityGroup {
  id: string;
  title: string;
  description: string;
  default: boolean;
  users: User[];
}

interface UserWithWorkspaces extends User {
  workspaces: Workspace[];
}

export interface CreateSecurityGroupPayload {
  title: string;
  description: string;
  organization: string;
  users: string[];
}

interface EditSecurityGroupPayload {
  title?: string;
  description?: string;
  users?: string[];
  choice?: "ADD_USER" | "RM_USER";
}

export interface UserSecurityGroup {
  id: string;
  title: string;
  description: string;
}

export interface LibraryTreeBase {
  id: string;
  name: string;
  resourcetype: ResourceType;
  children_count: number;
  permissions: PermissionPayload[];
}
export interface LibraryTreeVersionStack extends LibraryTreeBase {
  resourcetype: "VersionStack";
  versions: VersionStackItem[];
}

export interface LibraryTreeAsset extends LibraryTreeBase {
  resourcetype: Exclude<ResourceType, "VersionStack">;
}

export interface SecurityGroupAccessToAsset {
  default: boolean;
  description: string;
  id: string;
  title: string;
  permissions: PermissionPayload[];
  users_count: number;
}

export interface SecurityGroupAccessToAssetUser {
  id: string;
  email: string;
  last_active?: string;
  is_active?: boolean;
  profile: {
    first_name: string;
    last_name?: string;
    display_name: string;
    profile_picture?: string;
    color?: string;
  };
  permissions: PermissionPayload[];
}

export type LibraryTree = LibraryTreeAsset | LibraryTreeVersionStack;

// UserSecurityGroup[]

export type GetSecurityGroupsResponse = PaginatedAPIResponse<SecurityGroup>;
export type GetSecurityGroupResponse = SecurityGroup;
export type GetSecurityGroupUsersResponse =
  PaginatedAPIResponse<UserWithWorkspaces>;
export type GetUserSecurityGroupsListResponse = UserSecurityGroup[];

export type GetSecurityGroupAccessToAssetResponse =
  PaginatedAPIResponse<SecurityGroupAccessToAsset>;
export type GetSecurityGroupAccessToAssetUserResponse =
  PaginatedAPIResponse<SecurityGroupAccessToAssetUser>;
export type GetLibraryTreeResponse = PaginatedAPIResponse<LibraryTree>;

// mutations
export type CreateSecurityGroupMutation = CreateSecurityGroupPayload;
export type EditSecurityGroupMutation = EditSecurityGroupPayload;
export type AssignPermissionsToSecurityGroupMutation = {
  assets: string[];
  permissions: string[];
  is_recursive: boolean;
};

export type AssignPersonToAssetMutation = {
  asset: string;
  permissions: string[];
  organization: string;
};
