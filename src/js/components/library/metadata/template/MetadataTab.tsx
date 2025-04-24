'use client';

import { Dispatch, Key, SetStateAction } from 'react';

import { useParams } from 'next/navigation';

import { cn, useDisclosure } from '@nextui-org/react';

import { BulletList, DotGrid1X3Horizontal, Table } from '@tessact/icons';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { AlertModal } from '@/components/ui/modal/AlertModal';

import {
  useRemoveCategoryFromTemplate,
  useRenameCategoryInTemplate
} from '@/api-integration/mutations/metadata';
import {
  BaseMetadataTemplateCategory,
  MetadataTemplateCategoryAndFields
} from '@/api-integration/types/metadata';

interface MetadataTabProps {
  tab: BaseMetadataTemplateCategory;
  isSelected: boolean;
  onClick: () => void;
  setTemplate: Dispatch<SetStateAction<MetadataTemplateCategoryAndFields>>;
  isSoleCategory?: boolean;
}

export const MetadataTab = ({
  tab,
  isSelected,
  onClick,
  setTemplate,
  isSoleCategory
}: MetadataTabProps) => {
  const { templateId } = useParams() as { templateId: string };

  const { mutate: removeCategoryFromTemplate } = useRemoveCategoryFromTemplate(templateId, tab.id);
  const { mutateAsync: renameCategoryInTemplate } = useRenameCategoryInTemplate(templateId, tab.id);

  const {
    isOpen: isRenameModalOpen,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose
  } = useDisclosure();

  const handleAction = (action: Key) => {
    if (action === 'rename') {
      onRenameModalOpen();
    } else {
      onDeleteModalOpen();
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between gap-3',
          'rounded-xl px-3 py-2',
          'transition hover:bg-ds-link-bg-hover',
          'cursor-pointer',
          'text-sm font-medium',
          'group',
          isSelected && 'bg-ds-link-bg-selected hover:bg-ds-link-bg-selected'
        )}
        onClick={onClick}
      >
        <div className="flex w-full flex-1 items-center gap-3">
          <div className="flex-shrink-0">
            {!tab.is_table ? <BulletList size={20} /> : <Table size={20} />}
          </div>
          <p className="truncate">{tab.name}</p>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <div className="opacity-0 transition group-hover:opacity-100">
              <DotGrid1X3Horizontal size={20} />
            </div>
          </DropdownTrigger>
          <DropdownMenu onAction={handleAction} disabledKeys={isSoleCategory ? ['delete'] : []}>
            <DropdownItem key="rename">Rename</DropdownItem>
            <DropdownItem key="delete">Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <AlertModal
        isOpen={isRenameModalOpen}
        onOpenChange={onRenameModalClose}
        title="Rename Metadata Category"
        description={tab.name}
        onConfirm={async (value) =>
          await renameCategoryInTemplate(value, {
            onSuccess: () => {
              setTemplate((prev) =>
                prev.map((category) =>
                  category.id === tab.id ? { ...category, name: value } : category
                )
              );
            }
          })
        }
        hasInput
        inputPlaceholder="New Category Name"
        defaultValue={tab.name}
      />
      <AlertModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalClose}
        title="Delete Metadata Category"
        description={`Are you sure you want to delete ${tab.name} category?`}
        onConfirm={() => {
          removeCategoryFromTemplate(undefined, {
            onSuccess: () => {
              setTemplate((prev) => prev.filter((category) => category.id !== tab.id));
            }
          });
        }}
        danger
        actionText="Delete"
      />
    </>
  );
};
