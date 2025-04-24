import type { Key, ReactNode } from "react";

import {
  useCallback,
  // useCallback,
  useMemo,
  useRef,
} from "react";

import { useParamsStateStore } from "@/stores/params-state-store";

// import { useParams, useRouter } from "next/navigation";

import { cn, useDisclosure } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { useDropzone } from "react-dropzone";

// import { useMergedRef } from '@mantine/hooks';

import { ChevronRightSmall, CloudUpload } from "@tessact/icons";

import { Listbox, ListboxItem, ListboxSection } from "@/components/ui/Listbox";

import { NewCanvasModal } from "@/components/library/modals/canvas/NewCanvasModal";
import { NewDocumentModal } from "@/components/library/modals/documents/NewDocumentModal";
import { NewVideoDraftModal } from "@/components/library/modals/editor/NewVideoDraftModal";
import { NewPhysicalAssetModal } from "@/components/library/modals/physical-assets/NewPhysicalAssetModal";
import { LibraryViewsPopoverContent } from "@/components/library/popovers/LibraryViewsPopover";

import { useFileUpload } from "@/hooks/useFileUpload";

import { useAssetDetailsQuery } from "@/api-integration/queries/library";

// import { useSearchActions, useSearchCommands } from '@/hooks/useSearch';

import { useLibraryStore } from "@/stores/library-store";
import { useSearchActionsStore } from "@/stores/search-actions-store";

interface WithLibraryThreeDotMenuProps {
  children: ReactNode;
  onLibraryRoot?: boolean;
  onSelectAll: () => void;
}

