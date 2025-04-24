import { FormEvent, useEffect, useState } from 'react';

import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { TimecodeInput } from '@/components/ui/TimecodeInput';

import { useUpdateMetadataValue } from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { MetadataTableCategoryField, TimecodeRangeValue } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

interface TimecodeRangeCellProps {
  fieldId: string;
  label: string;
  value: TimecodeRangeValue;
  categoryId: string;
  rowId: string;
}

export const TimecodeRangeCell = ({
  fieldId,
  label,
  value,
  categoryId,
  rowId
}: TimecodeRangeCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStartValue, setNewStartValue] = useState(value[0] || '');
  const [newEndValue, setNewEndValue] = useState(value[1] || '');

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newValue: TimecodeRangeValue = [newStartValue, newEndValue];

    if (!newValue[0] || !newValue[1]) return;

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
      setNewStartValue(value[0] || '');
      setNewEndValue(value[1] || '');
    }
  }, [isEditing, value]);

  return (
    <Popover isOpen={isEditing} placement="bottom" shouldCloseOnInteractOutside={() => true}>
      <PopoverTrigger>
        <p
          className="line-clamp-3 cursor-pointer text-ds-text-primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {value[0] && value[1] ? `${value[0]} - ${value[1]}` : 'N/A'}
        </p>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={onSubmit} className={cn('p-2', 'flex flex-col gap-2', 'rounded-2xl')}>
          <p className="font-medium">{label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TimecodeInput value={newStartValue} onChange={setNewStartValue} />
                {'-'}
                <TimecodeInput value={newEndValue} onChange={setNewEndValue} />
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
                  isDisabled={!newStartValue || !newEndValue}
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
