import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Pencil } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';

import ImageCropperModal from '@/components/ImageCropperModal';
import WorkspaceIcon from '@/components/user-management/WorkspaceIcon';

import { useUpdateWorkspaceDetails } from '@/api-integration/mutations/user-management';

import { EditWorkspaceTeamSchema } from '@/schemas/user-management';

interface EditWorkspaceModalProps {
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
  onOpenChange: () => void;
  title: string;
  workspaceTitle: string;
  workspaceId: string;
  workspaceImage: string;
  color?: string;
}

const EditWorkspaceModal = ({
  isOpen,
  onOpenChange,
  title,
  workspaceId,
  workspaceTitle,
  workspaceImage,
  color
}: EditWorkspaceModalProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof EditWorkspaceTeamSchema>>({
    resolver: zodResolver(EditWorkspaceTeamSchema),
    defaultValues: {
      name: workspaceTitle || ''
    }
  });
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [isImageCroppingModalOpen, setIsImageCroppingModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { mutateAsync: updateWorkspaceDetails, isPending } = useUpdateWorkspaceDetails(
    workspaceId,
    () => {
      setCroppedImage(null);
      setProfileImage('');
    }
  );

  const imageButtonRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
      setIsImageCroppingModalOpen(true);
      event.target.value = '';
    }
  };

  const setWorkspaceName = async (data: z.infer<typeof EditWorkspaceTeamSchema>) => {
    try {
      await updateWorkspaceDetails({
        title: data.name,
        display_image: croppedImage ? croppedImage : null
      });
      onOpenChange();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reset({
      name: workspaceTitle
    });
  }, [workspaceTitle, reset]);

  const workspaceImageURL = useMemo(
    () => (croppedImage ? URL.createObjectURL(croppedImage) : ''),
    [croppedImage]
  );

  return (
    <>
      <input hidden type="file" ref={imageButtonRef} onChange={onSelectFile} accept="image/*" />
      <Modal
        isOpen={isOpen}
        size="sm"
        onOpenChange={() => {
          onOpenChange();
          setCroppedImage(null);
        }}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
      >
        <ModalContent>
          <form
            className="flex flex-col"
            onSubmit={handleSubmit((data) => {
              setWorkspaceName(data);
            })}
          >
            <ModalHeader>
              <span className="text-lg font-medium text-default-900">{title}</span>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-[48px,1fr] gap-2">
                <div
                  className="group relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-default-300"
                  onClick={() => {
                    imageButtonRef.current?.click();
                  }}
                >
                  {croppedImage ? (
                    <Image
                      src={workspaceImageURL}
                      alt="Picture"
                      className="h-12 w-12 rounded-xl bg-default-300 transition-opacity group-hover:opacity-60"
                    />
                  ) : (
                    <WorkspaceIcon size="2xl" image={workspaceImage} title={title} color={color} />
                  )}
                  <div className="group/item absolute left-0 top-0 z-10 h-full w-full items-center justify-center duration-200 transition-background hover:bg-[rgba(0,0,0,0.5)] group-hover:flex">
                    <Pencil size={20} className="invisible group-hover/item:visible" />
                  </div>
                </div>
                <Input
                  autoFocus
                  placeholder="Enter your workspace name"
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
      <ImageCropperModal
        isOpen={isImageCroppingModalOpen}
        onClose={() => setIsImageCroppingModalOpen(false)}
        title="Crop your profile picture"
        inputImage={profileImage || ''}
        setCroppedImage={(image) => {
          setCroppedImage(image);
          setIsImageCroppingModalOpen(false);
        }}
        shape="rect"
      />
    </>
  );
};

export default EditWorkspaceModal;
