import { useCallback, useMemo, useState } from 'react';

import { useRoles } from '@/context/roles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@mantine/hooks';
import { cn } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { CrossLarge } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { ScrollShadow } from '@/components/ui/ScrollShadow';
import { ToastFallback, ToastProcess, ToastSuccess } from '@/components/ui/ToastContent';
import { User } from '@/components/ui/User';
import UserFallback from '@/components/ui/UserFallback';

import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';
import { RoleSelectionDropdown } from '@/components/user-management/RoleSelectionDropdown';
import { TeamIcon } from '@/components/user-management/TeamIcon';
import UsersSelectionList from '@/components/user-management/UsersSelectionList';

import { useCreateTeamAndAddUsers } from '@/api-integration/mutations/user-management';
import { useWorkspaceUsersQuery } from '@/api-integration/queries/user-management';
import { Role, UserWithRoles } from '@/api-integration/types/user-management';

import { PROFILE_COMBINATIONS } from '@/data/colors';
import { debounceTime } from '@/data/inputs';

// import { Listbox, ListboxItem } from '@/components/ui/Listbox';

const TeamInputSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Team name is required.' })
    .max(30, { message: 'Team name must be less than 30 characters.' })
});

interface NewTeamModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  workspaceId: string;
  showRoleInWords?: boolean;
  // users: UserWithRoles[];
}

const NewTeamModal = ({
  isOpen,
  onOpenChange,
  workspaceId,
  showRoleInWords
}: NewTeamModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<UserWithRoles[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);
  const [openUsersList, setOpenUsersList] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting }
  } = useForm<z.infer<typeof TeamInputSchema>>({
    resolver: zodResolver(TeamInputSchema),
    mode: 'all',
    defaultValues: {
      name: ''
    }
  });
  const teamName = watch('name');

  const {
    data: workspaceUsers,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingUsers,
    isFetchingNextPage
  } = useWorkspaceUsersQuery(workspaceId, debouncedSearchQuery, isOpen);
  const users = workspaceUsers?.pages.flatMap((user) => user.results) || [];

  const { mutateAsync: createTeamAndAddUsers, isPending: isPendingCreateTeamAndAddUsers } =
    useCreateTeamAndAddUsers();

  const { roles } = useRoles('team');

  const setRole = (userId: string, roleIds: string[]) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.map((user) => {
        if (user.id === userId) {
          const userRoles = roles?.filter((role) => roleIds.includes(role.id)) as Role[];
          return { ...user, roles: userRoles };
        }
        return user;
      })
    );
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers?.filter((user) => user.id !== userId)
    );
  };

  const handleCreateTeamAndAddUsers = async (data: z.infer<typeof TeamInputSchema>) => {
    try {
      // Check if all selected users have atleast one role

      const isRolesSelected = selectedUsers.reduce(
        (acc, curr) => acc && curr.roles.length > 0,
        true
      );
      if (!isRolesSelected) {
        toast(`Select a role`, {
          description: `Every user should have atleast one role.`
        });
        return;
      }

      toast.promise(
        createTeamAndAddUsers(
          {
            team_title: data.name,
            users: selectedUsers.map((user) => ({
              user_id: user.id,
              role_ids: user?.roles.map((role) => role.id)
            })),
            workspace_id: workspaceId
          },
          {
            onSuccess: () => {
              onOpenChange();
              reset();
              setSelectedUsers([]);
              setSearchQuery('');
            }
          }
        ),
        {
          loading: <ToastProcess title={`Creating team ${data?.name}`} />,
          success: <ToastSuccess title={`Created team ${data.name} `} />,
          error: <ToastFallback title="Failed to create team and add users" />
        }
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const clearState = () => {
    onOpenChange();
    reset();
    setSelectedUsers([]);
    setSearchQuery('');
  };

  const isAllUsersAssignedRole = useMemo(
    () => selectedUsers.every((user) => user.roles.length > 0),
    [selectedUsers]
  );

  const defaultRole = useMemo(() => roles.find((role) => role.is_default) ?? roles[0], [roles]);

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={clearState}>
      <ModalContent className="p-8">
        <form
          onSubmit={handleSubmit((data) => {
            handleCreateTeamAndAddUsers(data);
          })}
        >
          <ModalHeader>
            <p className="text-2xl font-bold">Create Team</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="aspect-square">
                  <TeamIcon size="2xl" name={teamName} rounded="2xl" colorVariant="subtle" />
                </div>
                <Input
                  placeholder="Team name"
                  {...register('name')}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              </div>
              <div className="flex max-h-80 min-h-80 flex-col gap-4">
                <UsersSelectionList
                  defaultRole={defaultRole}
                  setSelectedUsers={setSelectedUsers}
                  users={users}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isSuccess={isSuccess}
                  fetchNextPage={fetchNextPage}
                  openUsersList={openUsersList}
                  setOpenUsersList={setOpenUsersList}
                  selectedUsers={selectedUsers}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  isLoadingUsers={isLoadingUsers}
                  placeholder="Search for users in workspace"
                />

                <ScrollShadow>
                  <div
                    className={cn({
                      'absolute top-12 -z-10 hidden w-full': openUsersList,
                      'z-0': !openUsersList
                    })}
                  >
                    {selectedUsers.map((user) => (
                      <UserListItem
                        key={user.id}
                        user={user}
                        setRole={setRole}
                        removeUser={handleRemoveUser}
                        showRoleInWords={showRoleInWords}
                      />
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isPendingCreateTeamAndAddUsers}
              isDisabled={!isDirty || !isValid || isSubmitting || !isAllUsersAssignedRole}
              color="primary"
              className="w-full"
              aria-label="Create team"
            >
              Create team with users
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewTeamModal;

interface UserListItemProps {
  user: UserWithRoles;
  setRole: (userId: string, roleIds: string[]) => void;
  removeUser: (userId: string) => void;
  showRoleInWords?: boolean;
}

const UserListItem = ({ user, setRole, removeUser, showRoleInWords }: UserListItemProps) => {
  const { roles: teamRoles } = useRoles('team');

  const selectedRoles = useMemo(() => new Set(user.roles.map((role) => role.id)), [user.roles]);

  const setSelectedRoles = useCallback(
    (newRoles: Set<string>) => {
      setRole(user.id, Array.from(newRoles));
    },
    [user.id, setRole]
  );

  return (
    <div className="flex items-center justify-between p-3">
      <User
        name={user.profile.display_name || 'No display name'}
        description={user.email}
        classNames={{
          name: 'cursor-pointer'
        }}
        avatarProps={{
          src: user.profile.profile_picture as string,
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
      />
      <div className="flex items-center gap-6">
        {showRoleInWords ? (
          <RoleSelectionDropdown
            variant="countInWords"
            roles={teamRoles ?? []}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />
        ) : (
          <RoleChipDropdownWithDefault
            roles={teamRoles ?? []}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
          />
        )}
        <Button
          variant="light"
          isIconOnly
          onPress={() => removeUser(user.id)}
          aria-label="Remove user"
        >
          <CrossLarge size={20} />
        </Button>
      </div>
    </div>
  );
};
