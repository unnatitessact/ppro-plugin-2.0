'use client';

import type { Key } from 'react';

import { useCallback, useMemo } from 'react';

import { useRoles } from '@/context/roles';
import { useQueryClient } from '@tanstack/react-query';

import { DotGrid1X3Horizontal, TrashCan } from '@tessact/icons';

import { Avatar } from '@/components/ui/Avatar';
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

import { useOrganization } from '@/hooks/useOrganization';

// import { MultiRoleSelect } from '@/components/user-management/MultiRoleSelect';

import {
  useAddUsersToWorkspace,
  useRemoveUserFromWorkspace
} from '@/api-integration/mutations/user-management';
import { userWorkspaceListQueryKey } from '@/api-integration/queries/user-management';
import { UserWorkspace as UserWorkspaceType } from '@/api-integration/types/user-management';

const columns = [
  { key: 'title', label: 'WORKSPACE' },
  { key: 'role', label: 'WORKSPACE ROLE' },
  { key: 'menu', label: '' }
];

interface UserWorkspaceProps {
  userId: string;
  workspaceList: UserWorkspaceType[];
  hasAccess: boolean;
}

export const UserWorkspace = ({ userId, workspaceList, hasAccess }: UserWorkspaceProps) => {
  const { mutate: removeUserFromWorkspace } = useRemoveUserFromWorkspace(userId);

  // Render custom cells as per the key
  const renderCell = useCallback(
    (workspace: UserWorkspaceType, columnKey: Key) => {
      const cellValue = workspace[columnKey as keyof UserWorkspaceType];

      switch (columnKey) {
        case 'title':
          return <WorkspaceLabel workspace={workspace} />;
        case 'role':
          return (
            <UserWorkspaceRoleSelect
              userWorkspaceRoles={workspace.roles.map((role) => role.id)}
              workspaceId={workspace.id}
              userId={userId}
              isDisabled={!hasAccess}
            />
          );
        // return <span className="cursor-pointer font-medium">Role</span>;
        case 'menu':
          return hasAccess ? (
            <Menu
              removeUserFromWorkspace={removeUserFromWorkspace}
              workspace={workspace}
              userId={userId}
            />
          ) : null;
        default:
          return <>{cellValue}</>;
      }
    },
    [userId, removeUserFromWorkspace, hasAccess]
  );

  return (
    <Table
      aria-label={`Workspace details`}
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
      <TableBody items={workspaceList || []}>
        {(workspace) => (
          <TableRow key={workspace?.id}>
            {(columnKey) => <TableCell>{renderCell(workspace, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const WorkspaceLabel = ({ workspace }: { workspace: UserWorkspaceType }) => (
  <Chip
    startContent={
      <Avatar
        className="h-5 w-5 rounded-md"
        name={workspace?.title?.charAt(0)}
        src={workspace?.display_image ?? ''}
      />
    }
    size="lg"
    classNames={{
      base: 'bg-ds-table-pills-bg rounded-xl py-2 pl-2 pr-3 flex items-center gap-2 h-auto',
      content: 'flex p-0 text-sm font-medium'
    }}
  >
    {workspace.title}
  </Chip>
);

interface MenuProps {
  removeUserFromWorkspace: (args: { workspaceId: string; users: string[] }) => void;
  workspace: UserWorkspaceType;
  userId: string;
}

const Menu = ({ removeUserFromWorkspace, workspace, userId }: MenuProps) => (
  <div className="flex justify-end">
    <Dropdown placement="bottom-end" offset={12}>
      <DropdownTrigger>
        <Button isIconOnly size="md" variant="light">
          <DotGrid1X3Horizontal size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="All users actions"
        // onAction={(key) => onDropdownAction(key)}
      >
        <DropdownItem
          onPress={() =>
            removeUserFromWorkspace({
              workspaceId: workspace.id,
              users: [userId]
            })
          }
          key="remove-workspace"
          startContent={<TrashCan size={20} />}
          color="danger"
          className="text-danger"
        >
          Remove workspace
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
);

interface UserWorkspaceRoleSelectProps {
  workspaceId: string;
  userWorkspaceRoles: string[];
  userId: string;
  isDisabled?: boolean;
}

const UserWorkspaceRoleSelect = ({
  workspaceId,
  userWorkspaceRoles,
  userId,
  isDisabled
}: UserWorkspaceRoleSelectProps) => {
  const { mutate } = useAddUsersToWorkspace();
  const queryClient = useQueryClient();
  const organization = useOrganization();

  const { roles: workspaceRoles } = useRoles('workspace');
  const selectedRoles = useMemo(() => new Set(userWorkspaceRoles), [userWorkspaceRoles]);
  const setSelectedRoles = useCallback(
    (newRoles: Set<string>) => {
      mutate(
        [
          {
            role_ids: Array.from(newRoles),
            user_id: userId,
            workspace: workspaceId
          }
        ],
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: userWorkspaceListQueryKey(userId, organization?.id)
            });
          }
        }
      );
    },
    [mutate, organization?.id, queryClient, userId, workspaceId]
  );

  return (
    <RoleChipDropdown
      roles={workspaceRoles ?? []}
      selectedRoles={selectedRoles}
      setSelectedRoles={setSelectedRoles}
      readOnly={isDisabled}
    />
  );
};
