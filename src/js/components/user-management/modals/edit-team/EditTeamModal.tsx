import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';

import { TeamIcon } from '@/components/user-management/TeamIcon';

import { useUpdateTeamDetails } from '@/api-integration/mutations/user-management';

import { EditWorkspaceTeamSchema } from '@/schemas/user-management';

interface EditTeamModalProps {
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
  onOpenChange: () => void;
  title: string;
  teamTitle: string;
  teamId: string;
  workspaceId: string;
  color?: string;
}

const EditTeamModal = ({
  isOpen,
  onOpenChange,
  title,
  teamId,
  teamTitle,
  workspaceId,
  color
}: EditTeamModalProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof EditWorkspaceTeamSchema>>({
    resolver: zodResolver(EditWorkspaceTeamSchema),
    defaultValues: {
      name: teamTitle || ''
    }
  });
  const { mutateAsync: updateTeamDetails, isPending } = useUpdateTeamDetails(
    teamId,
    workspaceId,
    () => {}
  );

  const setTeamName = async (data: z.infer<typeof EditWorkspaceTeamSchema>) => {
    try {
      await updateTeamDetails({
        title: data.name
      });
      onOpenChange();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reset({
      name: teamTitle
    });
  }, [teamTitle, reset]);

  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      onOpenChange={() => {
        onOpenChange();
      }}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit((data) => {
            setTeamName(data);
          })}
        >
          <ModalHeader>
            <span className="text-lg font-medium text-default-900">{title}</span>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-[48px,1fr] gap-2">
              <TeamIcon size="2xl" name={teamTitle} color={color} colorVariant="subtle" />
              <Input
                autoFocus
                placeholder="Enter your team name"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                {...register('name')}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              size="md"
              color="secondary"
              radius="sm"
              className="w-full"
              onPress={onOpenChange}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              size="md"
              color="primary"
              radius="sm"
              className="w-full"
              isLoading={isPending}
              type="submit"
              aria-label="Save"
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditTeamModal;
