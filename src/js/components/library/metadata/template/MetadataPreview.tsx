'use client';

import { Dispatch, SetStateAction, useMemo } from 'react';

import { ScrollShadow } from '@/components/ui/ScrollShadow';
import { Tab, Tabs } from '@/components/ui/Tabs';

import { MetadataItem } from '@/components/library/metadata/MetadataItem';

import { MetadataTemplateCategoryAndFields } from '@/api-integration/types/metadata';

import { getPlaceholderValueFromType } from '@/utils/metadata';

interface MetadataPreviewProps {
  template: MetadataTemplateCategoryAndFields;
  selectedTab: string | null;
  setSelectedTab: Dispatch<SetStateAction<string | null>>;
}

export const MetadataPreview = ({
  template,
  selectedTab,
  setSelectedTab
}: MetadataPreviewProps) => {
  const fields = useMemo(() => {
    return template.find((tab) => tab.id === selectedTab)?.field_memberships || [];
  }, [selectedTab, template]);

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden rounded-[20px] bg-gradient-to-b from-primary-700 via-primary-500 to-primary-300 px-5 py-6">
      <div className="flex flex-col items-center gap-1">
        <p className="px-3 py-2 text-sm text-white">Preview</p>
        <Tabs
          aria-label="Metadata preview tabs"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="max-w-full overflow-hidden"
        >
          {template.map((tab) => (
            <Tab key={tab.id} value={tab.id} title={tab.name} />
          ))}
        </Tabs>
      </div>
      <div className="h-full rounded-[20px] bg-background-100 p-8">
        {fields.length > 0 ? (
          <ScrollShadow className="h-full min-h-full pb-14">
            {fields.map((field) => (
              <MetadataItem
                key={field.id}
                label={field.field.name}
                value={getPlaceholderValueFromType(field.field.field_type)}
                type={field.field.field_type}
              />
            ))}
          </ScrollShadow>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <h3 className="text-lg">No metadata fields added</h3>
            <p className="text-sm text-ds-text-secondary">
              Start by adding new fields to this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
