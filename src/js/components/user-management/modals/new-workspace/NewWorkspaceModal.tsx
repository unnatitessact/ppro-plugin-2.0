import { useCallback, useMemo, useRef, useState } from 'react';

import { useRoles } from '@/context/roles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedValue } from '@mantine/hooks';
import { cn, Image, ScrollShadow, useDisclosure } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { CrossLarge, Images2, Pencil } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { User } from '@/components/ui/User';
import UserFallback from '@/components/ui/UserFallback';

import ImageCropperModal from '@/components/ImageCropperModal';
import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';
import UsersSelectionList from '@/components/user-management/UsersSelectionList';

import { useOrganization } from '@/hooks/useOrganization';

import { useCreateWorkspaceAndAddUsers } from '@/api-integration/mutations/user-management';
import { useOrganizationUsersQuery } from '@/api-integration/queries/user-management';
import { Role, UserWithRoles } from '@/api-integration/types/user-management';

import { PROFILE_COMBINATIONS } from '@/data/colors';
import { debounceTime } from '@/data/inputs';

// import { Listbox, ListboxItem } from '@/components/ui/Listbox';

const WorkspaceInputSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Workspace name is required.' })
    .max(30, { message: 'Workspace name must be less than 30 characters.' })
});

interface NewWorkspaceModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  // users: UserWithRoles[];
}

const NewWorkspaceModal = ({ isOpen, onOpenChange }: NewWorkspaceModalProps) => {
  const organization = useOrganization();

  const inputRef = useRef<HTMLInputElement>(null);

  // const [usersWithRoles, setUsersWithRoles] = useState<UserWithRoles[]>([]);
  const [uncroppedWorkspaceImage, setUncroppedWorkspaceImage] = useState<string | null>(null);
  // const [workspaceImage, setWorkspaceImage] = useState<File | null>(null);
  const [workspaceImage, setWorkspaceImage] = useState<File | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserWithRoles[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting }
  } = useForm<z.infer<typeof WorkspaceInputSchema>>({
    resolver: zodResolver(WorkspaceInputSchema),
    mode: 'all',
    defaultValues: {
      name: ''
    }
  });

  const {
    data: organizationUsers,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    isLoading: isLoadingUsers,
    hasNextPage
  } = useOrganizationUsersQuery(organization?.id, debouncedSearchQuery);
  const users = organizationUsers?.pages.flatMap((user) => user.results) || [];

  // Initialize state for image cropper modal
  const {
    isOpen: isImageCropperOpen,
    onOpenChange: onImageCropperOpenChange,
    onClose: onImageCropperClose
  } = useDisclosure();

  // Function to handle selected files for image cropper
  const handleSelectedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUncroppedWorkspaceImage(URL.createObjectURL(e.target.files[0]));
      onImageCropperOpenChange();
      e.target.value = '';
    }
  };

  const { mutateAsync: createWorkspaceAndAddUsers, isPending: isCreatingWorkspacePending } =
    useCreateWorkspaceAndAddUsers(() => {
      onOpenChange();
      onImageCropperClose();
      setUncroppedWorkspaceImage(null);
    });

  const { roles } = useRoles('workspace');

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

  const handleCreateWorkspaceAndAddUsers = async (data: z.infer<typeof WorkspaceInputSchema>) => {
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

      await createWorkspaceAndAddUsers({
        workspaceTitle: data.name,
        displayImage: workspaceImage ?? null,
        users: selectedUsers.map((user) => ({
          user_id: user.id,
          role_ids: user?.roles.map((role) => role.id)
        }))
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const clearState = () => {
    onOpenChange();
    reset();
    onImageCropperClose();
    setSelectedUsers([]);
    setSearchQuery('');
    setUncroppedWorkspaceImage(null);
  };

  const isAllUsersAssignedRole = useMemo(
    () => selectedUsers.every((user) => user.roles.length > 0),
    [selectedUsers]
  );

  const [openUsersList, setOpenUsersList] = useState(false);

  const workspaceImageUrl = useMemo(
    () => (workspaceImage ? URL.createObjectURL(workspaceImage) : ''),
    [workspaceImage]
  );

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={clearState}>
      <ModalContent className="p-8">
        <form
          onSubmit={handleSubmit((data) => {
            handleCreateWorkspaceAndAddUsers(data);
          })}
        >
          <ModalHeader>
            <p className="text-2xl font-bold">Create Workspace</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleSelectedFiles}
                />

                {uncroppedWorkspaceImage ? (
                  <div className="group relative aspect-square h-12 w-12 cursor-pointer rounded-2xl">
                    <Image src={workspaceImageUrl} alt="Workspace image" />
                    <div
                      className="group/item absolute left-0 top-0 z-10 h-full w-full items-center justify-center duration-200 transition-background hover:bg-[rgba(0,0,0,0.5)] group-hover:flex"
                      onClick={() => inputRef.current?.click()}
                    >
                      <Pencil size={20} className="invisible group-hover/item:visible" />
                    </div>
                  </div>
                ) : (
                  <Button
                    isIconOnly
                    className="flex aspect-square h-12 w-12 min-w-12 items-center justify-center rounded-2xl bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover"
                    onPress={() => {
                      inputRef.current?.click();
                    }}
                    aria-label="Upload workspace image"
                  >
                    <Images2 size={20} />
                  </Button>
                )}

                <Input
                  placeholder="Workspace name"
                  {...register('name')}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              </div>
              <div className="relative flex max-h-80 min-h-80 flex-col gap-4">
                <UsersSelectionList
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
                      <UserListItem
                        key={user.id}
                        user={user}
                        setRole={setRole}
                        removeUser={handleRemoveUser}
                      />
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            </div>
            <ImageCropperModal
              isOpen={isImageCropperOpen}
              onClose={onImageCropperClose}
              title="Crop your workspace image"
              inputImage={uncroppedWorkspaceImage || ''}
              setCroppedImage={(image) => {
                setWorkspaceImage(image ? new File([image], 'image.jpg') : null);
                // workspaceImage.current = image ? new File([image], 'image.jpg') : null;
                onImageCropperClose();
              }}
              shape="rect"
            />
            {/* </ScrollShadow> */}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isCreatingWorkspacePending}
              isDisabled={!isDirty || !isValid || isSubmitting || !isAllUsersAssignedRole}
              color="primary"
              className="w-full"
              aria-label="Create workspace"
            >
              Create workspace with users
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewWorkspaceModal;

interface UserListItemProps {
  user: UserWithRoles;
  setRole: (userId: string, roleIds: string[]) => void;
  removeUser: (userId: string) => void;
}

const UserListItem = ({ user, setRole, removeUser }: UserListItemProps) => {
  const { roles: workspaceRoles } = useRoles('workspace');
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
      <div className="flex gap-6">
        <RoleChipDropdownWithDefault
          roles={workspaceRoles ?? []}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
        />
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
