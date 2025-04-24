import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRoles } from '@/context/roles';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn, Image, ScrollShadow, useDisclosure } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Images2, Pencil } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';
import { User } from '@/components/ui/User';
import UserFallback from '@/components/ui/UserFallback';

import ImageCropperModal from '@/components/ImageCropperModal';
import RoleChipDropdownWithDefault from '@/components/user-management/RoleChipDropdownWithDefault';

import { useCreateWorkspaceAndAddUsers } from '@/api-integration/mutations/user-management';
import { User as UserRole } from '@/api-integration/types/auth';

import { PROFILE_COMBINATIONS } from '@/data/colors';

const WorkspaceInputSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Workspace name is required.' })
    .max(30, { message: 'Workspace name must be less than 30 characters.' })
});

interface NewWorkspaceWithSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserRole[];
  setTriggerRemoveSelection: (value: boolean) => void;
}

interface ExtendedUserWithRoles extends UserRole {
  roles: string[];
}

const NewWorkspaceWithSelection = ({
  isOpen,
  onClose,
  users,
  setTriggerRemoveSelection
}: NewWorkspaceWithSelectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [usersWithRoles, setUsersWithRoles] = useState<ExtendedUserWithRoles[]>([]);
  const [uncroppedWorkspaceImage, setUncroppedWorkspaceImage] = useState<string | null>(null);
  const [workspaceImage, setWorkspaceImage] = useState<File | null>(null);
  const [workspaceName, setWorkspaceName] = useState('');

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting }
  } = useForm<z.infer<typeof WorkspaceInputSchema>>({
    resolver: zodResolver(WorkspaceInputSchema),
    mode: 'all',
    defaultValues: {
      name: ''
    }
  });

  const { mutateAsync: createWorkspaceAndAddUsers, isPending: isCreatingWorkspacePending } =
    useCreateWorkspaceAndAddUsers(() => {
      setTriggerRemoveSelection(true);
      onClose();
      onImageCropperClose();
      setUncroppedWorkspaceImage(null);
      setWorkspaceImage(null);
      setWorkspaceName('');
      setUsersWithRoles([]);
    });

  const setSelectedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUncroppedWorkspaceImage(URL.createObjectURL(e.target.files[0]));
      onImageCropperOpenChange();
      e.target.value = '';
    }
  };

  const {
    isOpen: isImageCropperOpen,
    onOpenChange: onImageCropperOpenChange,
    onClose: onImageCropperClose
  } = useDisclosure();

  const setRole = (userId: string, roleIds: string[]) => {
    setUsersWithRoles((prevSelectedUsers) =>
      prevSelectedUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, roles: roleIds };
        }
        return user;
      })
    );
  };

  const handleCreateWorkspaceAndAddUsers = async (data: z.infer<typeof WorkspaceInputSchema>) => {
    try {
      await createWorkspaceAndAddUsers({
        workspaceTitle: data.name,
        displayImage: workspaceImage ? workspaceImage : null,
        users: usersWithRoles.map((user) => ({
          user_id: user.id,
          role_ids: user.roles
        }))
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const workspaceImageUrl = useMemo(
    () => (workspaceImage ? URL.createObjectURL(workspaceImage) : ''),
    [workspaceImage]
  );

  useEffect(() => {
    if (isOpen) {
      setUsersWithRoles(users.map((user) => ({ ...user, roles: [] })));
    } else {
      reset();
      onImageCropperClose();
      setUncroppedWorkspaceImage(null);
      setWorkspaceImage(null);
      setWorkspaceName('');
      setUsersWithRoles([]);
    }
  }, [users, isOpen, onImageCropperClose, reset]);

  const isAllUsersAssignedRole = useMemo(
    () => usersWithRoles.every((user) => user.roles.length > 0),
    [usersWithRoles]
  );

  return (
    <Modal
      isOpen={isOpen}
      size="md"
      onOpenChange={() => {
        onClose();
        onImageCropperClose();
        setUncroppedWorkspaceImage(null);
        setWorkspaceImage(null);
        setWorkspaceName('');
        setUsersWithRoles([]);
      }}
    >
      <ModalContent>
        <form
          onSubmit={handleSubmit((data) => {
            handleCreateWorkspaceAndAddUsers(data);
          })}
        >
          <ModalHeader>
            <p className="text-2xl font-bold">New workspace with selection</p>
          </ModalHeader>
          <ModalBody>
            <ScrollShadow>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={setSelectedFiles}
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
                      onClick={() => {
                        inputRef.current?.click();
                      }}
                      aria-label="Upload workspace image"
                    >
                      <Images2 size={20} />
                    </Button>
                  )}

                  <Input
                    value={workspaceName}
                    onValueChange={setWorkspaceName}
                    placeholder="Workspace name"
                    {...register('name')}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                </div>
                <div className="flex max-h-80 min-h-72 flex-col gap-4">
                  {usersWithRoles.map((user) => (
                    <UserProfileWithRole key={user.id} user={user} setRole={setRole} />
                  ))}
                </div>
              </div>
              <ImageCropperModal
                isOpen={isImageCropperOpen}
                onClose={onImageCropperClose}
                title="Crop your workspace image"
                inputImage={uncroppedWorkspaceImage || ''}
                setCroppedImage={(image) => {
                  setWorkspaceImage(image ? new File([image], 'image.jpg') : null);
                  onImageCropperClose();
                }}
                shape="rect"
              />
            </ScrollShadow>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isCreatingWorkspacePending || isSubmitting}
              isDisabled={!isValid || !isDirty || !isAllUsersAssignedRole}
              color="primary"
              className="w-full"
              aria-label="Create workspace with users"
            >
              Create workspace with users
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const UserProfileWithRole = ({
  user,
  setRole
}: {
  user: ExtendedUserWithRoles;
  setRole: (userId: string, roleIds: string[]) => void;
}) => {
  const { roles: workspaceRoles } = useRoles('workspace');
  const selectedRoles = useMemo(() => new Set(user.roles), [user.roles]);
  const setSelectedRoles = useCallback(
    (newRoles: Set<string>) => {
      setRole(user.id, Array.from(newRoles));
    },
    [setRole, user.id]
  );

  return (
    <div key={user.id} className="flex items-center justify-between">
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
        roles={workspaceRoles ?? []}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
      />
    </div>
  );
};

export default NewWorkspaceWithSelection;
