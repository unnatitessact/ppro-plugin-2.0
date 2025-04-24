'use client';

import type { DragEndEvent } from '@dnd-kit/core';

import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';

import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { AddMetadataField } from '@/components/library/metadata/AddMetadataField';
import { DnDMetadataField } from '@/components/library/metadata/template/DnDMetadataField';
import { MetadataTab } from '@/components/library/metadata/template/MetadataTab';

import {
  useAddMetadataFieldToCategory,
  useRemoveFieldFromCategory,
  useReorderFieldsInTemplateCategory
} from '@/api-integration/mutations/metadata';
import { MetadataTemplateCategoryAndFields } from '@/api-integration/types/metadata';

interface CreateMetadataTemplateProps {
  template: MetadataTemplateCategoryAndFields;
  setTemplate: Dispatch<SetStateAction<MetadataTemplateCategoryAndFields>>;
  selectedTab: string | null;
  setSelectedTab: Dispatch<SetStateAction<string | null>>;
}

export const CreateMetadataTemplate = ({
  template,
  setTemplate,
  selectedTab,
  setSelectedTab
}: CreateMetadataTemplateProps) => {
  useEffect(() => {
    if (!selectedTab && template[0]) {
      setSelectedTab(template[0].id);
    }
  }, [template, selectedTab, setSelectedTab]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const fields = useMemo(() => {
    return template.find((tab) => tab.id === selectedTab)?.field_memberships || [];
  }, [template, selectedTab]);

  const { templateId } = useParams() as { templateId: string };

  const { mutate: reorderFieldsInTemplateCategory } = useReorderFieldsInTemplateCategory(
    templateId,
    selectedTab || ''
  );

  const onDragEnd = (event: DragEndEvent) => {
    // Reorder the fields of the selected field
    const { active, over } = event;

    if (active.id !== over?.id) {
      const newTemplate = template.map((tab) => {
        if (tab.id === selectedTab) {
          const oldFields = tab.field_memberships;
          const oldIndex = oldFields.findIndex((field) => field.id === active.id);
          const newIndex = oldFields.findIndex((field) => field.id === over?.id);

          reorderFieldsInTemplateCategory(
            arrayMove(oldFields, oldIndex, newIndex).map((field) => field.id)
          );

          return {
            ...tab,
            field_memberships: arrayMove(oldFields, oldIndex, newIndex)
          };
        }
        return tab;
      });
      setTemplate(newTemplate);
    }
  };

  const { mutate: addMetadataFieldToCategory } = useAddMetadataFieldToCategory(
    templateId,
    selectedTab || ''
  );

  const { mutate: removeFieldFromCategory } = useRemoveFieldFromCategory(templateId);

  return (
    <div className="flex h-full gap-4 rounded-[20px] border border-default-200 p-4">
      <div className="flex w-1/4 max-w-sm flex-col gap-1">
        <p className="px-3 py-2 text-sm text-ds-text-secondary">Categories</p>
        <div className="flex flex-col gap-1">
          {template.map((tab) => (
            <MetadataTab
              key={tab.id}
              tab={tab}
              isSelected={selectedTab === tab.id}
              onClick={() => setSelectedTab(tab.id)}
              setTemplate={setTemplate}
              isSoleCategory={template.length === 1}
            />
          ))}
        </div>
      </div>
      <div className="relative flex flex-1 flex-col gap-1">
        <p className="px-3 pt-2 text-sm text-ds-text-secondary">Fields</p>
        <AddMetadataField
          onAdd={(field) =>
            addMetadataFieldToCategory(field.id, {
              onSuccess: (data) => {
                setTemplate((prev) =>
                  prev.map((tab) =>
                    tab.id === selectedTab
                      ? { ...tab, field_memberships: [...tab.field_memberships, data] }
                      : tab
                  )
                );
              }
            })
          }
        />
        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <ScrollShadow className="h-full" showBottomBorder={true}>
            <div className="flex h-full flex-col gap-1">
              <SortableContext items={fields.map((field) => field.id) || []}>
                {fields.map((field) => (
                  <DnDMetadataField
                    key={field.id}
                    label={field.field.name}
                    type={field.field.field_type}
                    fieldMembershipId={field.id}
                    id={field.id}
                    options={field.options || []}
                    onRemove={() =>
                      removeFieldFromCategory(field.id, {
                        onSuccess: () => {
                          setTemplate((prev) =>
                            prev.map((tab) =>
                              tab.id === selectedTab
                                ? {
                                    ...tab,
                                    field_memberships: tab.field_memberships.filter(
                                      (f) => f.id !== field.id
                                    )
                                  }
                                : tab
                            )
                          );
                        }
                      })
                    }
                  />
                ))}
              </SortableContext>
            </div>
          </ScrollShadow>
        </DndContext>
      </div>
    </div>
  );
};
