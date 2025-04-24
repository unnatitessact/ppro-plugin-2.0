import { ChangeEvent, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image, Spacer, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Check, Images2 } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from '@/components/ui/User';

import ImageCropperModal from '@/components/ImageCropperModal';

import { useOrganization } from '@/hooks/useOrganization';

import { useCreateWorkspace } from '@/api-integration/mutations/user-management';

import { CreateNewWorkspaceCardSchema } from '@/schemas/user-management';

interface CreateNewWorkspaceCardProps {
  cancel: () => void;
  toggleWorkspaceSelection: (workspaceId: string, isSelected: boolean) => void;
}

export const CreateNewWorkspaceCard = ({
  cancel,
  toggleWorkspaceSelection
}: CreateNewWorkspaceCardProps) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const organization = useOrganization();
  const { mutateAsync: createWorkspace, isPending: isPendingCreateWorkspace } =
    useCreateWorkspace();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = useForm<z.infer<typeof CreateNewWorkspaceCardSchema>>({
    resolver: zodResolver(CreateNewWorkspaceCardSchema)
  });

  const [inputImage, setInputImage] = useState<string | null>(null);
  const [workspaceImage, setWorkspaceImage] = useState<File | null>(null);

  const workspaceImageURL = useMemo(
    () => (workspaceImage ? URL.createObjectURL(workspaceImage) : ''),
    [workspaceImage]
  );

  const {
    isOpen: isImageCropperOpen,
    onOpen: onImageCropperOpen,
    onOpenChange: onImageCropperOpenChange
  } = useDisclosure();

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setInputImage(URL.createObjectURL(event.target.files[0]));
      onImageCropperOpen();
      event.target.value = '';
    }
  };

  return (
    <>
      <motion.div
        className="overflow-hidden"
        layout="preserve-aspect"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        <form
          onSubmit={handleSubmit(async (data) => {
            const { data: createdWorkspace } = await createWorkspace(
              {
                organization: organization?.id,
                title: data?.workspaceName,
                display_image: workspaceImage
              },
              {
                onSuccess: () => {
                  reset();
                  cancel();
                }
              }
            );
            toggleWorkspaceSelection(createdWorkspace.id, true);
          })}
          className="flex w-full flex-1 flex-row items-center justify-between rounded-xl bg-default-100 px-3 py-1"
        >
          <div className="flex items-center gap-2">
            <User
              name={
                <Input
                  autoFocus
                  size="md"
                  value={workspaceName}
                  onValueChange={setWorkspaceName}
                  placeholder="Workspace name"
                  {...register('workspaceName')}
                  isInvalid={!!errors.workspaceName}
                />
              }
              classNames={{
                base: 'py-2 px-3 pl-0'
              }}
              avatarProps={{
                icon: (
                  <label className=" grid h-full w-full cursor-pointer place-items-center text-default-400">
                    {workspaceImageURL ? (
                      <Image
                        src={workspaceImageURL}
                        alt="Workspace Picture"
                        width={40}
                        height={40}
                        classNames={{
                          wrapper: 'h-full w-full rounded-large transition-opacity',
                          img: 'rounded-none'
                        }}
                      />
                    ) : (
                      <Images2 size={20} />
                    )}
                    <input type="file" accept="image/*" hidden onChange={onSelectFile} />
                  </label>
                ),
                size: 'md',
                radius: 'sm',
                classNames: {
                  icon: ' w-full h-full'
                }
              }}
            />
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" onPress={cancel} aria-label="Cancel">
              Cancel
            </Button>
            <Button
              isLoading={isSubmitting || isPendingCreateWorkspace}
              isDisabled={isPendingCreateWorkspace}
              type="submit"
              size="sm"
              color="primary"
              startContent={<Check size={16} />}
              aria-label="Create"
            >
              Create
            </Button>
          </div>
        </form>
        <Spacer y={2} />
      </motion.div>
      <ImageCropperModal
        isOpen={isImageCropperOpen}
        onClose={() => onImageCropperOpenChange()}
        title="Crop your workspace icon"
        inputImage={inputImage || ''}
        setCroppedImage={(image) => {
          setWorkspaceImage(image);
          onImageCropperOpenChange();
        }}
        shape="rect"
      />
    </>
  );
};
