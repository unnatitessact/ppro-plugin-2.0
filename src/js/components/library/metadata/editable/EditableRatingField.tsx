import { FormEvent, useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useClickOutside } from '@mantine/hooks';
import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Rating } from 'react-simple-star-rating';

import { MagicEdit, SparklesThreeFilled, TrashCan } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

import { useLastAddedLibraryMetadataFieldId } from '@/hooks/useAddedMetadataField';

import {
  useAutoFillMetadataField,
  useDeleteMetadataField,
  useUpdateMetadataValue
} from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { MetadataKeyValueCategoryField } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

import { WithMetadataFieldThreeDotMenu } from './WithMetadataFieldThreeDotMenu';

interface EditableRatingFieldProps {
  fieldId: string;
  label: string;
  value: number;
  categoryId: string;
  fieldMembershipId: string;
  isAiGenerated?: boolean;
  reason?: string;
  showAIButton?: boolean;
}

export const EditableRatingField = ({
  fieldId,
  label,
  value,
  categoryId,
  fieldMembershipId,
  isAiGenerated,
  reason,
  showAIButton
}: EditableRatingFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);
  const { mutateAsync: deleteMetadataField, isPending: isDeleting } =
    useDeleteMetadataField(categoryId);
  const { assetId } = useParams();
  const { mutateAsync: autoFillMetadataField, isPending: isAutoFilling } =
    useAutoFillMetadataField(categoryId);

  const lastAddedFieldId = useLastAddedLibraryMetadataFieldId({ categoryId });

  const ref = useClickOutside(() => {
    setIsEditing(false);
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newValue) return;

    await updateMetadataValue(newValue, {
      onSuccess: () => {
        setIsEditing(false);
        queryClient.setQueryData(
          getMetadataFieldsForCategoryQueryKey(categoryId),
          (data: MetadataKeyValueCategoryField[]) => {
            return data.map((field) =>
              field.id === fieldId ? { ...field, value: newValue } : field
            );
          }
        );
      }
    });
  };

  useEffect(() => {
    if (!isEditing) {
      setNewValue(value);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (lastAddedFieldId === fieldMembershipId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [lastAddedFieldId, fieldMembershipId]);

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
              <Rating
                initialValue={value}
                SVGclassName="inline-flex"
                size={24}
                onClick={(value) => setNewValue(value)}
              />
              <p
                className={cn(
                  'h-4 truncate text-xs text-ds-text-secondary',
                  isSuccess ? 'opacity-100' : 'opacity-0'
                )}
              >
                Last edited {formatDate(modificationDetails?.modified_on || '')} by{' '}
                {isAiGenerated ? (
                  <span className="text-ds-text-primary">Tessact AI</span>
                ) : (
                  <span className="text-ds-text-primary">
                    {modificationDetails?.modified_by.profile?.display_name}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap justify-between gap-6">
              <Button
                color="secondary"
                className="px-6"
                aria-label="Delete field"
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
                {showAIButton && (
                  <Button
                    color="secondary"
                    className="px-6"
                    aria-label="Auto fill field"
                    isIconOnly
                    onPress={() => {
                      autoFillMetadataField(
                        {
                          value_instance_ids: [fieldId],
                          file_id: assetId as string
                        },
                        {
                          onSuccess: () => {
                            setIsEditing(false);
                          }
                        }
                      );
                    }}
                    isLoading={isAutoFilling}
                  >
                    <span className="inline-block">
                      <MagicEdit size={20} />
                    </span>
                  </Button>
                )}
                <Button color="secondary" onPress={() => setIsEditing(false)} aria-label="Discard">
                  Discard
                </Button>
                <Button
                  color="primary"
                  isLoading={isPending}
                  type="submit"
                  isDisabled={!newValue}
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
            <div className="flex items-center gap-1">
              <Rating
                readonly
                initialValue={value}
                size={20}
                SVGclassName="inline-flex -translate-y-1"
                className="h-5"
                fillClassName="h-5"
                emptyClassName="h-5"
              />
              {reason && isAiGenerated && (
                <Tooltip
                  showArrow={false}
                  delay={500}
                  closeDelay={0}
                  classNames={{
                    content: 'px-4 py-2'
                  }}
                  content={
                    <span className="max-w-[300px] text-xs font-normal text-ds-text-secondary">
                      {reason}
                    </span>
                  }
                >
                  <div className="flex">
                    <SparklesThreeFilled size={16} className="text-ds-text-secondary" />
                  </div>
                </Tooltip>
              )}
            </div>
          </motion.div>
        </WithMetadataFieldThreeDotMenu>
      )}
    </motion.div>
  );
};
