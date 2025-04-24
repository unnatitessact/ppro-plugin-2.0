import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';

import { ArrowLeft, CirclePlus, FloppyDisk1, MagnifyingGlass, Ufo } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { ScrollShadow } from '@/components/ui/ScrollShadow';

import PermissionCheckboxGrouped from '@/components/user-management/PermissionCheckboxGrouped';

import { useOrganization } from '@/hooks/useOrganization';

import { useCreateNewRole, useUpdateRole } from '@/api-integration/mutations/user-management';
import { usePermissionsQuery } from '@/api-integration/queries/user-management';
import { Role } from '@/api-integration/types/user-management';

import { debounceTime } from '@/data/inputs';

interface CreateRolePermissionsProps {
  step: number;
  roleName: string;
  setStep: (step: number) => void;
  type: 'organization' | 'workspace' | 'team';
  description: string;
  setIsOpen: (isOpen: boolean) => void;
  editRoleDetails?: Role;
}

export interface GroupWithPermissions {
  id: string;
  permissions: string[];
}

const CreateRolePermissions = ({
  step,
  roleName,
  setStep,
  type,
  description,
  setIsOpen,
  editRoleDetails
}: CreateRolePermissionsProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<GroupWithPermissions[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);

  const organization = useOrganization();

  const { data: permissions, isLoading } = usePermissionsQuery(type, debouncedSearchQuery);

  const { mutate, isPending } = useCreateNewRole();
  const { mutate: updateRole, isPending: isUpdateRolePending } = useUpdateRole(
    editRoleDetails?.id as string
  );

  const toggleSelectedGroup = (id: string) => {
    setSelectedPermissions((prev) => {
      const newSelectedGroups = [...prev];
      const index = newSelectedGroups.findIndex((group) => group.id === id);
      if (index === -1) {
        newSelectedGroups.push({
          id,
          permissions: permissions
            ?.find((group) => group.id === id)
            ?.permissions.map((permission) => permission.codename) as string[]
        });
      } else {
        newSelectedGroups.splice(index, 1);
      }
      return newSelectedGroups;
    });
  };

  const toggleSelectedPermission = (groupId: string, codenames: string[]) => {
    setSelectedPermissions((prev) => {
      const groupIndex = prev.findIndex((group) => group.id === groupId);
      const group = permissions?.find((group) => group.id === groupId);
      if (groupIndex === -1) {
        return [
          ...prev,
          {
            id: group?.id as string,
            permissions: codenames
          }
        ];
      }
      const newChecked = [...prev];
      if (codenames.length === 0) {
        newChecked.splice(groupIndex, 1);
        return newChecked;
      }
      newChecked[groupIndex].permissions = codenames;
      return newChecked;
    });
  };

  useEffect(() => {
    if (editRoleDetails) {
      const selectedPermissions = editRoleDetails?.permissions?.map((group) => {
        return {
          id: group.id,
          permissions: group?.permissions?.map((permission) => permission.codename)
        };
      });
      setSelectedPermissions(selectedPermissions as GroupWithPermissions[]);
    }
  }, [editRoleDetails]);

  return (
    <>
      <ModalHeader>
        <div className="flex items-start gap-2 p-0">
          <Button isIconOnly size="md" variant="light" onPress={() => setStep(1)} aria-label="Back">
            <ArrowLeft size={24} />
          </Button>
          <span className="text-2xl font-bold text-default-900">
            Select permissions for <br />
            {`"${roleName}"`}
          </span>
        </div>
      </ModalHeader>
      <ModalBody className="relative flex flex-auto p-0">
        <Input
          type="text"
          placeholder="Search for permissions"
          size="md"
          startContent={<MagnifyingGlass size={20} />}
          classNames={{
            base: 'max-w-xs'
          }}
          value={searchQuery}
          onValueChange={(val) => setSearchQuery(val)}
        />
        <div className="flex h-[300px] w-full flex-col gap-7">
          <ScrollShadow className="h-full w-full overflow-x-hidden">
            {!isLoading &&
              permissions?.map((group, i) => {
                return (
                  <PermissionCheckboxGrouped
                    key={i}
                    selectedPermissions={selectedPermissions}
                    toggleSelectedGroup={toggleSelectedGroup}
                    toggleSelectedPermission={toggleSelectedPermission}
                    heading={group?.title}
                    permissionList={group?.permissions}
                    groupId={group.id}
                  />
                );
              })}
            {!isLoading && searchQuery && permissions?.length === 0 && (
              <div className="flex h-[300px] flex-col items-center justify-center gap-2">
                <Ufo size={32} />
                <span className="text-base font-medium text-default-900">
                  No results matching {`"${searchQuery}"`}
                </span>
              </div>
            )}
            {!isLoading && searchQuery === '' && permissions?.length === 0 && (
              <div className="flex h-[300px] flex-col items-center justify-center gap-2">
                <Ufo size={32} />
                <span className="text-base font-medium text-default-900">
                  No permissions available
                </span>
              </div>
            )}
          </ScrollShadow>
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-between gap-2 p-0">
        <span className="text-sm font-medium text-default-900">Step {step} of 2</span>
        {editRoleDetails ? (
          <Button
            color="primary"
            size="lg"
            aria-label="Save changes"
            startContent={<FloppyDisk1 size={20} />}
            isLoading={isUpdateRolePending}
            onPress={() => {
              updateRole({
                title: roleName,
                permissions: selectedPermissions?.flatMap((obj) => obj.permissions),
                organization: organization?.id as string,
                role_type: type,
                description: description
              });
              setStep(1);
              setIsOpen(false);
            }}
          >
            Save changes
          </Button>
        ) : (
          <Button
            color="primary"
            size="lg"
            startContent={<CirclePlus size={20} />}
            isLoading={isPending}
            aria-label="Create role"
            onPress={() => {
              mutate({
                title: roleName,
                permissions: selectedPermissions?.flatMap((obj) => obj.permissions),
                organization: organization?.id as string,
                role_type: type,
                description: description
              });
              setStep(1);
              setIsOpen(false);
            }}
          >
            Create Role
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export default CreateRolePermissions;
