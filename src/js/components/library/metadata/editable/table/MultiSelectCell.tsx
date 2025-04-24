import { FormEvent, useEffect, useState } from 'react';

import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { CreatableMultiSelect } from '@/components/ui/CreatableMultiSelect';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import {
  useAddOptionToField,
  useCreateOption,
  useUpdateMetadataValue
} from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import {
  FieldOption,
  MetadataTableCategoryField,
  MultiselectValue
} from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

interface MultiSelectCellProps {
  fieldId: string;
  label: string;
  value: MultiselectValue;
  categoryId: string;
  rowId: string;
  options: FieldOption[];
  fieldMembershipId: string;
}

export const MultiSelectCell = ({
  fieldId,
  label,
  value,
  categoryId,
  rowId,
  options,
  fieldMembershipId
}: MultiSelectCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [selectOptions, setSelectOptions] = useState(options);

  useEffect(() => {
    setSelectOptions(options);
  }, [options]);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);
  const { mutateAsync: createOption, isPending: isCreatingOption } = useCreateOption();
  const { mutateAsync: addOptionToField, isPending: isAddingOption } =
    useAddOptionToField(fieldMembershipId);

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
    <Popover
      classNames={{ content: 'overflow-visible' }}
      isOpen={isEditing}
      placement="bottom"
      shouldCloseOnInteractOutside={() => true}
    >
      <PopoverTrigger>
        <p
          className="line-clamp-3 cursor-pointer text-ds-text-primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {value.length ? value.map((v) => v.value).join(', ') : 'N/A'}
        </p>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={onSubmit} className={cn('p-2', 'flex flex-col gap-2', 'rounded-2xl')}>
          <p className="font-medium">{label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <CreatableMultiSelect
                options={selectOptions.map((option) => ({ label: option.value, value: option.id }))}
                value={
                  newValue.length
                    ? newValue.map((item) => ({
                        label: item.value,
                        value: item.id
                      }))
                    : []
                }
                onChange={(value) => {
                  setNewValue(value.map((v) => ({ id: v.value, value: v.label })));
                }}
                onCreateOption={async (value) => {
                  await createOption(value, {
                    onSuccess: (data) => {
                      addOptionToField([data.id, ...selectOptions.map((option) => option.id)], {
                        onSuccess: () => {
                          setSelectOptions([...selectOptions, { value: data.value, id: data.id }]);
                          setNewValue((prev) => [...prev, { id: data.id, value: data.value }]);
                        }
                      });
                    }
                  });
                }}
                placeholder="Select options"
                isLoading={isCreatingOption || isAddingOption}
                noOptionsMessage={() => <span className="text-sm">Type to add an option</span>}
              />
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
