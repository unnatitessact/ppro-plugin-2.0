import { useMemo } from 'react';

import * as ContextMenu from '@radix-ui/react-context-menu';

import { DotGrid1X3Horizontal } from '@tessact/icons';

import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { ScrollShadow } from '@/components/ui/ScrollShadow';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@/components/ui/Table';

import {
  AttachmentCell,
  DateCell,
  LocationCell,
  MultiSelectCell,
  NumberCell,
  PersonCell,
  RatingCell,
  SelectCell,
  TextareaCell,
  TextCell,
  TimecodeCell,
  TimecodeRangeCell,
  ToggleCell
} from '@/components/library/metadata/editable/table';
import { MetadataSkeleton } from '@/components/skeletons/MetadataSkeleton';

import { useDeleteMetadataField, useDeleteMetadataRow } from '@/api-integration/mutations/metadata';
import {
  AttachmentValue,
  LocationValue,
  MetadataTableCategoryField,
  MetadataTableRowValueInstance,
  MultiselectValue,
  PersonValue,
  SelectValue,
  TimecodeRangeValue
} from '@/api-integration/types/metadata';

interface TableMetadataProps {
  data: MetadataTableCategoryField;
  isLoading: boolean;
  categoryId: string;
}

export const TableMetadata = ({ data, isLoading, categoryId }: TableMetadataProps) => {
  const { mutate: deleteRow, isPending: isDeletingRow } = useDeleteMetadataRow(categoryId);
  const { mutate: deleteField } = useDeleteMetadataField(categoryId);

  const renderCell = (valueInstance: MetadataTableRowValueInstance, rowId: string) => {
    if (valueInstance.id === 'actions') {
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" isLoading={isDeletingRow} aria-label="More options">
              <DotGrid1X3Horizontal size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(action) => {
              if (action === 'delete-row') {
                deleteRow(rowId);
              }
            }}
          >
            <DropdownItem key="delete-row">Delete row</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    }

    const fieldData = data.field_memberships.find(
      (field) => field.id === valueInstance.field_membership
    );

    const field = fieldData?.field;

    if (!field) {
      return <p>Field not found</p>;
    }

    switch (field.field_type) {
      case 'text':
        return (
          <TextCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as string}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'text_area':
        return (
          <TextareaCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as string}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'person':
        return (
          <PersonCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as PersonValue}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'date':
        return (
          <DateCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as string}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'location':
        return (
          <LocationCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as LocationValue}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'toggle':
        return (
          <ToggleCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as boolean}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'rating':
        return (
          <RatingCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as number}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'timecode':
        return (
          <TimecodeCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as string}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'timecode_range':
        return (
          <TimecodeRangeCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as TimecodeRangeValue}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'attachment':
        return (
          <AttachmentCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as AttachmentValue}
            label={field.name}
            rowId={rowId}
          />
        );
      case 'select':
        return (
          <SelectCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as SelectValue}
            label={field.name}
            rowId={rowId}
            options={fieldData.options}
            fieldMembershipId={fieldData.id}
          />
        );
      case 'multiselect':
        return (
          <MultiSelectCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as MultiselectValue}
            label={field.name}
            rowId={rowId}
            options={fieldData.options}
            fieldMembershipId={fieldData.id}
          />
        );
      case 'number':
        return (
          <NumberCell
            categoryId={categoryId}
            fieldId={valueInstance.id}
            value={valueInstance.value as number}
            label={field.name}
            rowId={rowId}
          />
        );
      default:
        return null;
    }
  };

  const columns = useMemo(() => {
    return (
      data?.field_memberships.map((field) => ({
        key: field.id,
        label: field.field.name
      })) || []
    ).concat({ key: 'actions', label: '' });
  }, [data?.field_memberships]);

  const rows = useMemo(() => data?.rows.map((row) => row) || [], [data]);

  if (!data?.field_memberships || data?.field_memberships?.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-ds-text-secondary">Add a field to get started</p>
      </div>
    );
  }

  const handleThreeDotMenuAction = (action: string, fieldId: string) => {
    if (action === 'delete-column') {
      deleteField(fieldId);
    }
  };

  return (
    <ScrollShadow className="px-3">
      {isLoading ? (
        <MetadataSkeleton />
      ) : (
        <Table>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>
                <ContextMenu.Root>
                  <ContextMenu.Trigger>{column.label} </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Content className="z-50 data-[state=open]:animate-custom-in">
                      <Listbox
                        onAction={(key) => handleThreeDotMenuAction(key as string, column.key)}
                      >
                        <ListboxItem key="delete-column">Delete column</ListboxItem>
                      </Listbox>
                    </ContextMenu.Content>
                  </ContextMenu.Portal>
                </ContextMenu.Root>
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(row) => (
              <TableRow key={row.id} className="relative">
                {row.value_instances
                  .concat({ id: 'actions', field_membership: '', value: '' })
                  .map((instance) => (
                    <TableCell className="pl-5" key={instance.id}>
                      {renderCell(instance, row.id)}
                    </TableCell>
                  ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </ScrollShadow>
  );
};
