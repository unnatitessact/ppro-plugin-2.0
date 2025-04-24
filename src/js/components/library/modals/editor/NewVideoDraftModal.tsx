'use client';

import { useParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { VideoTrimFilled } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';

import { useCreateVideoDraft } from '@/api-integration/mutations/library';

import { CreateVideoDraftSchema } from '@/schemas/library/video-draft';

interface NewVideoDraftModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewVideoDraftModal = ({ isOpen, onOpenChange }: NewVideoDraftModalProps) => {
  const { folderId: parentId } = useParams() as { folderId: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof CreateVideoDraftSchema>>({
    resolver: zodResolver(CreateVideoDraftSchema)
  });

  const { mutateAsync, isPending } = useCreateVideoDraft(parentId || null);

  const createVideoDraft = async (VideoDraftName: string) => {
    try {
      await mutateAsync(
        { name: VideoDraftName, category: 'library' },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="sm" onOpenChange={onOpenChange}>
      <ModalContent
        as="form"
        onSubmit={handleSubmit(async (data) => await createVideoDraft(data.name))}
      >
        <ModalHeader
          title="New video draft"
          description="Create a new video draft to edit the videos in your library."
        />
        <ModalBody className="flex min-h-80 flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center">
              <VideoTrimFilled size={30} className="text-ds-text-secondary" />
            </div>
            <Input
              placeholder="Draft name"
              size="lg"
              autoFocus
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" isLoading={isPending} aria-label="Create">
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
