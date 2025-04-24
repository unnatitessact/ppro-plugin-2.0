export type RoleType = 'organization' | 'workspace' | 'team';

export interface Team {
  id: string;
  name: string;
  color?: string;
  user_count?: number;
}

export interface Workspace {
  id: string;
  image: File | null;
  name: string;
}

export interface WorkspaceWithTeams {
  id: string;
  color?: string;
  image: File | null;
  name: string;
  teams: Team[];
}
export interface WorkspaceWithTeamsListItem
  extends Omit<WorkspaceWithTeams, 'image' | 'name' | 'teams'> {
  title: string;
  display_image: string;
  teams: (Omit<Team, 'name'> & { title: string })[];
}
