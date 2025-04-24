import { useMemo, useState } from 'react';

import { useDisclosure } from '@nextui-org/react';

import { DotGrid1X3Horizontal, PlusLarge } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { AlertModal } from '@/components/ui/modal/AlertModal';
import { Tab, Tabs } from '@/components/ui/Tabs';

import AIButton from '@/components/library/ai/MetadataAIButton';
import { AddMetadataField } from '@/components/library/metadata/AddMetadataField';
import { KeyValueMetadata } from '@/components/library/metadata/KeyValueMetadata';
import { TableMetadata } from '@/components/library/metadata/TableMetadata';
import { EditCategoriesModal } from '@/components/library/modals/metadata/EditCategoriesModal';

import { useFeatureFlag } from '@/hooks/useFeatureFlag';

import {
  useAddFieldToCategoryInstance,
  useAddRowToTable,
  useAutoFillMetadataField,
  useAutoTranslateMetadataField,
  useResetMetadata
} from '@/api-integration/mutations/metadata';
import {
  useMetadataCategoriesQuery,
  useMetadataFieldsForCategoryQuery
} from '@/api-integration/queries/metadata';
import {
  MetadataKeyValueCategoryField,
  MetadataTableCategoryField
} from '@/api-integration/types/metadata';

import { AI_METADATA_FLAG } from '@/utils/featureFlagUtils';

export const Metadata = ({
  assetId,
  assetName,
  isDetectionProcessing
}: {
  assetId: string;
  assetName: string;
  isDetectionProcessing?: boolean;
}) => {
  const { data: categories } = useMetadataCategoriesQuery(assetId);

  const [selectedTab, setSelectedTab] = useState(categories?.[0]?.id || null);

  const { data: fields, isLoading: isFieldsLoading } = useMetadataFieldsForCategoryQuery(
    selectedTab || ''
  );

  const showAIButton = useFeatureFlag(AI_METADATA_FLAG);

  const {
    isOpen: isResetTemplateOpen,
    onOpen: onResetTemplateOpen,
    onOpenChange: onResetTemplateOpenChange
  } = useDisclosure();

  const {
    isOpen: isEditCategoriesOpen,
    onOpen: onEditCategoriesOpen,
    onOpenChange: onEditCategoriesOpenChange
  } = useDisclosure();

  const handleAction = (key: string) => {
    if (key === 'reset-metadata') {
      onResetTemplateOpen();
    }
    if (key === 'edit-categories') {
      onEditCategoriesOpen();
    }
  };

  const { mutate: addFieldToCategoryInstance } = useAddFieldToCategoryInstance(selectedTab || '');
  const { mutate: resetMetadata } = useResetMetadata(assetId);
  const { mutate: addRowToTable, isPending: isAddRowToTableLoading } = useAddRowToTable(
    selectedTab || ''
  );

  const { mutateAsync: autoFillMetadataField, isPending: isAutoFilling } = useAutoFillMetadataField(
    selectedTab as string
  );

  const { mutate: autoTranslateMetadataField } = useAutoTranslateMetadataField(
    selectedTab as string
  );

  const isTable = useMemo(() => {
    return categories?.find((category) => category.id === selectedTab)?.is_table || false;
  }, [selectedTab, categories]);

  const handleAutoFillMetadataField = async () => {
    if (isTable) {
      await autoFillMetadataField({
        category_instance_id: selectedTab as string,
        file_id: assetId as string
      });
    } else {
      const fieldIds = (fields as MetadataKeyValueCategoryField[])?.map((field) => field.id);
      await autoFillMetadataField({
        value_instance_ids: fieldIds,
        file_id: assetId as string
      });
    }
  };

  const handleAutoTranslateMetadataField = (languageCode: string) => {
    autoTranslateMetadataField({
      file_id: assetId as string,
      language_code: languageCode
    });
  };

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col gap-4 pt-5">
        <div className="flex w-full items-center justify-between gap-4 px-3">
          <Tabs
            aria-label="Metadata tabs"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="flex-1 overflow-hidden"
          >
            {categories?.map((category) => <Tab key={category.id} title={category.name} />)}
          </Tabs>
          <div className="flex items-center gap-2">
            {!isDetectionProcessing && showAIButton && (
              <AIButton
                handleAutoFillMetadataField={handleAutoFillMetadataField}
                isLoading={isAutoFilling}
                handleAutoTranslateMetadataField={handleAutoTranslateMetadataField}
              />
            )}
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly color="secondary" aria-label="More options">
                  <DotGrid1X3Horizontal size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key) => handleAction(key as string)}>
                <DropdownItem key="reset-metadata">Apply new Template</DropdownItem>
                <DropdownItem key="edit-categories">Edit Categories</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-3">
          <AddMetadataField
            onAdd={(field) => addFieldToCategoryInstance(field.id)}
            placeholder={isTable ? 'Type to add a column' : ''}
          />
          {isTable && (
            <Button
              size="lg"
              color="secondary"
              startContent={<PlusLarge size={20} />}
              isLoading={isAddRowToTableLoading}
              onPress={() => addRowToTable()}
              aria-label="Add row"
            >
              New Row
            </Button>
          )}
        </div>
        {!isTable ? (
          <KeyValueMetadata
            fields={(fields || []) as MetadataKeyValueCategoryField[]}
            isFieldsLoading={isFieldsLoading}
            selectedTab={selectedTab || ''}
            showAIButton={showAIButton}
          />
        ) : null}
        {isTable ? (
          <TableMetadata
            data={fields as MetadataTableCategoryField}
            isLoading={isFieldsLoading}
            categoryId={selectedTab || ''}
          />
        ) : null}
      </div>
      <AlertModal
        title="Apply new Template"
        description="All current metadata will be reset if you want to apply a new metadata template."
        danger
        isOpen={isResetTemplateOpen}
        onOpenChange={onResetTemplateOpenChange}
        onConfirm={() => resetMetadata()}
        actionText="Reset"
      />
      <EditCategoriesModal
        isOpen={isEditCategoriesOpen}
        onOpenChange={onEditCategoriesOpenChange}
        assetName={assetName}
        initialCategories={categories || []}
        assetId={assetId}
      />
    </>
  );
};
