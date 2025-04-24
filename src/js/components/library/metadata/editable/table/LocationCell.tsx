import { useEffect, useState } from 'react';

import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import PlacesAutocomplete from 'react-google-autocomplete';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useUpdateMetadataValue } from '@/api-integration/mutations/metadata';
import {
  getMetadataFieldsForCategoryQueryKey,
  useModificationDetails
} from '@/api-integration/queries/metadata';
import { LocationValue, MetadataTableCategoryField } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

interface LocationCellProps {
  fieldId: string;
  label: string;
  value: LocationValue;
  categoryId: string;
  rowId: string;
}

export const LocationCell = ({ fieldId, label, value, categoryId, rowId }: LocationCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState({
    latitude: value.latitude || 0,
    longitude: value.longitude || 0,
    name: value.name || ''
  });

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);

  const onSubmit = async () => {
    if (!newValue.name || !newValue.latitude || !newValue.longitude) {
      return toast.error('Please enter a valid location', {
        description: 'Pick a location from the dropdown'
      });
    }

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
      setNewValue({
        latitude: value.latitude || 0,
        longitude: value.longitude || 0,
        name: value.name || ''
      });
    }
  }, [isEditing, value]);

  return (
    <Popover isOpen={isEditing} placement="bottom" shouldCloseOnInteractOutside={() => true}>
      <PopoverTrigger>
        <p
          className="line-clamp-3 cursor-pointer text-ds-text-primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {value.name || 'N/A'}
        </p>
      </PopoverTrigger>
      <PopoverContent>
        <div className={cn('p-2', 'flex flex-col gap-2', 'rounded-2xl')}>
          <p className="font-medium">{label}</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <PlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onPlaceSelected={(place) => {
                  if (!place || !place.geometry?.location || !place.formatted_address) return;

                  const address = place.formatted_address;
                  const latitude = place.geometry.location.lat();
                  const longitude = place.geometry.location.lng();
                  setNewValue({ name: address, latitude, longitude });
                }}
                options={{ types: [] }}
                inputAutocompleteValue={newValue.name}
                onChange={() => {
                  if (value.name) {
                    setNewValue({ name: '', latitude: 0, longitude: 0 });
                  }
                }}
                defaultValue={newValue.name}
                className="z-[100000] rounded-xl bg-ds-input-bg p-3 transition placeholder:text-ds-input-text-placeholder hover:bg-ds-input-bg-hover focus:bg-ds-input-bg-hover focus:outline-none"
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
                  onPress={onSubmit}
                  isDisabled={!newValue.name || !newValue.latitude || !newValue.longitude}
                  aria-label="Save"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
