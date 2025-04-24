import { FormEvent, useEffect, useRef, useState } from 'react';

import { useClickOutside } from '@mantine/hooks';
import { cn, Image } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { CloudUpload, TrashCan } from '@tessact/icons';

import { Button } from '@/components/ui/Button';

import { useLastAddedLibraryMetadataFieldId } from '@/hooks/useAddedMetadataField';
import { useFileUpload } from '@/hooks/useFileUpload';

import {
  useDeleteMetadataField,
  useUpdateMetadataValue
} from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { AttachmentValue, MetadataKeyValueCategoryField } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

import { WithMetadataFieldThreeDotMenu } from './WithMetadataFieldThreeDotMenu';

interface EditableAttachmentFieldProps {
  fieldId: string;
  label: string;
  value: AttachmentValue;
  categoryId: string;
  fieldMembershipId: string;
}

export const EditableAttachmentField = ({
  fieldId,
  label,
  value,
  categoryId,
  fieldMembershipId
}: EditableAttachmentFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);
  const { mutateAsync: deleteMetadataField, isPending: isDeleting } =
    useDeleteMetadataField(categoryId);

  const lastAddedFieldId = useLastAddedLibraryMetadataFieldId({ categoryId });

  const { uploadFile } = useFileUpload('attachment', null);

  const ref = useClickOutside(() => {
    setIsEditing(false);
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!fileToUpload) {
        return;
      }

      setIsLoading(true);
      const uploadedFile = await uploadFile(fileToUpload);

      if (!uploadedFile) {
        return toast.error('Failed to upload file');
      }

      const fileObject = {
        id: uploadedFile.data.id,
        name: uploadedFile.data.name,
        url: '',
        file_type: uploadedFile.data.file_type,
        preview_url: ''
      };

      await updateMetadataValue(fileObject, {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.setQueryData(
            getMetadataFieldsForCategoryQueryKey(categoryId),
            (data: MetadataKeyValueCategoryField[]) => {
              return data.map((field) =>
                field.id === fieldId ? { ...field, value: fileObject } : field
              );
            }
          );
        }
      });

      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to upload attachment');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setFileToUpload(null);
    }
  }, [isEditing]);

  useEffect(() => {
    if (lastAddedFieldId === fieldMembershipId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [lastAddedFieldId, fieldMembershipId]);

  const renderPreview = () => {
    if (value.file_type === 'video') {
      return (
        <div className="flex flex-col items-center gap-1">
          <video controls src={value.url} className="w-full rounded-xl bg-black" />
          <a
            href={value.url}
            target="_blank"
            className="text-center text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Download
          </a>
        </div>
      );
    }
    if (value.file_type === 'image') {
      return (
        <div className="flex flex-col items-center gap-1">
          <Image alt={value.name} src={value.url} className="w-full" />
          <a
            href={value.url}
            target="_blank"
            className="text-center text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Download
          </a>
        </div>
      );
    }

    return (
      <a href={value.url} target="_blank" className="hover:underline">
        {value.name}
      </a>
    );
  };

  return (
    <motion.div layout="position" ref={ref}>
      {isEditing ? (
        <motion.form
          layout="position"
          onSubmit={onSubmit}
          className={cn(
            'p-4',
            'flex flex-col gap-2',
            'rounded-2xl',
            'border border-ds-menu-border'
          )}
        >
          <p className="font-medium">{label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={(e) => {
                  if (e.target.files) setFileToUpload(e.target.files[0]);
                }}
              />
              <div className="flex flex-col gap-1">
                <Button
                  color="secondary"
                  startContent={<CloudUpload size={20} />}
                  onPress={() => fileInputRef.current?.click()}
                  aria-label="Upload file"
                >
                  {fileToUpload || value.id ? 'Replace file' : 'Upload file'}
                </Button>
                {fileToUpload && (
                  <p className="truncate text-xs text-ds-text-secondary">
                    Attached: {fileToUpload.name}
                  </p>
                )}
              </div>
              <p
                className={cn(
                  'h-4 truncate text-xs text-ds-text-secondary',
                  isSuccess ? 'opacity-100' : 'opacity-0'
                )}
              >
                Last edited {formatDate(modificationDetails?.modified_on || '')} by{' '}
                <span className="text-ds-text-primary">
                  {modificationDetails?.modified_by.profile?.display_name}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap justify-between gap-6">
              <Button
                color="secondary"
                className="px-6"
                aria-label="Delete file"
                isIconOnly
                onPress={() =>
                  deleteMetadataField(fieldMembershipId, {
                    onSuccess: () => {
                      queryClient.setQueryData(
                        getMetadataFieldsForCategoryQueryKey(categoryId),
                        (data: MetadataKeyValueCategoryField[]) => {
                          return data.filter((field) => field.id !== fieldId);
                        }
                      );
                    }
                  })
                }
                isLoading={isDeleting}
              >
                <span className="inline-block">
                  <TrashCan size={20} />
                </span>
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button color="secondary" onPress={() => setIsEditing(false)} aria-label="Discard">
                  Discard
                </Button>
                <Button
                  color="primary"
                  isLoading={isPending || isLoading}
                  type="submit"
                  isDisabled={!fileToUpload}
                  aria-label="Save"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        <WithMetadataFieldThreeDotMenu
          onEdit={() => setIsEditing(true)}
          onDelete={() => {
            deleteMetadataField(fieldMembershipId);
          }}
        >
          <motion.div
            layout="position"
            className={cn(
              'px-2 py-3',
              'flex flex-wrap items-center justify-between gap-x-5 gap-y-2',
              'rounded-2xl',
              'cursor-pointer',
              'transition hover:bg-ds-menu-bg'
            )}
            onClick={() => setIsEditing(true)}
          >
            <p className="text-ds-text-secondary">{label}</p>
            <div className="text-ds-text-primary">
              {value.id ? renderPreview() : 'No file uploaded'}
            </div>
          </motion.div>
        </WithMetadataFieldThreeDotMenu>
      )}
    </motion.div>
  );
};
