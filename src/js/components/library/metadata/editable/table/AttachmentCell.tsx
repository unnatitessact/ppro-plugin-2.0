import { FormEvent, useEffect, useRef, useState } from 'react';

import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CloudUpload } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useFileUpload } from '@/hooks/useFileUpload';

import { useUpdateMetadataValue } from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { AttachmentValue, MetadataTableCategoryField } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

interface AttachmentCellProps {
  fieldId: string;
  label: string;
  value: AttachmentValue;
  categoryId: string;
  rowId: string;
}

export const AttachmentCell = ({
  fieldId,
  label,
  value,
  categoryId,
  rowId
}: AttachmentCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { uploadFile } = useFileUpload('attachment', null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);

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
            (data: MetadataTableCategoryField) => {
              return {
                ...data,
                rows: data.rows.map((row) => {
                  if (row.id === rowId) {
                    return {
                      ...row,
                      value_instances: row.value_instances.map((instance) => {
                        if (instance.id === fieldId) {
                          return { ...instance, value: fileObject };
                        }
                        return instance;
                      })
                    };
                  }
                  return row;
                })
              };
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
      setNewValue(value);
    }
  }, [isEditing, value]);

  return (
    <Popover isOpen={isEditing} placement="bottom" shouldCloseOnInteractOutside={() => true}>
      <PopoverTrigger>
        <div
          className="cursor-pointer text-ds-text-primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {value.id ? (
            <a href={value.url} target="_blank" className="hover:underline">
              {value.name}
            </a>
          ) : (
            'No file uploaded'
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={onSubmit} className={cn('p-2', 'flex flex-col gap-2', 'rounded-2xl')}>
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
            <div className="flex justify-between gap-6">
              <div />
              <div className="flex gap-2">
                <Button color="secondary" onPress={() => setIsEditing(false)} aria-label="Discard">
                  Discard
                </Button>
                <Button
                  color="primary"
                  isLoading={isPending || isLoading}
                  type="submit"
                  isDisabled={!newValue}
                  aria-label="Save"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
