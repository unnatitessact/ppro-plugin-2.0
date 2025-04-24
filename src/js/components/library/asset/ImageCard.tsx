"use client";

import { Key, useState } from "react";

import { useMediaQuery, useWindowEvent } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";
import prettyBytes from "pretty-bytes";

import { BubbleText6, DotGrid1X3Horizontal } from "@tessact/icons";

import { Checkbox } from "@/components/ui/Checkbox";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";

import { ResourceSpecificCardProps } from "@/components/library/asset/ResourceCard";
import { CardPill } from "@/components/library/CardPill";
// import { SharedIndicator } from '@/components/library/SharedIndicator';
import { StatusDropdown } from "@/components/library/StatusDropdown";
import { AssetThumbnail } from "@/components/library/thumbnail/AssetThumbnail";

import { FileStatus } from "@/api-integration/types/library";

import { useLibraryStore } from "@/stores/library-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import {
  assetCardCheckboxAnimation,
  assetCardDropdownAnimation,
} from "@/constants/animations";

import { VersionModalButton } from "./VersionModalButton";

interface ImageCardProps extends ResourceSpecificCardProps {
  fileSize: number;
  thumbnailUrl: string;
  resolution: { width: number; height: number } | Record<string, never>;
  fileStatus?: FileStatus;
  commentsCount?: number;
}

const blurredCn = cn(
  "absolute z-50 bottom-2 ",
  "bg-black/25 text-white",
  "py-0.5 px-1 rounded-lg",
  "text-xs font-medium",
  "backdrop-blur-sm",
  "pointer-events-none"
);

// const actions = [
//   { label: 'Rename', value: 'rename' },
//   // { label: 'Edit thumbnail', value: 'edit-thumbnail' },
//   { label: 'Cut', value: 'cut' },
//   { label: 'Copy', value: 'copy' },
//   { label: 'Upload a version', value: 'upload-version' },
//   // { label: 'Download', value: 'download' },
//   { label: 'Delete', value: 'delete' }
// ];

