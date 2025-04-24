// // Ref: https://www.figma.com/design/3A6UJx5ZldaKxDwga6shM5/2.0%2F-Library?node-id=3873-15537&t=Lfj78tlzPZLpSxCF-4

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Spinner } from '@nextui-org/react';

import { FolderLink, FolderPaper, Globus } from '@tessact/icons';

import { AlertModal } from '@/components/ui/modal/AlertModal';

import { useDeleteAccessQuery } from '@/api-integration/queries/library';

import { SelectedLibraryItem } from '@/stores/library-store';

/*

Logic for deletion of files.
0. User triggers delete flow by clicking on the delete button.
1. *Check if user has delete access for all the selected items.* This means callign the has delete access API to get true or false.
2. If delete access is false, then show that cannot delete certain files modal, which has two actions: Cancel or Delete the rest.
   In the case, only 1 file is selected,then only one action: Yes, understood. which ends the flow.

3. If delete access is true, then check if any of the selected items have a connection_id. If yes, then show the delete connected items modal.
4. If step 3, returns true, then show the delete connected items modal which has two actions: Cancel or Delete.
6. If step 3, returns false, then directly call delete API for all the selected items.

*/

type ModalState = 'cannotDeleteCertainFiles' | 'deleteConnectedItems' | 'deleteNormal';

interface DeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedItems?: SelectedLibraryItem[];
  // The final delete action, to be triggered only at the end of the flow
  handleDelete: () => Promise<void> | void;
}

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  selectedItems = [],
  handleDelete
}: DeleteModalProps) => {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const { data: deleteAccessData, isLoading: isDeleteAccessLoading } = useDeleteAccessQuery(
    selectedItems?.map((item) => item.id) ?? [],
    isOpen
  );

  const hasConnectedItems = useMemo(() => {
    return selectedItems.some((item) => item.connection_id);
  }, [selectedItems]);

  // hasDeleteAccess returns true if none of the selected items are linked to a task, else false
  const hasDeleteAccess = deleteAccessData?.has_access;

  useEffect(() => {
    if (!isOpen) {
      setModalState(null);
    } else {
      if (!isDeleteAccessLoading) {
        if (hasDeleteAccess) {
          if (hasConnectedItems) {
            setModalState('deleteConnectedItems');
          } else {
            setModalState('deleteNormal');
          }
        } else if (hasDeleteAccess === false) {
          setModalState('cannotDeleteCertainFiles');
        } else {
          setModalState(null);
        }
      }
    }
  }, [isOpen, isDeleteAccessLoading, hasDeleteAccess, hasConnectedItems]);

  const handleDeleteFunc = useCallback(async () => {
    await handleDelete();
    setModalState(null);
    onOpenChange(false);
  }, [handleDelete, onOpenChange]);

  const handleDeleteRestFromCertainFiles = useCallback(async () => {
    if (selectedItems.length === 1) {
      // Exit the flow
      setModalState(null);
      onOpenChange(false);
      return;
    }
    if (hasConnectedItems) {
      setModalState('deleteConnectedItems');
    } else {
      handleDeleteFunc();
      // if (modalState === 'cannotDeleteCertainFiles') {
      //   return (
      // if (modalState === 'cannotDeleteCertainFiles') {
      //   return (
      //     <AlertModal
      //       isOpen={true}
      //       onOpenChange={() => {}}
      //       title=
    }
  }, [hasConnectedItems, handleDeleteFunc, selectedItems.length, onOpenChange]);

  const title = useMemo(() => {
    if (isDeleteAccessLoading) {
      return (
        <div className="flex w-full items-center justify-center">
          <Spinner color="primary" />
        </div>
      );
    }

    if (modalState === 'cannotDeleteCertainFiles') {
      if (selectedItems.length === 1) {
        return 'Cannot delete file. File is linked to a project.';
      } else {
        return 'Cannot delete certain files';
      }
    }
    if (modalState === 'deleteConnectedItems') {
      if (selectedItems.length === 1) {
        return 'Delete from connected source';
      } else {
        return 'Some files are connected to an external source';
      }
    }
    if (modalState === 'deleteNormal') {
      if (selectedItems.length === 1) {
        return 'Delete file';
      } else {
        return 'Delete files';
      }
    }
    return '';
  }, [modalState, selectedItems?.length, isDeleteAccessLoading]);

  const description = useMemo(() => {
    if (modalState === 'cannotDeleteCertainFiles') {
      if (selectedItems.length === 1) {
        return 'File is used in one of your projects. Delete the file from the project or the task and try this again.';
      } else {
        return "Your selected files are linked to tasks in your projects and can't be deleted.";
      }
    }
    if (modalState === 'deleteConnectedItems') {
      if (selectedItems.length === 1) {
        return 'Deleting this file will also delete it permanently  from your source.';
      } else {
        return 'This action will delete all the selected files from your library and the connected source, permanently.';
      }
    }
    if (modalState === 'deleteNormal') {
      if (selectedItems.length === 1) {
        return `Are you sure you want to permanently delete ${selectedItems?.[0]?.name}?`;
      } else {
        return `Are you sure you want to permanently delete ${selectedItems?.length} files?`;
      }
    }
    return '';
  }, [modalState, selectedItems]);

  const actionText = useMemo(() => {
    if (modalState === 'cannotDeleteCertainFiles') {
      if (selectedItems.length === 1) {
        return 'Yes, understood';
      } else {
        return 'Ok, Delete the rest';
      }
    }
    return 'Yes, Delete';
  }, [modalState, selectedItems?.length]);

  const primaryIcon = useMemo(() => {
    if (modalState === 'deleteConnectedItems') {
      return <DeleteConnectedPrimaryIcon />;
    }
    if (modalState === 'cannotDeleteCertainFiles') {
      return <FolderPaper size={44} className="text-ds-text-primary -rotate-6" />;
    }
    return undefined;
  }, [modalState]);

  const handleDeleteAction = useCallback(async () => {
    if (modalState === 'cannotDeleteCertainFiles') {
      await handleDeleteRestFromCertainFiles();
    } else {
      await handleDeleteFunc();
    }
  }, [modalState, handleDeleteFunc, handleDeleteRestFromCertainFiles]);

  return (
    <AlertModal
      isOpen={isOpen}
      onOpenChange={() => {}}
      customOnClose={() => {
        onOpenChange(false);
      }}
      title={title}
      description={description}
      onConfirm={async () => {
        await handleDeleteAction();
      }}
      actionText={actionText}
      columnLayout={modalState === 'cannotDeleteCertainFiles'}
      danger={!(modalState === 'cannotDeleteCertainFiles' && selectedItems.length === 1)}
      primaryIcon={primaryIcon}
      disableActions={isDeleteAccessLoading}
    />
  );
};

const DeleteConnectedPrimaryIcon = () => {
  return (
    <div className="flex items-center justify-between gap-3 text-ds-text-primary">
      <FolderLink size={44} />
      <div className="relative h-0.5 w-16 overflow-hidden rounded-full bg-default-300">
        <div className="absolute h-full w-full animate-indeterminate-bar bg-gradient-to-r from-transparent from-10% via-default-900/70  via-50% to-transparent to-90% transition-transform " />
      </div>
      <Globus size={44} />
    </div>
  );
};
