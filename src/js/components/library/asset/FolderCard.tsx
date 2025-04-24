"use client";

import { Key, useMemo, useState } from "react";

import { useMediaQuery, useWindowEvent } from "@mantine/hooks";
import { cn, Image } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";

import { DotGrid1X3Horizontal, FolderLinkFilled } from "@tessact/icons";

import { Checkbox } from "@/components/ui/Checkbox";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";

import { PermissionPayload } from "@/api-integration/types/library";
import { ResourceCardActions } from "@/components/library/asset/ResourceCard";

import {
  FolderSubContent,
  ImageSubContent,
  PhysicalAssetSubContent,
  VideoSubContent,
} from "@/api-integration/types/library";

import { useLibraryStore } from "@/stores/library-store";

import { useParamsStateStore } from "@/stores/params-state-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import {
  assetCardCheckboxAnimation,
  assetCardDropdownAnimation,
} from "@/constants/animations";

interface FolderCardProps {
  folderId: string;
  folderName: string;
  subcontents: FolderSubContent[];
  isConnectedFolder?: boolean;
  childrenCount?: number;
  viewId?: string;
  resourceActions?: ResourceCardActions;
  showDropzone?: boolean;
  activeText?: string;
  actions: {
    label: string;
    value: string;
  }[];
  permissions?: PermissionPayload[];
  connectionId?: string | null;
}

// const actions = [
//   { label: 'Rename', value: 'rename' },
//   { label: 'View metadata', value: 'view-metadata' },
//   { label: 'Cut', value: 'cut' },
//   { label: 'Copy', value: 'copy' },
//   // { label: 'Download', value: 'download' },
//   { label: 'Delete', value: 'delete' }
// ];