export const ImageCard = ({
  assetId,
  fileName,
  fileSize,
  thumbnailUrl,
  resolution,
  fileStatus,
  commentsCount,
  href,
  versionStack,
  isDisabled,
  resourceActions,
  viewId,
  showDropzone,
  activeText,
  actions,
  permissions,
  sharedStatus,
  connectionId,
}: ImageCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const versionParam = versionStack
    ? `?version=${versionStack?.versions[0]?.file.id}`
    : "";

  const {
    selectedItems,
    addOrRemoveItem,
    clearSelectedItems,
    selectedClipboardAction,
    setSelectedClipboardAction,
  } = useLibraryStore();

  const isSelected = selectedItems.some(
    (item) => item.id === (versionStack?.id ?? assetId)
  );

  const shouldControlsBeVisible = isDropdownOpen || isSelected;

  const handleAction = (action: Key) => {
    if (action === "rename") {
      resourceActions?.onRename?.();
    }
    if (action === "copy") {
      clearSelectedItems();
      addOrRemoveItem({
        id: versionStack?.id ?? assetId,
        name: fileName,
        resourceType: "ImageFile",
        thumbnail: thumbnailUrl,
        permissions,
        connection_id: connectionId ?? null,
      });
      setSelectedClipboardAction("copy");
    }
    if (action === "cut") {
      clearSelectedItems();
      addOrRemoveItem({
        id: versionStack?.id ?? assetId,
        name: fileName,
        resourceType: "ImageFile",
        thumbnail: thumbnailUrl,
        permissions,
        connection_id: connectionId ?? null,
      });
      setSelectedClipboardAction("cut");
    }
    if (action === "upload-version") {
      resourceActions?.onVersionUpload?.();
    }
    if (action === "delete") {
      resourceActions?.onDelete?.();
    }
  };

  useWindowEvent("closeDropdown", () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  return (
    <>
      <ContextMenu.Root
        onOpenChange={(open) => {
          setIsContextMenuOpen(open);
          open && window.dispatchEvent(new CustomEvent("closeDropdown"));
        }}
      >
        <ContextMenu.Trigger>
          <motion.div
            layout="position"
            className={cn(
              "cursor-pointer rounded-[20px] p-3",
              "transition-colors",
              "group",
              isSelected
                ? "bg-ds-asset-card-bg-select"
                : "bg-ds-asset-card-bg hover:bg-ds-asset-card-bg-hover",
              isContextMenuOpen && "bg-ds-asset-card-bg-hover",
              showDropzone && "bg-primary-50",
              isDisabled && "pointer-events-none opacity-50",
              isMobile && "px-2.5 py-2"
            )}
            initial="initial"
            whileHover={
              selectedClipboardAction
                ? isSelected
                  ? "animate"
                  : "initial"
                : "animate"
            }
            animate={shouldControlsBeVisible ? "animate" : "initial"}
          >
            <div className="noise relative flex flex-col rounded-2xl border border-black/[3%] bg-ds-asset-card-card-bg shadow-physical-asset dark:border-white/5 dark:shadow-physical-asset-dark">
              <div className="relative overflow-hidden">
                <AssetThumbnail
                  thumbnailUrl={thumbnailUrl}
                  fileName={fileName}
                />
                {!!resolution.height && !!resolution.width && (
                  <span className={cn(blurredCn, "right-2")}>
                    {resolution.width}x{resolution.height}
                  </span>
                )}
                <motion.div
                  className="absolute left-0 top-0 z-40 rounded-tl-2xl p-2"
                  variants={assetCardCheckboxAnimation}
                >
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={() =>
                      addOrRemoveItem({
                        id: versionStack?.id ?? assetId,
                        name: fileName,
                        resourceType: "ImageFile",
                        thumbnail: thumbnailUrl,
                        permissions,
                        connection_id: connectionId ?? null,
                      })
                    }
                    isDisabled={!!selectedClipboardAction}
                  />
                </motion.div>
                <motion.div
                  className="absolute right-2 top-2 z-40"
                  variants={assetCardDropdownAnimation}
                >
                  <Dropdown
                    isOpen={isDropdownOpen}
                    placement="bottom-start"
                    onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
                  >
                    <DropdownTrigger>
                      <button
                        className="rounded-lg bg-black/15 px-1 py-0.5 backdrop-blur-sm focus:outline-none"
                        onClick={(e) => e.preventDefault()}
                        aria-label="More options"
                      >
                        <DotGrid1X3Horizontal
                          size={20}
                          className="text-white"
                        />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu onAction={handleAction}>
                      {actions.map((action) => (
                        <DropdownItem key={action.value}>
                          {action.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </motion.div>
              </div>
              <div className="flex flex-col px-5 py-3">
                <div className="flex w-full gap-1">
                  <h4 className="truncate text-ds-text-primary">{fileName}</h4>
                  {versionStack && (
                    <VersionModalButton versionStack={versionStack} />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs text-ds-text-secondary",
                    activeText && "text-ds-button-primary-bg-hover"
                  )}
                >
                  {activeText || prettyBytes(fileSize)}
                </p>
              </div>
              <div
                className={cn(
                  "absolute -bottom-4 right-4 flex gap-2",
                  isMobile && "hidden"
                )}
              >
                {!!commentsCount && commentsCount > 0 && (
                  <CardPill className="-bottom-4 right-[60px]">
                    {commentsCount}
                    <BubbleText6 size={12} />
                  </CardPill>
                )}
                {fileStatus && (
                  <StatusDropdown
                    status={fileStatus}
                    assetId={assetId}
                    variant="compact"
                  />
                )}
                {/* {sharedStatus && (
                    <CardPill className="-bottom-4 right-[100px]">
                      <SharedIndicator sharedStatus={sharedStatus} />
                    </CardPill>
                  )} */}
              </div>
            </div>
          </motion.div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="z-50 min-w-[200px] data-[state=open]:animate-custom-in">
            <Listbox
              onAction={handleAction}
              classNames={{ base: "border border-ds-menu-border", list: "p-1" }}
            >
              {actions.map((action) => (
                <ListboxItem key={action.value} as={ContextMenu.Item}>
                  {action.label}
                </ListboxItem>
              ))}
            </Listbox>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </>
  );
};
