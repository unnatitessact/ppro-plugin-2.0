'use client';

import { useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image, Switch } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ArCube1Filled, CloudUpload } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/Modal';

import { useCreatePhysicalAsset } from '@/api-integration/mutations/library';

import { NewPhysicalAssetSchema } from '@/schemas/library/physical-assets';

interface NewPhysicalAssetModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewPhysicalAssetModal = ({ isOpen, onOpenChange }: NewPhysicalAssetModalProps) => {
  const [autogenerateId, setAutogenerateId] = useState(false);
  const [assetId, setAssetId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [assetIdError, setAssetIdError] = useState('');

  const { folderId: parentId } = useParams() as { folderId: string };

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof NewPhysicalAssetSchema>>({
    resolver: zodResolver(NewPhysicalAssetSchema)
  });

  const { mutateAsync, isPending } = useCreatePhysicalAsset(parentId || null);

  const createPhysicalAsset = async (assetName: string) => {
    try {
      let barcode = '';
      if (autogenerateId) {
        barcode = Math.floor(Math.random() * 10000000000).toString();
      } else if (!assetId) {
        return setAssetIdError('Asset ID is required');
      }

      await mutateAsync(
        { name: assetName, barcode: assetId || barcode, asset_image: image, location: '' },
        {
          onSuccess: () => {
            reset();
            setImage(null);
            setAssetId('');
            setAutogenerateId(false);
            onOpenChange(false);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      onOpenChange={onOpenChange}
      onClose={() => {
        reset();
        setImage(null);
        setAssetId('');
        setAutogenerateId(false);
      }}
    >
      <ModalContent
        as="form"
        onSubmit={handleSubmit(async (data) => createPhysicalAsset(data.name))}
      >
        <ModalHeader
          title="New physical asset"
          description="Physical assets can be used to manage real-word assets and objects that you use."
        />
        <ModalBody className="flex min-h-80 flex-col gap-2">
          <div className="group flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-default-200">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image ? (
              <div className="relative overflow-hidden">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Asset image"
                  className="aspect-video rounded-none object-contain"
                />
                <div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <Button
                    size="sm"
                    color="secondary"
                    className="absolute z-50 border border-ds-text-primary/10"
                    startContent={<CloudUpload size={20} />}
                    onClick={() => inputRef.current?.click()}
                    aria-label="Change image"
                  >
                    Change image
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                color="secondary"
                className="border border-ds-text-primary/10"
                startContent={<CloudUpload size={20} />}
                onClick={() => inputRef.current?.click()}
                aria-label="Upload image"
              >
                Upload image
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center">
              <ArCube1Filled size={30} className="text-ds-text-secondary" />
            </div>
            <Input
              placeholder="Asset name"
              size="lg"
              autoFocus
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-5 p-3">
            <span>Auto generate ID</span>
            <Switch
              size="sm"
              classNames={{
                wrapper: 'bg-ds-button-secondary-bg-hover'
              }}
              isSelected={autogenerateId}
              onValueChange={setAutogenerateId}
            />
          </div>
          {!autogenerateId && (
            <Input
              placeholder="Asset ID"
              size="lg"
              value={assetId}
              onValueChange={(value) => {
                setAssetId(value);
                if (assetIdError) {
                  setAssetIdError('');
                }
              }}
              isInvalid={!!assetIdError}
              errorMessage={assetIdError}
            />
          )}
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
