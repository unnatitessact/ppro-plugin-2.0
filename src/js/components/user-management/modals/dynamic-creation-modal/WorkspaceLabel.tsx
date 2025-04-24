import { useCallback, useState } from 'react';

import { useRoles } from '@/context/roles';
import { cn } from '@nextui-org/react';

import { Checkbox } from '@/components/ui/Checkbox';
import { User } from '@/components/ui/User';

import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';

import { WorkspaceWithTeamsListItem } from '@/types/user-management';

interface WorkspaceLabelProps {
  workspace: WorkspaceWithTeamsListItem;
  isOpened: boolean;
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
  setWorkspaceRole: (workspaceId: string, roleIds: string[]) => void;
  hideActions?: boolean;
}
export function WorkspaceLabel({
  workspace,
  isOpened,
  isSelected,
  setIsSelected,
  setWorkspaceRole,
  hideActions
}: WorkspaceLabelProps) {
  const { roles: workspaceRoles } = useRoles('workspace');
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set([]));
  const updateRoles = useCallback(
    (newRoles: Set<string>) => {
      setSelectedRoles(newRoles);
      setWorkspaceRole(workspace.id, Array.from(newRoles));
    },
    [workspace.id, setWorkspaceRole]
  );
  return (
    <div
      className={cn(
        'flex w-full flex-1 items-center gap-3 rounded-xl bg-default-100 px-3 py-1 transition duration-1000',
        isOpened && 'rounded-b-none'
      )}
    >
      {hideActions ? null : (
        <Checkbox
          isSelected={isSelected}
          onValueChange={setIsSelected}
          radius="sm"
          height={20}
          width={20}
        />
      )}

      <User
        name={workspace.title}
        description={formatTeamCountDescription(workspace.teams.length)}
        classNames={{
          base: 'py-2 px-3 w-unit-5xl justify-start',
          name: 'text-base font-medium text-default-900',
          description: 'text-default-500 text-sm font-normal'
        }}
        avatarProps={{
          src: workspace.display_image,
          size: 'md',
          radius: 'sm'
        }}
      />
      {isSelected && !hideActions && (
        <RoleChipDropdownWithDefault
          roles={workspaceRoles ?? []}
          selectedRoles={selectedRoles}
          setSelectedRoles={updateRoles}
        />
      )}
    </div>
  );
}

const formatTeamCountDescription = (teamCount: number) =>
  teamCount === 0 ? 'No teams' : `${teamCount} team${teamCount > 1 ? 's' : ''}`;
