import { FormEvent, useEffect, useState } from 'react';

import { DateValue, parseDate } from '@internationalized/date';
import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DateInput';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useUpdateMetadataValue } from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { MetadataTableCategoryField } from '@/api-integration/types/metadata';

import { absoluteFormatDate, formatDate } from '@/utils/dates';

interface DateCellProps {
  fieldId: string;
  label: string;
  value: string;
  categoryId: string;
  rowId: string;
}

export const DateCell = ({ fieldId, label, value, categoryId, rowId }: DateCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState<DateValue | null>(value ? parseDate(value) : null);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newValue) return;

    await updateMetadataValue(newValue.toString(), {
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
                        return { ...instance, value: newValue.toString() };
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
      setNewValue(value ? parseDate(value) : null);
    }
  }, [isEditing, value]);

  return (
    <Popover isOpen={isEditing} placement="bottom" shouldCloseOnInteractOutside={() => true}>
      <PopoverTrigger>
        <div
          className="cursor-pointer text-ds-text-primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {value ? absoluteFormatDate(value) : 'N/A'}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={onSubmit} className={cn('p-2', 'flex flex-col gap-2', 'rounded-2xl')}>
          <p className="font-medium">{label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <DatePicker value={newValue} onChange={setNewValue} showMonthAndYearPickers />
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
