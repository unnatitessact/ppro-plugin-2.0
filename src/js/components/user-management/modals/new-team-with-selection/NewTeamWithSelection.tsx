import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { useRoles } from '@/context/roles';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn, ScrollShadow } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { User } from '@/components/ui/User';
import UserFallback from '@/components/ui/UserFallback';

import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';
import { TeamIcon } from '@/components/user-management/TeamIcon';

import { useCreateTeamAndAddUsers } from '@/api-integration/mutations/user-management';
import { User as UserRole } from '@/api-integration/types/auth';

import { PROFILE_COMBINATIONS } from '@/data/colors';

interface NewTeamWithSelection {
  isOpen: boolean;
  onClose: () => void;
  users: UserRole[];
  setTriggerRemoveSelection: (value: boolean) => void;
}

const TeamInputSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Team name is required.' })
    .max(30, { message: 'Team name must be less than 30 characters.' })
});

interface ExtendedUserWithRoles extends UserRole {
  roles: string[];
}

const NewTeamWithSelection = ({
  isOpen,
  onClose,
  users,
  setTriggerRemoveSelection
}: NewTeamWithSelection) => {
  const { workspaceId } = useParams();

  const [usersWithRoles, setUsersWithRoles] = useState<ExtendedUserWithRoles[]>([]);

  const { mutateAsync: createTeamAndAddUsers, isPending } = useCreateTeamAndAddUsers(() => {
    onClose();
    setUsersWithRoles([]);
    setTriggerRemoveSelection(true);
  });

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid }
  } = useForm<z.infer<typeof TeamInputSchema>>({
    resolver: zodResolver(TeamInputSchema),
    mode: 'all',
    defaultValues: {
      name: ''
    }
  });

  const teamName = watch('name');

  const handleCreateTeam = async (data: z.infer<typeof TeamInputSchema>) => {
    try {
      await createTeamAndAddUsers({
        team_title: data.name,
        workspace_id: workspaceId as string,
        users: usersWithRoles.map((user) => ({
          user_id: user.id,
          role_ids: user.roles
        }))
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUsersWithRoles(users.map((user) => ({ ...user, roles: [] })));
    } else {
      setUsersWithRoles([]);
      reset();
    }
  }, [users, isOpen, reset]);

  const isAllUsersAssignedRole = useMemo(
    () => usersWithRoles.every((user) => user.roles.length > 0),
    [usersWithRoles]
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        <form
          onSubmit={handleSubmit((data) => {
            handleCreateTeam(data);
          })}
        >
          <ModalHeader>
            <p className="text-2xl font-bold">New team with selection</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="aspect-square">
                  <TeamIcon name={teamName?.charAt(0)} size={'2xl'} colorVariant="subtle" />
                </div>
                <Input
                  // value={teamName}
                  // onValueChange={setTeamName}
                  placeholder="Team name"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  {...register('name')}
                />
              </div>
              <div className="flex max-h-80 min-h-72 flex-col gap-4">
                <ScrollShadow>
                  {usersWithRoles.map((user) => (
                    <UserProfileWithRole
                      key={user.id}
                      user={user}
                      setUsersWithRoles={setUsersWithRoles}
                    />
                  ))}
                </ScrollShadow>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              className="w-full"
              isLoading={isPending || isSubmitting}
              isDisabled={!isDirty || !isValid || !isAllUsersAssignedRole}
              aria-label="Create team with users"
            >
              Create team with users
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const UserProfileWithRole = ({
  user,
  setUsersWithRoles
}: {
  user: ExtendedUserWithRoles;
  setUsersWithRoles: Dispatch<SetStateAction<ExtendedUserWithRoles[]>>;
}) => {
  const { roles: teamRoles } = useRoles('team');
  const selectedRoles = useMemo(() => new Set(user.roles), [user.roles]);
  const setSelectedRoles = useCallback(
    (newRoles: Set<string>) => {
      setUsersWithRoles((prevUsersWithRoles: ExtendedUserWithRoles[]) =>
        prevUsersWithRoles.map((prevUser: ExtendedUserWithRoles) => {
          if (user.id === prevUser.id) {
            return {
              ...prevUser,
              roles: Array.from(newRoles)
            };
          }
          return prevUser;
        })
      );
    },
    [setUsersWithRoles, user.id]
  );

  return (
    <div key={user.id} className="flex items-center justify-between p-3">
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
      <RoleChipDropdownWithDefault
        roles={teamRoles ?? []}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
      />
    </div>
  );
};

export default NewTeamWithSelection;
