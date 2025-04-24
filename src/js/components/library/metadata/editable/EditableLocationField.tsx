import { useEffect, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { cn } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { motion } from 'framer-motion';
import PlacesAutocomplete from 'react-google-autocomplete';
import { toast } from 'sonner';

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
import { LocationValue, MetadataKeyValueCategoryField } from '@/api-integration/types/metadata';

import { formatDate } from '@/utils/dates';

import { WithMetadataFieldThreeDotMenu } from './WithMetadataFieldThreeDotMenu';

interface EditableLocationFieldProps {
  fieldId: string;
  label: string;
  value: LocationValue;
  categoryId: string;
  fieldMembershipId: string;
  isAiGenerated?: boolean;
  reason?: string;
  showAIButton?: boolean;
}

export const EditableLocationField = ({
  fieldId,
  label,
  value,
  categoryId,
  fieldMembershipId,
  isAiGenerated,
  reason,
  showAIButton
}: EditableLocationFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState({
    latitude: value.latitude || 0,
    longitude: value.longitude || 0,
    name: value.name || ''
  });

  const ref = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { data: modificationDetails, isSuccess } = useModificationDetails(fieldId, isEditing);

  const { mutateAsync: updateMetadataValue, isPending } = useUpdateMetadataValue(fieldId);
  const { mutateAsync: deleteMetadataField, isPending: isDeleting } =
    useDeleteMetadataField(categoryId);
  const { assetId } = useParams();
  const { mutateAsync: autoFillMetadataField, isPending: isAutoFilling } =
    useAutoFillMetadataField(categoryId);

  const lastAddedFieldId = useLastAddedLibraryMetadataFieldId({ categoryId });

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
      setNewValue({
        latitude: value.latitude || 0,
        longitude: value.longitude || 0,
        name: value.name || ''
      });
    }
  }, [isEditing, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const elementClasses = (e.target as Element).classList;
        const elementParentClasses = (e.target as Element).parentElement?.classList;
        const isPlaceOption =
          elementClasses.contains('pac-item') ||
          elementClasses.contains('pac-item-query') ||
          elementClasses.contains('pac-matched') ||
          elementParentClasses?.contains('pac-item') ||
          elementParentClasses?.contains('pac-item-query') ||
          elementParentClasses?.contains('pac-matched');
        if (!isPlaceOption) {
          setIsEditing(false);
        }
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    if (lastAddedFieldId === fieldMembershipId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [lastAddedFieldId, fieldMembershipId]);

  return (
    <motion.div layout="position" ref={ref}>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={['places', 'maps']}
      >
        {isEditing ? (
          <motion.div
            layout="position"
            // onSubmit={onSubmit}
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
                  className="rounded-xl bg-ds-input-bg p-3 transition placeholder:text-ds-input-text-placeholder hover:bg-ds-input-bg-hover focus:bg-ds-input-bg-hover focus:outline-none"
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
                  <Button
                    color="secondary"
                    onPress={() => setIsEditing(false)}
                    aria-label="Discard"
                  >
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
          </motion.div>
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
                <div className="line-clamp-3 text-ds-text-primary">{value.name || 'N/A'}</div>
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
              {!!value.latitude && !!value.longitude && (
                <Map
                  center={{ lat: value.latitude, lng: value.longitude }}
                  zoom={15}
                  className="h-48 w-full rounded-lg"
                  draggableCursor={null}
                  disableDoubleClickZoom
                  disableDefaultUI
                >
                  <Marker position={{ lat: value.latitude, lng: value.longitude }} />
                </Map>
              )}
            </motion.div>
          </WithMetadataFieldThreeDotMenu>
        )}
      </APIProvider>
    </motion.div>
  );
};
