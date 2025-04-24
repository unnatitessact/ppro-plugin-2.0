'use client';

import type { UserSecurityGroup as UserSecurityGroupType } from '@/api-integration/types/security-groups';
import type { Key } from 'react';

import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DotGrid1X3Horizontal, TrashCan } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@/components/ui/Table';

import { useOrganization } from '@/hooks/useOrganization';

import { useEditSecurityGroup } from '@/api-integration/mutations/security-group';
import { getUserSecurityGroupListQueryKey } from '@/api-integration/queries/security-groups';

const columns = [
  { key: 'title', label: 'NAME' },
  { key: 'description', label: 'DESCRIPTION' },
  { key: 'menu', label: '' }
];

interface UserSecurityGroupProps {
  userId: string;
  securityGroupList: UserSecurityGroupType[];
  hasAccess: boolean;
}

export const UserSecurityGroup = ({
  userId,
  securityGroupList,
  hasAccess
}: UserSecurityGroupProps) => {
  // Render custom cells as per the key
  const renderCell = useCallback(
    (group: UserSecurityGroupType, columnKey: Key) => {
      const cellValue = group[columnKey as keyof UserSecurityGroupType];

      switch (columnKey) {
        case 'title':
          return <span className="cursor-pointer font-medium">{cellValue}</span>;
        case 'description':
          return (
            <span className="font-regular cursor-pointer text-sm text-default-500">
              {cellValue}
            </span>
          );
        case 'menu':
          return hasAccess ? <Menu groupId={group.id} userId={userId} /> : null;
        default:
          return cellValue;
      }
    },
    [userId, hasAccess]
  );

  return (
    <Table
      aria-label={`Security groups`}
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
      <TableBody items={securityGroupList || []}>
        {(group) => (
          <TableRow key={group?.id}>
            {(columnKey) => <TableCell>{renderCell(group, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const Menu = ({ groupId, userId }: { groupId: string; userId: string }) => {
  const organization = useOrganization();
  const queryClient = useQueryClient();
  const { mutate } = useEditSecurityGroup(groupId, organization?.id);
  const handleRemoveUser = useCallback(() => {
    mutate(
      {
        users: [userId],
        choice: 'RM_USER'
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getUserSecurityGroupListQueryKey(userId, organization?.id)
          });
        }
      }
    );
  }, [queryClient, organization?.id, mutate, userId]);
  return (
    <div className="flex justify-end">
      <Dropdown placement="bottom-end" offset={12}>
        <DropdownTrigger>
          <Button isIconOnly size="md" variant="light" aria-label="Security group menu">
            <DotGrid1X3Horizontal size={20} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="All users actions">
          <DropdownItem
            key="remove-security-group"
            startContent={<TrashCan size={20} />}
            color="danger"
            className="text-danger"
            onPress={handleRemoveUser}
          >
            Remove user from security group
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
