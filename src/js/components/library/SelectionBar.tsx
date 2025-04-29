"use client";

// import { useParams } from "next/navigation";

import { useParams } from "react-router-dom";
import { usePreferences } from "@/context/preferences";
import { cn, useDisclosure } from "@nextui-org/react";
import { motion } from "framer-motion";
import pluralize from "pluralize";
import { toast } from "sonner";

import {
  Clipboard2,
  // CloudDownload,
  CrossSmall,
  SquareBehindSquare2,
  SquareDotedBehindSquare,
  TrashCan,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import {
  ToastError,
  ToastProcess,
  ToastSuccess,
} from "@/components/ui/ToastContent";

import {
  useCopyAssets,
  useDeleteAssets,
  useMoveAssets,
} from "@/api-integration/mutations/library";

import { useLibraryStore } from "@/stores/library-store";

export const SelectionBar = () => {
  const {
    selectedItems,
    clearSelectedItems,
    selectedClipboardAction,
    setSelectedClipboardAction,
  } = useLibraryStore();

  const folderId = useParams().folderId as string;

  const { mutateAsync: copyAssets } = useCopyAssets(folderId || null);
  const { mutateAsync: moveAssets } = useMoveAssets();
  const { mutateAsync: deleteAssets } = useDeleteAssets();

  const { preferences } = usePreferences();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: -16 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "left-0 rounded-2xl px-4 py-2",
          "flex items-center justify-between gap-5",
          selectedClipboardAction
            ? "bg-ds-button-primary-bg text-ds-button-primary-text"
            : "bg-ds-button-default-bg text-ds-button-default-text",
          "absolute bottom-0 z-50",
          "transition-colors",
          preferences?.preference?.help_bubble_enabled ? "right-20" : "right-6"
        )}
      >
        <p>
          {selectedItems.length} {pluralize("item", selectedItems.length)}{" "}
          {selectedClipboardAction === "copy"
            ? "copied"
            : selectedClipboardAction === "cut"
            ? "cut"
            : "selected"}
        </p>
        <div className="flex items-center gap-1">
          {selectedClipboardAction === "copy" ||
          selectedClipboardAction === "cut" ? (
            <>
              <Button
                color="primary"
                startContent={<Clipboard2 size={20} />}
                key="paste"
                aria-label="Paste assets"
                onPress={() => {
                  if (selectedClipboardAction === "copy") {
                    toast.promise(
                      copyAssets(selectedItems.map((item) => item.id)),
                      {
                        loading: <ToastProcess title="Copying assets" />,
                        success: <ToastSuccess title="Assets copied" />,
                        error: <ToastError title="Failed to copy assets" />,
                      }
                    );
                  } else {
                    toast.promise(
                      moveAssets({
                        items: selectedItems.map((item) => item.id),
                        destinationFolderId: folderId || null,
                      }),
                      {
                        loading: <ToastProcess title="Moving assets" />,
                        success: <ToastSuccess title="Assets moved" />,
                        error: <ToastError title="Failed to move assets" />,
                      }
                    );
                  }
                  clearSelectedItems();
                  setSelectedClipboardAction(null);
                }}
              >
                Paste here
              </Button>
              <Button
                color="primary"
                isIconOnly
                onPress={() => setSelectedClipboardAction(null)}
                key="cancel"
                aria-label="Selection bar cancel"
              >
                <CrossSmall size={20} />
              </Button>
            </>
          ) : (
            <>
              <Button
                color="default"
                startContent={<TrashCan size={20} />}
                onPress={onDeleteModalOpen}
                key="delete"
                aria-label="Delete assets"
              >
                Delete
              </Button>
              {/* <Button
              color="default"
              startContent={<CloudDownload size={20} />}
              onPress={() => {}}
              key="download"
            >
              Download
            </Button> */}
              <Button
                color="default"
                startContent={<SquareDotedBehindSquare size={20} />}
                onPress={() => setSelectedClipboardAction("cut")}
                key="cut"
                aria-label="Cut assets"
              >
                Cut
              </Button>
              <Button
                color="default"
                startContent={<SquareBehindSquare2 size={20} />}
                onPress={() => setSelectedClipboardAction("copy")}
                key="copy"
                aria-label="Copy assets"
              >
                Copy
              </Button>
              <Button
                color="default"
                isIconOnly
                onPress={clearSelectedItems}
                key="cancel"
                aria-label="Selection bar cancel"
              >
                <CrossSmall size={20} />
              </Button>
            </>
          )}
        </div>
      </motion.div>
      <AlertModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        title={`Deleting ${selectedItems.length} ${pluralize(
          "file",
          selectedItems.length
        )}`}
        description="This action cannot be undone"
        onConfirm={async () => {
          await deleteAssets(selectedItems.map((item) => item.id));
          clearSelectedItems();
        }}
        actionText="Delete"
        danger
      />
    </>
  );
};
