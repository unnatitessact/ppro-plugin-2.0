import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { useRoles } from '@/context/roles';
import { useDebouncedValue } from '@mantine/hooks';
import { cn, ScrollShadow, User } from '@nextui-org/react';

import { Check, CrossLarge } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import UserFallback from '@/components/ui/UserFallback';

import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';
import UsersSelectionList from '@/components/user-management/UsersSelectionList';

import { useOrganization } from '@/hooks/useOrganization';

import { useAddUsersToWorkspace } from '@/api-integration/mutations/user-management';
import {
  useOrganizationUsersQuery,
  useWorkspaceDetailsQuery,
  useWorkspaceUsersQuery
} from '@/api-integration/queries/user-management';
import { UserWithRoles } from '@/api-integration/types/user-management';

import { PROFILE_COMBINATIONS } from '@/data/colors';
import { debounceTime } from '@/data/inputs';

interface AddToWorkspaceProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const AddToWorkspaceModal = ({ isOpen, onOpenChange }: AddToWorkspaceProps) => {
  const [selectedUsers, setSelectedUsers] = useState<UserWithRoles[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);
  const [openUsersList, setOpenUsersList] = useState(false);

  const params = useParams();

  const organization = useOrganization();

  const { roles: workspaceRoles } = useRoles('workspace');

  const {
    data: organizationUsers,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingUsers,
    isFetchingNextPage
  } = useOrganizationUsersQuery(organization?.id, debouncedSearchQuery);

  const {
    data: workspaceUsers,
    isSuccess,
    hasNextPage: workspaceHasNextPage,
    fetchNextPage: fetchNextWorkspacePage
  } = useWorkspaceUsersQuery(params.workspaceId as string, '', isOpen);

  const workspaceUsersIds = workspaceUsers?.pages
    .flatMap((user) => user.results)
    .map((user) => user.id);

  useEffect(() => {
    // Keep fetching to get all pages of workspace users
    if (workspaceHasNextPage) {
      fetchNextWorkspacePage();
    }
  }, [workspaceHasNextPage, fetchNextWorkspacePage]);

  const users =
    organizationUsers?.pages
      .flatMap((user) => user.results)
      .filter((user) => !workspaceUsersIds?.includes(user.id)) ?? [];

  const { data: workspace } = useWorkspaceDetailsQuery(params.workspaceId as string, isOpen);

  const { mutateAsync: addUsersToWorkspaceAndTeam, isPending } = useAddUsersToWorkspace(
    params.workspaceId as string,
    () => {
      onOpenChange();
      setSelectedUsers([]);
      setSearchQuery('');
    }
  );

  const handleAddToWorkspace = async () => {
    try {
      await addUsersToWorkspaceAndTeam(
        selectedUsers?.map((user) => ({
          user_id: user.id,
          workspace: params.workspaceId as string,
          role_ids: user?.roles.map((role) => role.id)
        }))
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const isAllUsersAssignedRole = useMemo(
    () => selectedUsers?.every((user) => user.roles.length > 0),
    [selectedUsers]
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        setSelectedUsers([]);
        setSearchQuery('');
      }}
      size="md"
    >
      <ModalContent>
        <ModalHeader>
          <p className="text-2xl font-bold">Add to {workspace?.title}</p>
        </ModalHeader>
        <ModalBody>
          <div className="min-h-96">
            <div className="relative flex flex-col gap-4">
              <UsersSelectionList
                defaultRole={workspaceRoles.find((role) => role.is_default) ?? workspaceRoles[0]}
                setSelectedUsers={setSelectedUsers}
                users={users}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                fetchNextPage={fetchNextPage}
                openUsersList={openUsersList}
                setOpenUsersList={setOpenUsersList}
                isSuccess={isSuccess}
                selectedUsers={selectedUsers}
                isLoadingUsers={isLoadingUsers}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                placeholder="Search for users in organization"
              />
              <ScrollShadow>
                <div
                  className={cn({
                    'absolute top-12 -z-10 hidden w-full': openUsersList,
                    'z-0': !openUsersList
                  })}
                >
                  {selectedUsers.map((user) => (
                    <UserWithProfile
                      key={user.id}
                      user={user}
                      setSelectedUsers={setSelectedUsers}
                    />
                  ))}
                </div>
              </ScrollShadow>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="w-full"
            size="lg"
            color="primary"
            isLoading={isPending}
            onPress={() => handleAddToWorkspace()}
            startContent={<Check size={24} />}
            isDisabled={!isAllUsersAssignedRole || selectedUsers.length === 0}
            aria-label="Add to workspace"
          >
            Add to Workspace team
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const UserWithProfile = ({
  user,
  setSelectedUsers
}: {
  user: UserWithRoles;
  setSelectedUsers: Dispatch<SetStateAction<UserWithRoles[]>>;
}) => {
  const handleRemoveUser = () => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
    );
  };

  const { roles: workspaceRoles } = useRoles('workspace');

  const selectedRoles = useMemo(() => new Set(user.roles.map((role) => role.id)), [user.roles]);

  const setSelectedRoles = useCallback(
    (roles: Set<string>) =>
      setSelectedUsers((prevUsers) => {
        return prevUsers.map((prevUser) => {
          if (prevUser.id === user.id) {
            return {
              ...prevUser,
              roles: Array.from(roles).map((roleId) =>
                workspaceRoles.find((workspaceRole) => workspaceRole.id === roleId)
              )
            } as UserWithRoles;
          }
          return prevUser;
        });
      }),
    [setSelectedUsers, user.id, workspaceRoles]
  );

  return (
    <div className="flex items-center justify-between  p-2" key={user.id}>
      <User
        name={user.profile?.display_name || 'No display name'}
        description={user.email}
        avatarProps={{
          src: user.profile?.profile_picture || undefined,
          alt: user.profile?.display_name,
          size: 'md',
          showFallback: true,
          classNames: {
            base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
          },
          fallback: (
            <UserFallback
              firstName={user.profile.first_name}
              lastName={user.profile?.last_name}
              displayName={user.profile?.display_name}
              email={user.email}
              color={user.profile?.color}
            />
          )
        }}
        classNames={{
          name: 'cursor-pointer'
        }}
      />
      <div className="flex items-center gap-2">
        <RoleChipDropdownWithDefault
          roles={workspaceRoles ?? []}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
        />
        <Button
          isIconOnly
          onPress={() => handleRemoveUser()}
          variant="light"
          aria-label="Remove user"
        >
          <CrossLarge size={18} />
        </Button>
      </div>
    </div>
  );
};

export default AddToWorkspaceModal;
