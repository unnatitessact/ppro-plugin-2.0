'use client';

import type { UserTeam as UserTeamType } from '@/api-integration/types/user-management';
import type { Key } from 'react';

import { useCallback, useMemo } from 'react';

import { useRoles } from '@/context/roles';
import { useQueryClient } from '@tanstack/react-query';

import { DotGrid1X3Horizontal, TrashCan } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@/components/ui/Table';

import RoleChipDropdown from '@/components/user-management/RoleChipDropdown';
import { TeamIcon } from '@/components/user-management/TeamIcon';

import { useOrganization } from '@/hooks/useOrganization';

import {
  useAddUsersToTeams,
  useRemoveUserFromTeam
} from '@/api-integration/mutations/user-management';
import { userTeamListQueryKey } from '@/api-integration/queries/user-management';

const columns = [
  { key: 'title', label: 'NAME' },
  { key: 'role', label: 'ROLE' },
  { key: 'menu', label: '' }
];

interface UserTeamProps {
  teamList: UserTeamType[];
  userId: string;
  hasAccess: boolean;
}

export const UserTeam = ({ teamList, userId, hasAccess }: UserTeamProps) => {
  const { mutate: removeUserFromTeam } = useRemoveUserFromTeam(userId);

  // Render custom cells as per the key
  const renderCell = useCallback(
    (team: UserTeamType, columnKey: Key) => {
      const cellValue = team[columnKey as keyof UserTeamType];

      switch (columnKey) {
        case 'title':
          return <TeamLabel team={team} />;
        case 'role':
          return (
            <UserTeamRoleSelect
              teamId={team.id}
              userTeamRoles={team.roles.map((team) => team.id)}
              userId={userId}
              isDisabled={!hasAccess}
            />
          );
        case 'menu':
          return hasAccess ? (
            <Menu removeUserFromTeam={removeUserFromTeam} team={team} userId={userId} />
          ) : null;
        default:
          return <>{cellValue}</>;
      }
    },
    [removeUserFromTeam, userId, hasAccess]
  );

  return (
    <Table
      aria-label={`Team details`}
      classNames={{
        tr: 'last:border-none border-b border-default-200',
        thead:
          '[&>tr]:first:border-none [&>tr>th]:first:rounded-none [&>tr>th]:last:rounded-none [&>tr]:first:rounded-none rounded-none',
        th: 'bg-default-200'
      }}
      className="overflow-hidden rounded-lg border border-default-200"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={teamList || []}>
        {(team) => (
          <TableRow key={team?.id}>
            {(columnKey) => <TableCell>{renderCell(team, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const TeamLabel = ({ team }: { team: UserTeamType }) => (
  <Chip
    title={team.title}
    aria-label={team.title}
    startContent={
      <TeamIcon size="sm" name={team?.title} color={team.color} colorVariant="subtle" />
    }
    size="lg"
    classNames={{
      base: 'bg-ds-table-pills-bg rounded-xl py-2 pl-2 pr-3 flex items-center gap-2 h-auto',
      content: 'p-0 text-sm font-medium line-clamp-1 max-w-32 whitespace-normal'
    }}
  >
    {team.title}
  </Chip>
);

interface MenuProps {
  removeUserFromTeam: (args: { teamId: string; users: string[] }) => void;
  team: UserTeamType;
  userId: string;
}

const Menu = ({ removeUserFromTeam, team, userId }: MenuProps) => (
  <div className="flex justify-end">
    <Dropdown placement="bottom-end" offset={12}>
      <DropdownTrigger>
        <Button isIconOnly size="md" variant="light" aria-label="Team menu">
          <DotGrid1X3Horizontal size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="All users actions">
        <DropdownItem
          key="remove-team"
          startContent={<TrashCan size={20} />}
          color="danger"
          className="text-danger"
          onPress={() =>
            removeUserFromTeam({
              teamId: team.id,
              users: [userId]
            })
          }
        >
          Remove team
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
);

interface UserTeamRoleSelectProps {
  teamId: string;
  userTeamRoles: string[];
  userId: string;
  isDisabled?: boolean;
}

const UserTeamRoleSelect = ({
  teamId,
  userTeamRoles,
  userId,
  isDisabled
}: UserTeamRoleSelectProps) => {
  const { mutate } = useAddUsersToTeams();
  const queryClient = useQueryClient();
  const organization = useOrganization();
  const { roles: teamRoles } = useRoles('team');
  const selectedRoles = useMemo(() => new Set(userTeamRoles), [userTeamRoles]);
  const setSelectedRoles = useCallback(
    (newRoles: Set<string>) => {
      mutate(
        [
          {
            role_ids: Array.from(newRoles),
            user_id: userId,
            team_id: teamId
          }
        ],
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: userTeamListQueryKey(userId, organization.id)
            });
          }
        }
      );
    },
    [mutate, userId, teamId, queryClient, organization.id]
  );

  return (
    <RoleChipDropdown
      roles={teamRoles ?? []}
      selectedRoles={selectedRoles}
      setSelectedRoles={setSelectedRoles}
      readOnly={isDisabled}
    />
  );
};
