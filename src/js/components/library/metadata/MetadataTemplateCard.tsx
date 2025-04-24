'use client';

import { Key } from 'react';

import { useRouter } from 'next/navigation';

import { cn, useDisclosure } from '@nextui-org/react';
import pluralize from 'pluralize';

import { DotGrid1X3Horizontal } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { AlertModal } from '@/components/ui/modal/AlertModal';

import { User } from '@/components/library/metadata/User';

import { useRenameMetadataTemplate } from '@/api-integration/mutations/metadata';

interface MetadataTemplateCardProps {
  templateId: string;
  templateName: string;
  categoryCount: number;
  // fieldCount: number;
  createdBy: {
    name: string;
    avatar: string;
  };
  hasPermission?: boolean;
  onSelect: () => void;
}

export const MetadataTemplateCard = ({
  templateId,
  templateName,
  categoryCount,
  // fieldCount,
  createdBy,
  hasPermission = false,
  onSelect
}: MetadataTemplateCardProps) => {
  const {
    isOpen: isRenameOpen,
    onOpen: onRenameOpen,
    onOpenChange: onRenameOpenChange
  } = useDisclosure();

  const router = useRouter();

  const handleAction = (key: Key) => {
    if (key === 'rename') {
      onRenameOpen();
    }
    if (key === 'edit') {
      router.push(`/settings/metadata-templates/${templateId}`);
    }
  };

  const { mutate: renameMetadataTemplate } = useRenameMetadataTemplate(templateId);

  return (
    <>
      <div
        className={cn(
          'bg-ds-menu-bg',
          'flex flex-col rounded-xl p-4',
          'transition hover:bg-ds-menu-bg-hover',
          'group cursor-pointer'
        )}
        onClick={onSelect}
      >
        <div className="flex min-h-8 items-center justify-between gap-2">
          <h3 className="truncate">{templateName}</h3>
          {hasPermission && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  className="opacity-0 group-hover:opacity-100"
                  size="sm"
                  aria-label="More options"
                >
                  <DotGrid1X3Horizontal size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={handleAction}>
                <DropdownItem key="rename">Rename</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm text-ds-text-secondary">
            {categoryCount} {pluralize('category', categoryCount)}
            {/* {fieldCount}{' '} {pluralize('field', fieldCount)} */}
          </p>
          <User image={createdBy.avatar} name={createdBy.name} />
        </div>
      </div>
      <AlertModal
        isOpen={isRenameOpen}
        onOpenChange={onRenameOpenChange}
        title="Rename Template"
        description={templateName}
        onConfirm={(value) => renameMetadataTemplate(value)}
        hasInput
        inputPlaceholder="New Template Name"
        defaultValue={templateName}
      />
    </>
  );
};
