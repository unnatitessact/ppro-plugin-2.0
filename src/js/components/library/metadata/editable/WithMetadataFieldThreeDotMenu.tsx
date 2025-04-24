import { Key, ReactNode } from 'react';

import * as ContextMenu from '@radix-ui/react-context-menu';

import { Listbox, ListboxItem } from '@/components/ui/Listbox';

interface WithMetadataFieldThreeDotMenuProps {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export const WithMetadataFieldThreeDotMenu = ({
  children,
  onEdit,
  onDelete
}: WithMetadataFieldThreeDotMenuProps) => {
  const handleAction = (value: Key) => {
    if (value === 'edit') {
      onEdit();
    } else if (value === 'delete') {
      onDelete();
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="z-50 min-w-[200px] data-[state=open]:animate-custom-in">
          <Listbox
            onAction={handleAction}
            classNames={{ base: 'border border-ds-menu-border', list: 'p-1' }}
          >
            <ListboxItem key="edit" as={ContextMenu.Item}>
              Edit
            </ListboxItem>
            <ListboxItem key="delete" as={ContextMenu.Item}>
              Delete
            </ListboxItem>
          </Listbox>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};
