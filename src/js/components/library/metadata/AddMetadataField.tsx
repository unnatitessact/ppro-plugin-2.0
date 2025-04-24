'use client';

import { useEffect, useMemo, useState } from 'react';

import { useDisclosure } from '@nextui-org/react';

import { CreatableSelect } from '@/components/ui/CreatableSelect';

import { NewMetadataFieldModal } from '@/components/library/modals/metadata/NewMetadataFieldModal';

import { useCreateNewMetadataField } from '@/api-integration/mutations/metadata';
import { useMetadataFieldsQuery } from '@/api-integration/queries/metadata';
import { MetadataFieldInfo } from '@/api-integration/types/metadata';

import { getIconFromType } from '@/utils/metadata';

interface AddMetadataFieldProps {
  onAdd: (field: MetadataFieldInfo) => void;
  placeholder?: string;
}

export const AddMetadataField = ({ onAdd, placeholder }: AddMetadataFieldProps) => {
  const { data, fetchNextPage } = useMetadataFieldsQuery();

  useEffect(() => {
    // ?NOTE: Doing this instead of hasNextPage because it would stop fetching after the second page for some reason
    if (data && data.pages.at(-1)?.meta.next) {
      fetchNextPage();
    }
  }, [fetchNextPage, data]);

  const { mutateAsync: createNewMetadataField, isPending: isCreatingNewMetadataField } =
    useCreateNewMetadataField();

  const allFields = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  const [inputValue, setInputValue] = useState('');
  const [prefillValue, setPrefillValue] = useState<string | null>(null);

  const {
    isOpen: showNewFieldModal,
    onOpenChange: setShowNewFieldModal,
    onOpen: openNewFieldModal
  } = useDisclosure();

  const fields = useMemo(() => {
    return (
      allFields?.map((field) => ({
        label: field.name,
        value: field.id,
        type: field.field_type
      })) || []
    );
  }, [allFields]);

  return (
    <>
      <CreatableSelect
        controlShouldRenderValue={false}
        options={
          inputValue
            ? fields
            : [{ label: 'Create new field', value: 'add-field', type: undefined }, ...fields]
        }
        placeholder={placeholder || 'Type to add a field'}
        createOptionPosition="first"
        formatCreateLabel={(input) => `Create new field "${input}"`}
        onCreateOption={async () => {
          setPrefillValue(inputValue);
          openNewFieldModal();
        }}
        inputValue={inputValue}
        onInputChange={(value) => setInputValue(value)}
        onChange={(option) => {
          if (option) {
            if (option.value === 'add-field') {
              openNewFieldModal();
            } else {
              const fieldToAdd = allFields.find(
                (field) => field.id === option.value
              ) as MetadataFieldInfo;
              onAdd(fieldToAdd);
              setInputValue('');
            }
          }
        }}
        noOptionsMessage={() => <span className="text-sm">Type to add a new field</span>}
        formatOptionLabel={(data) => {
          return (
            <div className="flex items-center gap-1">
              {data?.type && getIconFromType(data.type, 20)}
              <span>{data?.label}</span>
            </div>
          );
        }}
        className="w-full"
      />
      <NewMetadataFieldModal
        isOpen={showNewFieldModal}
        isLoading={isCreatingNewMetadataField}
        onOpenChange={setShowNewFieldModal}
        initialFieldName={prefillValue || ''}
        onAdd={async (field) => {
          await createNewMetadataField(
            {
              fieldName: field.name,
              fieldType: field.field_type
            },
            {
              onSuccess(data) {
                onAdd({
                  id: data.id,
                  name: data.name,
                  field_type: data.field_type,
                  options: data.options
                });
              }
            }
          );
          setInputValue('');
        }}
      />
    </>
  );
};
