import { ScrollShadow } from '@/components/ui/ScrollShadow';

import {
  EditableAttachmentField,
  EditableDateField,
  EditableLocationField,
  EditableMultiSelectField,
  EditableNumberField,
  EditablePersonField,
  EditableRatingField,
  EditableSelectField,
  EditableTextareaField,
  EditableTextField,
  EditableTimecodeField,
  EditableTimecodeRangeField,
  EditableToggleField
} from '@/components/library/metadata/editable';
import { MetadataSkeleton } from '@/components/skeletons/MetadataSkeleton';

import {
  AttachmentValue,
  LocationValue,
  MetadataKeyValueCategoryField,
  MultiselectValue,
  PersonValue,
  SelectValue,
  TimecodeRangeValue
} from '@/api-integration/types/metadata';

interface KeyValueMetadataProps {
  fields: MetadataKeyValueCategoryField[];
  isFieldsLoading: boolean;
  selectedTab: string;
  showAIButton: boolean;
}

export const KeyValueMetadata = ({
  fields,
  isFieldsLoading,
  selectedTab,
  showAIButton
}: KeyValueMetadataProps) => {
  return (
    <ScrollShadow className="flex h-full flex-col gap-1 px-3">
      {isFieldsLoading ? (
        <MetadataSkeleton />
      ) : fields && fields.length > 0 ? (
        fields.map((field) => {
          const keyValueField = field as MetadataKeyValueCategoryField;

          switch (keyValueField.field_membership.field.field_type) {
            case 'attachment':
              return (
                <EditableAttachmentField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as AttachmentValue}
                />
              );
            case 'date':
              return (
                <EditableDateField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as string}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'text':
              return (
                <EditableTextField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as string}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'text_area':
              return (
                <EditableTextareaField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as string}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'toggle':
              return (
                <EditableToggleField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as boolean}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'rating':
              return (
                <EditableRatingField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as number}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'location':
              return (
                <EditableLocationField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as LocationValue}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'person':
              return (
                <EditablePersonField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as PersonValue}
                />
              );
            case 'timecode':
              return (
                <EditableTimecodeField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as string}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'timecode_range':
              return (
                <EditableTimecodeRangeField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as TimecodeRangeValue}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'select':
              return (
                <EditableSelectField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as SelectValue}
                  options={keyValueField.field_membership.options || []}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'multiselect':
              return (
                <EditableMultiSelectField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as MultiselectValue}
                  options={keyValueField.field_membership.options || []}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            case 'number':
              return (
                <EditableNumberField
                  key={keyValueField.id}
                  categoryId={selectedTab || ''}
                  fieldMembershipId={keyValueField.field_membership.id}
                  fieldId={keyValueField.id}
                  label={keyValueField.field_membership.field.name}
                  value={keyValueField.value as number}
                  isAiGenerated={keyValueField?.is_ai_generated}
                  reason={keyValueField?.reason}
                  showAIButton={showAIButton}
                />
              );
            default:
              return null;
          }
        })
      ) : (
        <p className="flex h-full items-center justify-center pb-4 text-ds-text-secondary">
          No metadata
        </p>
      )}
    </ScrollShadow>
  );
};