export const WithLibraryThreeDotMenu = ({
  children,
  onLibraryRoot,
  onSelectAll,
}: WithLibraryThreeDotMenuProps) => {
  //   const router = useRouter();
  //   const params = useParams() as { folderId?: string };

  const { folderId } = useParamsStateStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    toggleFilterBar,
    toggleSortBar,
    setIsSearchExpanded,
    selectedItems,
    setSelectedItems,
  } = useLibraryStore();

  // const mergedRef = useMergedRef(inputRef, inputFileRef);

  // const {
  //   isOpen: isNewFolderModalOpen,
  //   onOpen: onNewFolderModalOpen,
  //   onOpenChange: onNewFolderModalOpenChange
  // } = useDisclosure();

  // const {
  //   isOpen: isNewConnectedFolderModalOpen,
  //   onOpen: onNewConnectedFolderModalOpen,
  //   onOpenChange: onNewConnectedFolderModalOpenChange
  // } = useDisclosure();

  const { onNewFolderOpenChange, onNewConnectedFolderOpenChange } =
    useSearchActionsStore();

  const {
    isOpen: isNewPhysicalAssetModalOpen,
    onOpen: onNewPhysicalAssetModalOpen,
    onOpenChange: onNewPhysicalAssetModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isNewDocumentModalOpen,
    onOpen: onNewDocumentModalOpen,
    onOpenChange: onNewDocumentModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isNewCanvasModalOpen,
    onOpen: onNewCanvasModalOpen,
    onOpenChange: onNewCanvasModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isNewVideoDraftModalOpen,
    onOpen: onNewVideoDraftModalOpen,
    onOpenChange: onNewVideoDraftModalOpenChange,
  } = useDisclosure();

  const onFolderDropdownMenuAction = (key: Key) => {
    if (key === "new-folder") {
      onNewFolderOpenChange();
    }
    if (key === "new-connected-folder") {
      onNewConnectedFolderOpenChange();
    }
    if (key === "new-physical-asset") {
      onNewPhysicalAssetModalOpen();
    }
    if (key === "new-document") {
      onNewDocumentModalOpen();
    }
    if (key === "new-canvas") {
      onNewCanvasModalOpen();
    }
    if (key === "new-video-draft") {
      onNewVideoDraftModalOpen();
    }
  };

  const handleAction = (key: Key) => {
    if (key === "select-all") {
      if (selectedItems.length > 0) {
        setSelectedItems([]);
      } else {
        onSelectAll();
      }
    }
    if (key === "back") {
      //   router.back();
    }
    if (key === "filter") {
      toggleFilterBar();
    }
    if (key === "sort") {
      toggleSortBar();
    }
    if (key === "search") {
      setIsSearchExpanded(true);
    }
  };

  const { data: folderDetails } = useAssetDetailsQuery(folderId ?? "");

  const hasFolderEditPermission =
    folderId ||
    (folderDetails && folderDetails?.permissions?.includes("can_edit_asset"));

  interface Item {
    key: string;
    label: string;
    isDisabled?: boolean;
  }

  const items: Item[] = useMemo(() => {
    return [
      {
        key: "select-all",
        label: selectedItems.length > 0 ? "Deselect all" : "Select all",
      },
      { key: "back", label: "Back", isDisabled: onLibraryRoot },
      { key: "search", label: "Search" },
      { key: "filter", label: "Filter" },
      { key: "sort", label: "Sort" },
      { key: "upload", label: "Upload", isDisabled: !hasFolderEditPermission },
    ];
  }, [onLibraryRoot, selectedItems.length, hasFolderEditPermission]);

  const { uploadFile } = useFileUpload("library", folderId || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadFile(file);
      });
    },
    [uploadFile]
  );

  const uploadFiles = (files: File[]) => {
    files.forEach((file) => {
      uploadFile(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <>
      <ContextMenu.Root modal={false}>
        <ContextMenu.Trigger className="block h-full" {...getRootProps()}>
          {children}
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="z-50 data-[state=open]:animate-custom-in">
            <Listbox
              onAction={handleAction}
              classNames={{ base: "border border-ds-menu-border", list: "p-1" }}
            >
              <ListboxSection>
                <ListboxItem
                  className={cn(!hasFolderEditPermission && "hidden")}
                  isDisabled={!hasFolderEditPermission}
                >
                  {hasFolderEditPermission && (
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className="flex items-center justify-between gap-5 outline-none">
                        New
                        <ChevronRightSmall size={20} />
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.SubContent
                          className="z-50 data-[state=closed]:animate-custom-out data-[state=open]:animate-custom-in"
                          sideOffset={24}
                          alignOffset={-14}
                        >
                          <Listbox
                            onAction={onFolderDropdownMenuAction}
                            classNames={{
                              base: "border border-ds-menu-border",
                              list: "p-1",
                            }}
                          >
                            <ListboxItem key="new-folder" as={ContextMenu.Item}>
                              New folder
                            </ListboxItem>
                            <ListboxItem
                              key="new-connected-folder"
                              as={ContextMenu.Item}
                            >
                              New connected folder
                            </ListboxItem>
                            <ListboxItem
                              key="new-physical-asset"
                              as={ContextMenu.Item}
                            >
                              New physical asset
                            </ListboxItem>
                            <ListboxItem
                              key="new-document"
                              as={ContextMenu.Item}
                            >
                              New document
                            </ListboxItem>
                            <ListboxItem key="new-canvas" as={ContextMenu.Item}>
                              New canvas
                            </ListboxItem>
                            <ListboxItem
                              key="new-video-draft"
                              as={ContextMenu.Item}
                            >
                              New video draft
                            </ListboxItem>
                          </Listbox>
                        </ContextMenu.SubContent>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                  )}
                </ListboxItem>
                <ListboxItem>
                  <ContextMenu.Sub>
                    <ContextMenu.SubTrigger className="flex items-center justify-between gap-5 outline-none">
                      View
                      <ChevronRightSmall size={20} />
                    </ContextMenu.SubTrigger>
                    <ContextMenu.Portal>
                      <ContextMenu.SubContent
                        className="z-50 data-[state=closed]:animate-custom-out data-[state=open]:animate-custom-in"
                        sideOffset={24}
                        alignOffset={-8}
                      >
                        <div className="rounded-xl border border-ds-menu-border bg-ds-menu-bg p-2 text-sm font-medium">
                          <LibraryViewsPopoverContent />
                        </div>
                      </ContextMenu.SubContent>
                    </ContextMenu.Portal>
                  </ContextMenu.Sub>
                </ListboxItem>
              </ListboxSection>
              <ListboxSection>
                {items
                  .filter((item) => !item.isDisabled)
                  .map((item) => {
                    return (
                      <ListboxItem key={item.key} as={ContextMenu.Item}>
                        {item.label}
                      </ListboxItem>
                    );
                  })}
              </ListboxSection>
            </Listbox>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <NewPhysicalAssetModal
        isOpen={isNewPhysicalAssetModalOpen}
        onOpenChange={onNewPhysicalAssetModalOpenChange}
      />
      <NewDocumentModal
        isOpen={isNewDocumentModalOpen}
        onOpenChange={onNewDocumentModalOpenChange}
      />
      <NewCanvasModal
        isOpen={isNewCanvasModalOpen}
        onOpenChange={onNewCanvasModalOpenChange}
      />
      <NewVideoDraftModal
        isOpen={isNewVideoDraftModalOpen}
        onOpenChange={onNewVideoDraftModalOpenChange}
      />
      <div
        className={cn("pointer-events-none absolute top-0 z-100 h-full w-full")}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "absolute -bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/4",
            "aspect-square w-3/4",
            "backdrop-blur-sm",
            "rounded-tl-full rounded-tr-full",
            isDragActive ? "opacity-100" : "opacity-0",
            "transition"
          )}
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #000000 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          <div className="absolute left-1/2 top-[12%] flex flex-col items-center gap-2.5 -translate-x-1/2">
            <CloudUpload size={32} />
            <p className="text-center text-sm font-medium">
              Drop files to upload
            </p>
          </div>
        </div>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            uploadFiles(Array.from(e.target.files || []));
          }}
          hidden
          multiple
        />
      </div>
    </>
  );
};
