'use client';

import { useParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FileTextFilled } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';

import { useCreateDocument } from '@/api-integration/mutations/library';

import { CreateDocumentSchema } from '@/schemas/library/documents';

interface NewDocumentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewDocumentModal = ({ isOpen, onOpenChange }: NewDocumentModalProps) => {
  const { folderId: parentId } = useParams() as { folderId: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof CreateDocumentSchema>>({
    resolver: zodResolver(CreateDocumentSchema)
  });

  const { mutateAsync, isPending } = useCreateDocument(parentId || null);

  const createDocument = async (documentName: string) => {
    try {
      await mutateAsync(
        { name: documentName, category: 'library' },
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
        onSubmit={handleSubmit(async (data) => await createDocument(data.name))}
      >
        <ModalHeader
          title="New document"
          description="Create a new document to plan and collaborate with your team."
        />
        <ModalBody className="flex min-h-80 flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center">
              <FileTextFilled size={30} className="text-ds-text-secondary" />
            </div>
            <Input
              placeholder="Document name"
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
