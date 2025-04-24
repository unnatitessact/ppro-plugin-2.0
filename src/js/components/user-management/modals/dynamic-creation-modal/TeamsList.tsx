import { useMemo } from 'react';

import { AnimatePresence } from 'framer-motion';

import { Listbox, ListboxItem } from '@/components/ui/Listbox';

import { Team, Workspace } from '@/api-integration/types/user-management';

import { WorkspaceWithTeamsListItem } from '@/types/user-management';

import { WorkspaceWithTeamsSelection } from './DynamicCreationModal';
import { TeamLabel } from './TeamLabel';

interface TeamsListProps {
  workspace: WorkspaceWithTeamsListItem;
  selectedWorkspacesWithTeams: WorkspaceWithTeamsSelection[];
  handleToggleTeam: (teamId: Team['id'], workspaceId: Workspace['id'], value: boolean) => void;
  setTeamRole: (teamId: Team['id'], roleIds: string[]) => void;
}

export const TeamsList = ({
  workspace,
  selectedWorkspacesWithTeams,
  handleToggleTeam,
  setTeamRole
}: TeamsListProps) => {
  const { teams } = workspace;
  // const { data: teams } = useTeamsOfWorkspaceQuery(workspace.id);

  const teamsWithSelected = useMemo(
    () =>
      teams?.map((team) => ({
        ...team,
        isSelected:
          selectedWorkspacesWithTeams
            ?.find((selectedWorkspace) => selectedWorkspace.id === workspace.id)
            ?.teams.some((selectedTeam) => selectedTeam.teamId === team.id) ?? false
      })) ?? [],
    [teams, selectedWorkspacesWithTeams, workspace.id]
  );

  return (
    <AnimatePresence>
      <Listbox aria-label="Dynamic actions" hideEmptyContent className="gap-0 bg-transparent p-0">
        {teamsWithSelected.map((team) => (
          <ListboxItem
            variant="light"
            key={team.id}
            aria-label={team.title}
            textValue={team.title}
            className="rounded-none border border-t-0 border-ds-table-row-border last:rounded-b-xl"
          >
            <TeamLabel
              key={team?.id}
              teamName={team.title}
              isSelected={team.isSelected}
              color={team.color}
              setSelected={(value) => handleToggleTeam(team?.id, workspace?.id, value)}
              setTeamRole={(roleIds) => setTeamRole(team?.id, roleIds)}
            />
          </ListboxItem>
        ))}
      </Listbox>
    </AnimatePresence>
  );
};