export const FolderCard = ({
  folderId,
  folderName,
  subcontents,
  isConnectedFolder,
  childrenCount,
  viewId,
  resourceActions,
  showDropzone,
  activeText,
  actions,
  permissions,
}: FolderCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const {
    selectedItems,
    addOrRemoveItem,
    selectedClipboardAction,
    clearSelectedItems,
    setSelectedClipboardAction,
    aspectRatio,
  } = useLibraryStore();

  const { setFolderId, setSelectedAssetId } = useParamsStateStore();

  const isSelected = selectedItems.some((item) => item.id === folderId);

  const shouldControlsBeVisible = isDropdownOpen || isSelected;

  const folderActions = useMemo(() => {
    const newActions = isConnectedFolder
      ? actions?.filter((action) => action.value !== "rename")
      : [...actions];
    return [
      {
        label: "View metadata",
        value: "view-metadata",
      },
      ...newActions,
    ];
  }, [actions, isConnectedFolder]);

  const handleAction = (action: Key) => {
    if (action === "rename") {
      resourceActions?.onRename?.();
    }
    if (action === "view-metadata") {
    }
    if (action === "copy") {
      clearSelectedItems();
      addOrRemoveItem({
        id: folderId,
        name: folderName,
        resourceType: "Folder",
        permissions,
        connection_id: isConnectedFolder ? folderId : null,
      });
      setSelectedClipboardAction("copy");
    }
    if (action === "cut") {
      clearSelectedItems();
      addOrRemoveItem({
        id: folderId,
        name: folderName,
        resourceType: "Folder",
        permissions,
        connection_id: isConnectedFolder ? folderId : null,
      });
      setSelectedClipboardAction("cut");
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
            onClick={() => {
              setFolderId(folderId);
              setSelectedAssetId("");
            }}
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-[20px] p-3",
              "transition-colors",
              "group h-full",
              isSelected
                ? "bg-ds-asset-card-bg-select"
                : "bg-ds-asset-card-bg hover:bg-ds-asset-card-bg-hover",
              isContextMenuOpen && "bg-ds-asset-card-bg-hover",
              showDropzone && "bg-primary-50",
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
            <div
              className={cn(
                "relative rounded-2xl",
                "border border-black/[3%] dark:border-white/5",
                "h-full bg-ds-asset-card-card-bg",
                "overflow-hidden",
                "flex flex-col justify-end",
                "pt-12"
              )}
            >
              <ThumbnailStack
                subcontents={subcontents}
                childrenCount={childrenCount}
                inAnimatedState={
                  isDropdownOpen || isContextMenuOpen || isSelected
                }
              />
              <motion.div
                className="absolute left-0 top-0 z-40 rounded-tl-2xl p-2"
                variants={assetCardCheckboxAnimation}
              >
                <Checkbox
                  isSelected={isSelected}
                  onValueChange={() =>
                    addOrRemoveItem({
                      id: folderId,
                      name: folderName,
                      resourceType: "Folder",
                      permissions,
                      connection_id: isConnectedFolder ? folderId : null,
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
                      <DotGrid1X3Horizontal size={20} className="text-white" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={handleAction}>
                    {folderActions.map((action) => (
                      <DropdownItem key={action.value}>
                        {action.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </motion.div>
              <div
                className={cn(
                  aspectRatio === "horizontal"
                    ? "aspect-video"
                    : "aspect-[9/16]",
                  "noise rounded-2xl bg-ds-asset-card-card-bg",
                  "h-[calc(100%-20px)] w-full p-5",
                  "shadow-folder dark:shadow-folder-dark",
                  "relative z-50",
                  "flex items-center justify-center"
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="max-w-[calc(100%-40px)] flex-1">
                    <h3 className="overflow-hidden truncate">{folderName}</h3>
                    <p
                      className={cn(
                        "text-xs text-ds-text-secondary",
                        activeText && "text-ds-button-primary-bg-hover"
                      )}
                    >
                      {activeText
                        ? activeText
                        : isConnectedFolder
                        ? "Connected folder"
                        : "Folder"}
                    </p>
                  </div>
                  {isConnectedFolder && (
                    <div className="h-5 w-5">
                      <FolderLinkFilled
                        size={20}
                        className="text-ds-text-secondary"
                      />
                    </div>
                  )}
                </div>
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
              {folderActions.map((action) => (
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

export const ThumbnailStack = ({
  subcontents,
  childrenCount,
  inAnimatedState,
}: {
  subcontents: FolderSubContent[];
  childrenCount?: number;
  inAnimatedState: boolean;
}) => {
  return (
    <div className="absolute left-1/2 top-0 h-full w-4/5 -translate-x-1/2">
      {subcontents?.length === 0 && childrenCount && childrenCount > 0 && (
        <>
          {childrenCount > 2 && (
            <div
              className={cn(
                "bg-ds-asset-card-folder-bg shadow-folder-top-image dark:shadow-folder-top-image-dark",
                "absolute top-4 z-10 aspect-video w-full",
                "rounded-2xl",
                "transition-transform transform-gpu group-hover:translate-y-[1px] group-hover:scale-80",
                inAnimatedState && "translate-y-[1px] scale-80"
              )}
            >
              <Thumbnail isSkeleton />
            </div>
          )}
          {childrenCount > 1 && (
            <div
              className={cn(
                "bg-ds-asset-card-folder-bg shadow-folder-middle-image dark:shadow-folder-middle-image-dark",
                "absolute top-8 z-20 aspect-video w-full",
                "rounded-2xl",
                "transition-transform transform-gpu group-hover:translate-y-0.5 group-hover:scale-90",
                inAnimatedState && "translate-y-0.5 scale-90"
              )}
            >
              <Thumbnail isSkeleton />
            </div>
          )}
          {childrenCount > 0 && (
            <div
              className={cn(
                "bg-ds-asset-card-folder-bg shadow-folder-bottom-image dark:shadow-folder-bottom-image-dark",
                "absolute top-12 z-30 aspect-video w-full",
                "rounded-2xl",
                "transition-transform transform-gpu group-hover:translate-y-1",
                inAnimatedState && "translate-y-1"
              )}
            >
              <Thumbnail isSkeleton />
            </div>
          )}
        </>
      )}
      {subcontents[2] && (
        <div
          className={cn(
            "bg-ds-asset-card-folder-bg shadow-folder-top-image dark:shadow-folder-top-image-dark",
            "absolute top-4 z-10 aspect-video w-full",
            "rounded-2xl",
            "transition-transform transform-gpu group-hover:translate-y-[1px] group-hover:scale-80",
            inAnimatedState && "translate-y-[1px] scale-80"
          )}
        >
          <Thumbnail asset={subcontents[2]} />
        </div>
      )}
      {subcontents[1] && (
        <div
          className={cn(
            "bg-ds-asset-card-folder-bg shadow-folder-middle-image dark:shadow-folder-middle-image-dark",
            "absolute top-8 z-20 aspect-video w-full",
            "rounded-2xl",
            "transition-transform transform-gpu group-hover:translate-y-0.5 group-hover:scale-90",
            inAnimatedState && "translate-y-0.5 scale-90"
          )}
        >
          <Thumbnail asset={subcontents[1]} />
        </div>
      )}
      {subcontents[0] && (
        <div
          className={cn(
            "bg-ds-asset-card-folder-bg shadow-folder-bottom-image dark:shadow-folder-bottom-image-dark",
            "absolute top-12 z-30 aspect-video w-full",
            "rounded-2xl",
            "transition-transform transform-gpu group-hover:translate-y-1",
            inAnimatedState && "translate-y-1"
          )}
        >
          <Thumbnail asset={subcontents[0]} />
        </div>
      )}
    </div>
  );
};

export const Thumbnail = ({
  asset,
  isSkeleton,
}: {
  asset?: FolderSubContent;
  isSkeleton?: boolean;
}) => {
  if (isSkeleton || !asset) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="noise aspect-video w-full bg-ds-asset-card-folder-bg"></div>
        <div className="pointer-events-none absolute top-0 z-20 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      </div>
    );
  }

  if (asset.type === "video") {
    const item = asset as VideoSubContent;

    if (!item.thumbnail) {
      return null;
    }

    return (
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={item.thumbnail || ""}
          alt={item.id}
          className="aspect-video object-cover"
        />
        <div className="pointer-events-none absolute top-0 z-20 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      </div>
    );
  }

  if (asset.type === "image") {
    const item = asset as ImageSubContent;

    if (!item.thumbnail) {
      return null;
    }

    return (
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={item.thumbnail || ""}
          alt={item.id}
          className="aspect-video object-cover"
        />
        <div className="pointer-events-none absolute top-0 z-20 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      </div>
    );
  }

  if (asset.type === "physical_asset") {
    const item = asset as PhysicalAssetSubContent;

    if (!item.asset_image) {
      return null;
    }

    return (
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={item.asset_image || ""}
          alt={item.barcode}
          className="aspect-video object-cover"
        />
        <div className="pointer-events-none absolute top-0 z-20 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      </div>
    );
  }

  if (asset.type === "folder") {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="noise aspect-video w-full bg-ds-asset-card-folder-bg"></div>
        <div className="pointer-events-none absolute top-0 z-20 h-full w-full rounded-2xl border border-black/[8%] bg-transparent dark:border-white/15"></div>
      </div>
    );
  }

  return null;
};
