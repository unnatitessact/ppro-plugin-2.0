import type { User } from "../types/auth";
import type { PaginatedAPIResponse } from "../types/api";
import type {
  RoleType,
  WorkspaceWithTeams,
  WorkspaceWithTeamsListItem,
} from "../../types/user-management";

import { COMBINATIONS_KEY } from "../../constants/data-colors/data-colors";

type Profile = {
  first_name: string;
  last_name: string;
  display_name: string;
  profile_picture?: string;
  color?: string;
};

interface NewUser {
  user_data: {
    email: string;
    password?: string;
    profile?: Profile;
  };
  role_ids: string[];
}

interface OrphanUser {
  id: string;
  profile: Profile;
  email: string;
  organization: {
    id: string;
    title: string;
    created_on: string;
    modified_on: string;
    created_by: string;
    modified_by: string;
  };
}

export interface Workspace {
  id: string;
  title: string;
  display_image: string;
  team_count: number;
  color: string;
}

export interface Team {
  id: string;
  title: string;
  color: string;
}

export interface NewWorkspace {
  title: string;
  display_image: File | null;
  organization: string;
}

export interface NewTeam {
  title: string;
  workspace: string;
}

export interface Role {
  color: COMBINATIONS_KEY;
  id: string;
  title: string;
  description: string;
  user_count: number;
  permissions: PermissionGroup[];
  is_default: boolean;
}

export interface DisplayRole {
  id: string;
  title: string;
  description: string;
  user_count: number;
}

export interface Permission {
  id: string;
  name: string;
  codename: string;
}

export interface PermissionGroup {
  id: string;
  title: string;
  permissions: Permission[];
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface UserWithWorkspaceAndRole extends User {
  workspaces: Workspace[];
  roles: Role[];
  last_active?: string;
  teams: Team[];
}

export interface UserWithTeamsAndRole extends User {
  teams: Team[];
  roles: Role[];
  last_active?: string;
}

interface NewRole {
  title: string;
  description: string;
  role_type: RoleType;
  organization: string;
  permissions: string[];
}

export interface UpdateWorkspaceDetails {
  title: string;
  display_image?: File | null;
}

export interface WorkspaceAssignment {
  workspace_id: string;
  role_ids: string[];
}

export interface TeamAssignment {
  team_id: string;
  role_ids: string[];
}

export interface WorkspaceTeamsAssignment {
  user_id: string;
  workspaces: WorkspaceAssignment[];
  teams: TeamAssignment[];
}

export interface UserRole {
  id: string;
  title: string;
}
export interface UserWorkspace {
  id: string;
  title: string;
  display_image?: string;
  color: string;
  roles: UserRole[];
}

export interface UserTeam {
  id: string;
  title: string;
  color: string;
  roles: UserRole[];
}

export interface AddUserToWorkspace {
  user_id: string;
  role_ids: string[];
  workspace: string;
}

export interface AddUserToTeam {
  user_id: string;
  role_ids: string[];
  team_id: string;
}

export interface UpdateTeamDetails {
  title: string;
}

export interface BulkUploadUsers {
  csv_file: File;
}

export interface BulkUsers {
  email: string;
  profile: {
    first_name: string;
    last_name: string;
    display_name: string;
  };
  role_ids: string[];
  user_exists: boolean;
}

export interface BulkAddUsers {
  user_data: BulkUsers[];
}

interface UserProfile {
  first_name: string;
  last_name: string;
  display_name?: string;
  profile_picture?: File | null;
  color?: string;
}

interface RoleAssignment {
  role_ids: string[];
  user_id: string;
}

interface RemoveUserFromWorkspace {
  workspaceId: string;
  users: string[];
}

interface RemoveUserFromTeam {
  teamId: string;
  users: string[];
}

interface CreateTeamAndAddUsers {
  team_title: string;
  workspace_id: string;
  users: {
    user_id: string;
    role_ids: string[];
  }[];
}

interface CreateWorkspaceAndAddUsers {
  workspaceTitle: string;
  displayImage: File | null;
  users: {
    user_id: string;
    role_ids: string[];
  }[];
}

export interface UserWithLastActive extends UserWithRoles {
  last_active?: string;
}

export interface CSVParsedUsersValidUser extends Omit<BulkUsers, "role_ids"> {}

export interface CSVParsedUsersInvalidUser
  extends Omit<BulkUsers, "user_exists" | "role_ids"> {
  error: string;
  error_code: "DUPLICATE_ENTRY" | "INVALID_ENTRY";
}

export interface CSVParsedUsers {
  valid_users: CSVParsedUsersValidUser[];
  invalid_users: CSVParsedUsersInvalidUser[];
  // invalid_users: Omit<BulkUsers, 'user_exists'>[] & { error: string }[];
}

// GET Requests
export type GetRolesResponse = Role[];
export type GetWorkspacesResponse = Workspace[];
export type GetTeamsOfWorkspaceResponse = Team[];
export type GetWorkspacesWithTeamsResponse = WorkspaceWithTeamsListItem[];
export type GetOrganizationUsersResponse =
  PaginatedAPIResponse<UserWithWorkspaceAndRole>;
export type GetWorkspaceUsersResponse =
  PaginatedAPIResponse<UserWithWorkspaceAndRole>;
export type GetTeamUsersResponse = PaginatedAPIResponse<UserWithTeamsAndRole>;
export type GetWorkspaceDetailsResponse = Workspace;
export type GetTeamDetailsResponse = Team;
export type GetPermissionsResponse = PermissionGroup[];
export type GetOrphanUsersResponse = OrphanUser[];
export type GetUserWorkspacesListResponse = UserWorkspace[];
export type GetUserTeamListResponse = UserTeam[];
export type GetUserPermissionsResponse = string[];
export type ParseCSVResponse = CSVParsedUsers;

// POST Requests
export type CreateWorkspacesAndTeamsRequest = WorkspaceWithTeams[];
export type CreateNewUserForOrganizationRequest = NewUser;
export type CreateNewRoleRequest = NewRole;
export type CreateWorkspaceRequest = NewWorkspace;
export type CreateTeamRequest = NewTeam;
export type AddUserToWorkspaceTeamsRequest = WorkspaceTeamsAssignment;
export type CreateNewUserForOrganizationResponse = User;
export type CreateTeamAndAddUsersRequest = CreateTeamAndAddUsers;
export type CreateWorkspaceAndAddUsersRequest = CreateWorkspaceAndAddUsers;
export type AddUsersToWorkspaceRequest = AddUserToWorkspace[];
export type AddUsersToTeamRequest = AddUserToTeam[];
export type CreateTeamResponse = Team & { workspace: string };
export type BulkUploadUsersRequest = BulkUploadUsers;
export type BulkAddUsersRequest = BulkAddUsers;
export type UpdateOrganizationUserRequest = RoleAssignment[];
export type RemoveUserFromWorkspaceRequest = RemoveUserFromWorkspace;
export type RemoveUserFromTeamRequest = RemoveUserFromTeam;
export type SelectedTeamUsersResponse = { user_ids: string[] };

// PUT Requests
export type UpdateWorkspaceDetailsRequest = UpdateWorkspaceDetails;
export type UpdateTeamDetailsRequest = UpdateTeamDetails;
export type UpdateUserProfileRequest = UserProfile;

// PATCH requests
export type UpdateRoleAsDefaultRequest = { id: string };
