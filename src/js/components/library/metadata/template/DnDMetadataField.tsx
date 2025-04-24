import { useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@nextui-org/react';

import { CrossSmall, DotGrid2X3 } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { CreatableMultiSelect } from '@/components/ui/CreatableMultiSelect';

import { useAddOptionToTemplateField, useCreateOption } from '@/api-integration/mutations/metadata';
import { FieldOption, MetadataFieldType } from '@/api-integration/types/metadata';

import { getIconFromType, getLabelFromType } from '@/utils/metadata';

interface DnDMetadataFieldProps {
  id: string;
  label: string;
  type: MetadataFieldType;
  onRemove: () => void;
  fieldMembershipId: string;
  options: FieldOption[];
}

export const DnDMetadataField = ({
  id,
  label,
  type,
  onRemove,
  fieldMembershipId,
  options
}: DnDMetadataFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const [selectOptions, setSelectOptions] = useState<FieldOption[]>(options);

  const { mutate: createOption, isPending: isCreatingOption } = useCreateOption();
  const { mutate: addOptionToField, isPending: isAddingOption } =
    useAddOptionToTemplateField(fieldMembershipId);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl px-2 py-3 transition hover:bg-ds-link-bg-hover',
        isDragging && 'bg-ds-link-bg-hover'
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition
      }}
      ref={setNodeRef}
      {...attributes}
    >
      <div className={cn('flex items-center justify-between gap-5', 'group')}>
        <div className="flex items-center gap-3">
          <DotGrid2X3
            size={24}
            className="cursor-move text-ds-menu-text-secondary"
            {...listeners}
          />
          {getIconFromType(type)}
          <div className="flex flex-col">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-ds-menu-text-secondary">{getLabelFromType(type)}</p>
          </div>
        </div>
        <Button
          color="secondary"
          size="md"
          onPress={onRemove}
          startContent={<CrossSmall size={20} />}
          className="opacity-0 transition group-hover:opacity-100"
          aria-label="Remove"
        >
          Remove
        </Button>
      </div>
      {type === 'select' || type === 'multiselect' ? (
        <div className="pl-10">
          <CreatableMultiSelect
            options={options.map((option) => ({
              value: option.id,
              label: option.value
            }))}
            placeholder="Add options"
            onCreateOption={(value) => {
              createOption(value, {
                onSuccess: (option) => {
                  setSelectOptions((prev) => [...prev, option]);
                  addOptionToField([option.id, ...selectOptions.map((o) => o.id)]);
                }
              });
            }}
            isLoading={isCreatingOption || isAddingOption}
            onChange={(value) => {
              setSelectOptions(
                value.map((option) => ({
                  id: option.value,
                  value: option.label
                }))
              );
              if (value.length > 0) {
                addOptionToField(value.map((option) => option.value));
              }
            }}
            value={selectOptions.map((option) => ({
              value: option.id,
              label: option.value
            }))}
            noOptionsMessage={() => <span className="text-sm">Type to add an option</span>}
          />
        </div>
      ) : null}
    </div>
  );
};
