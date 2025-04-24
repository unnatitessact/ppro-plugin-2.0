import { FormEvent, useEffect, useState } from 'react';

import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Select, SelectItem } from '@/components/ui/Select';

import { User } from '@/components/library/metadata/User';

import { useWorkspace } from '@/hooks/useWorkspace';

import { useUpdateMetadataValue } from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { MetadataTableCategoryField, PersonValue } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

interface PersonCellProps {
  fieldId: string;
  label: string;
  value: PersonValue;
  categoryId: string;
  rowId: string;
}

export const PersonCell = ({ fieldId, label, value, categoryId, rowId }: PersonCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);

  const { members } = useWorkspace();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newValue) return;

    await updateMetadataValue(newValue, {
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
                        return { ...instance, value: newValue };
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
  };

  useEffect(() => {
    if (!isEditing) {
      setNewValue(value);
    }
  }, [isEditing, value]);

  return (
    <Popover isOpen={isEditing} placement="bottom">
      <PopoverTrigger>
        <p
          className="line-clamp-3 cursor-pointer text-ds-text-primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {value.id ? (
            <User name={value.display_name} image={value.profile_picture || ''} size="md" />
          ) : (
            'N/A'
          )}
        </p>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={onSubmit} className={cn('p-2', 'flex flex-col gap-2', 'rounded-2xl')}>
          <p className="font-medium">{label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Select
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
            <div className="flex justify-between gap-6">
              <div />
              <div className="flex gap-2">
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
        </form>
      </PopoverContent>
    </Popover>
  );
};
