import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import pluralize from 'pluralize';

import { ArrowLeft } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { ScrollShadow } from '@/components/ui/ScrollShadow';
import { Tab, Tabs } from '@/components/ui/Tabs';

import { User } from '@/components/library/metadata/User';
import { MetadataSkeleton } from '@/components/skeletons/MetadataSkeleton';

import { useApplyMetadataTemplate } from '@/api-integration/mutations/metadata';
import { useMetadataTemplateQuery } from '@/api-integration/queries/metadata';

import { getIconFromType, getLabelFromType } from '@/utils/metadata';

interface PreviewTemplateProps {
  assetId: string;
  templateToPreview: string;
  setTemplateToPreview: (templateToPreview: string | null) => void;
}

export const PreviewTemplate = ({
  assetId,
  templateToPreview,
  setTemplateToPreview
}: PreviewTemplateProps) => {
  const { data: template, isLoading } = useMetadataTemplateQuery(templateToPreview);

  const categoryCount = template?.categories.length;
  const fieldCount = template?.categories.reduce(
    (acc, curr) => acc + curr.field_memberships.length,
    0
  );

  const [selectedTab, setSelectedTab] = useState<string | null>(template?.categories[0].id || null);

  const fields = useMemo(() => {
    return template?.categories.find((tab) => tab.id === selectedTab)?.field_memberships || [];
  }, [selectedTab, template]);

  const { mutate: applyTemplate, isPending } = useApplyMetadataTemplate(templateToPreview, assetId);

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.2 }}
      className="absolute flex h-full w-full flex-col gap-5 px-3"
      key="preview-template"
    >
      {isLoading || !template ? (
        <MetadataSkeleton />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-6">
              <Button
                isIconOnly
                color="secondary"
                onPress={() => setTemplateToPreview(null)}
                aria-label="Back to library"
              >
                <ArrowLeft size={20} />
              </Button>
              <Button
                color="secondary"
                onPress={() => applyTemplate()}
                isLoading={isPending}
                aria-label="Apply template"
              >
                Apply template
              </Button>
            </div>
            <header className="flex items-end justify-between gap-6">
              <div className="flex flex-col">
                <h3>{template.name}</h3>
                <p className="text-sm text-ds-text-secondary">
                  {categoryCount} {pluralize('category', categoryCount)}, {fieldCount}{' '}
                  {pluralize('field', fieldCount)}
                </p>
              </div>
              <User
                name={template.created_by.profile.display_name}
                image={template.created_by.profile.profile_picture}
                firstName={template.created_by.profile.first_name}
                lastName={template.created_by.profile.last_name}
                email={template.created_by.email}
                color={template.created_by.profile.color}
                displayName={template.created_by.profile.display_name}
              />
            </header>
          </div>
          <Tabs
            onSelectionChange={(key) => setSelectedTab(key as string)}
            selectedKey={selectedTab}
          >
            {template.categories.map((category) => (
              <Tab key={category.id} title={category.name}></Tab>
            ))}
          </Tabs>
          <ScrollShadow className="flex h-full flex-col gap-1 pb-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between px-2 py-3">
                <p className="text-ds-text-secondary">{field.field.name}</p>
                <div className="flex items-center gap-2">
                  {getIconFromType(field.field.field_type)}
                  <p className="text-sm">{getLabelFromType(field.field.field_type)}</p>
                </div>
              </div>
            ))}
          </ScrollShadow>
        </>
      )}
    </motion.div>
  );
};
