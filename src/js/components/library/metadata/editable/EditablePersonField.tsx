import { FormEvent, useEffect, useState } from 'react';

import { useClickOutside } from '@mantine/hooks';
import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { TrashCan } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Select, SelectItem } from '@/components/ui/Select';

import { User } from '@/components/library/metadata/User';

import { useLastAddedLibraryMetadataFieldId } from '@/hooks/useAddedMetadataField';
import { useWorkspace } from '@/hooks/useWorkspace';

import {
  useDeleteMetadataField,
  useUpdateMetadataValue
} from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { MetadataKeyValueCategoryField, PersonValue } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

import { WithMetadataFieldThreeDotMenu } from './WithMetadataFieldThreeDotMenu';

interface EditablePersonFieldProps {
  fieldId: string;
  label: string;
  value: PersonValue;
  categoryId: string;
  fieldMembershipId: string;
}

export const EditablePersonField = ({
  fieldId,
  label,
  value,
  categoryId,
  fieldMembershipId
}: EditablePersonFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);
  const { mutateAsync: deleteMetadataField, isPending: isDeleting } =
    useDeleteMetadataField(categoryId);

  const lastAddedFieldId = useLastAddedLibraryMetadataFieldId({ categoryId });

  const { members } = useWorkspace();

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
              <Select
                autoFocus
                placeholder="Select a person"
                selectedKeys={newValue.id ? [newValue.id] : []}
                onChange={(e) => {
                  const person = members.find((member) => member.id === e.target.value)!;
                  setNewValue({
                    id: person.id,
                    display_name: person.profile.display_name,
                    profile_picture: person.profile.profile_picture || null
                  });
                }}
              >
                {members.map((member) => (
                  <SelectItem key={member.id} textValue={member.profile.display_name}>
                    <User
                      name={member.profile.display_name}
                      image={member.profile.profile_picture || ''}
                      firstName={member.profile.first_name}
                      lastName={member.profile.last_name}
                      email={member.email}
                      color={member.profile.color}
                      displayName={member.profile.display_name}
                    />
                  </SelectItem>
                ))}
              </Select>
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
            <div className="line-clamp-3 text-ds-text-primary">
              {value.id ? (
                <User name={value.display_name} image={value.profile_picture || ''} size="lg" />
              ) : (
                'N/A'
              )}
            </div>
          </motion.div>
        </WithMetadataFieldThreeDotMenu>
      )}
    </motion.div>
  );
};
