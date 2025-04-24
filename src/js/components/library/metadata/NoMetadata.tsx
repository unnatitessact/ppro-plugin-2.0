import { useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { MetadataTemplatesListEmptyState } from '@/components/empty-state/MetadataTemplatesListEmptyState';
import { MetadataTemplateCard } from '@/components/library/metadata/MetadataTemplateCard';
import { PreviewTemplate } from '@/components/library/metadata/PreviewTemplate';
import { Searchbar } from '@/components/Searchbar';
import { MetadataTemplateCardSkeleton } from '@/components/skeletons/MetadataTemplateCardSkeleton';

import { useAddNewMetadataCategory } from '@/api-integration/mutations/metadata';
import { useMetadataTemplatesQuery } from '@/api-integration/queries/metadata';

export const NoMetadata = () => {
  const [search, setSearch] = useState('');
  const [templateToPreview, setTemplateToPreview] = useState<string | null>(null);

  const { assetId, folderId } = useParams() as { assetId: string; folderId: string };

  const { data: metadataTemplates, isLoading: isMetadataTemplatesLoading } =
    useMetadataTemplatesQuery();

  const { mutate: addNewMetadataCategory, isPending } = useAddNewMetadataCategory(
    assetId || folderId
  );

  const filteredTemplates = useMemo(() => {
    return (
      metadataTemplates?.filter((template) =>
        template.name.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [search, metadataTemplates]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false}>
        {!templateToPreview && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.2 }}
            key="no-metadata"
            className="absolute flex h-full flex-col gap-8 px-3"
          >
            <header className="space-y-5">
              <div className="space-y-1">
                <span className="text-sm text-ds-text-secondary">Metadata</span>
                <p>
                  Metadata adds searchable details to media and folders, enhancing organization.
                </p>
              </div>
              <Button
                color="secondary"
                onPress={() => addNewMetadataCategory({ name: 'General', isTable: false })}
                isLoading={isPending}
                aria-label="Start from scratch"
              >
                Start from scratch
              </Button>
            </header>
            <div className="flex h-full flex-col gap-4 overflow-hidden">
              <span className="text-sm text-ds-text-secondary">Start with a Template</span>
              <Searchbar placeholder="Search templates" value={search} onValueChange={setSearch} />
              <ScrollShadow className="flex h-full flex-col gap-2 pb-8">
                {isMetadataTemplatesLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <MetadataTemplateCardSkeleton key={index} />
                  ))
                ) : filteredTemplates.length === 0 ? (
                  <MetadataTemplatesListEmptyState />
                ) : (
                  filteredTemplates.map((template) => (
                    <MetadataTemplateCard
                      key={template.id}
                      templateId={template.id}
                      templateName={template.name}
                      categoryCount={template.total_categories}
                      createdBy={{
                        name: template.created_by.profile.display_name,
                        avatar: template.created_by.profile.profile_picture
                      }}
                      hasPermission
                      onSelect={() => setTemplateToPreview(template.id)}
                    />
                  ))
                )}
              </ScrollShadow>
            </div>
          </motion.div>
        )}
        {templateToPreview && (
          <PreviewTemplate
            key="preview-template"
            assetId={assetId || folderId}
            templateToPreview={templateToPreview}
            setTemplateToPreview={setTemplateToPreview}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
