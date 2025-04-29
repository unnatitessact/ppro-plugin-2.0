"use client";

import { Key, useState } from "react";

import { useMediaQuery, useWindowEvent } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";

import { DotGrid1X3Horizontal } from "@tessact/icons";

import { Checkbox } from "@/components/ui/Checkbox";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";

import { ResourceSpecificCardProps } from "@/components/library/asset/ResourceCard";

import { useLibraryStore } from "@/stores/library-store";

import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import {
  assetCardCheckboxAnimation,
  assetCardDropdownAnimation,
} from "@/constants/animations";

import { PhysicalAssetThumbnail } from "../thumbnail/PhysicalAssetThumbnail";
import { VersionModalButton } from "./VersionModalButton";

import { useNavigate } from "react-router-dom";
import { useParamsStateStore } from "@/stores/params-state-store";

interface PhysicalAssetCardProps extends Partial<ResourceSpecificCardProps> {
  assetId: string;
  assetName: string;
  fileName?: string;
  assetImage: string | null;
  barcode: string;
  location: string;
}

const actions = [
  { label: "Rename", value: "rename" },
  // { label: 'Edit image', value: 'edit-image' },
  { label: "Cut", value: "cut" },
  { label: "Copy", value: "copy" },
  { label: "Upload a version", value: "upload-version" },

  // { label: 'Download', value: 'download' },
  { label: "Delete", value: "delete" },
];

export const PhysicalAssetCard = ({
  assetId,
  assetName,
  assetImage,
  barcode,
  href,
  versionStack,
  isDisabled,
  resourceActions,
  viewId,
  showDropzone,
  activeText,
  permissions,
  connectionId,
}: PhysicalAssetCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const { setSelectedAssetId, setFolderId } = useParamsStateStore();

  const versionParam = versionStack
    ? `?version=${versionStack?.versions[0]?.file.id}`
    : "";

  const {
    selectedItems,
    addOrRemoveItem,
    clearSelectedItems,
    selectedClipboardAction,
    setSelectedClipboardAction,
    aspectRatio,
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
        name: assetName,
        resourceType: "PhysicalAsset",
        permissions,
        connection_id: connectionId ?? null,
      });
      setSelectedClipboardAction("copy");
    }
    if (action === "cut") {
      clearSelectedItems();
      addOrRemoveItem({
        id: versionStack?.id ?? assetId,
        name: assetName,
        resourceType: "PhysicalAsset",
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
          {/* <Link
            onMouseDown={() => {}}
            href={
              href ??
              `/library/asset/${versionStack?.id ?? assetId}${versionParam}${
                viewId ? `?isAIView=${viewId}` : ""
              }`
            }
          > */}
          <motion.div
            layout="position"
            onClick={() => {
              navigate(`/library/asset/${assetId}`);

              // setSelectedAssetId(assetId);
              // setFolderId("");
            }}
            className={cn(
              " cursor-pointer flex-col gap-2 rounded-[20px] p-3",
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
            <div className={cn("relative flex flex-col rounded-2xl")}>
              <div className="pointer-events-none absolute z-30 h-full w-full rounded-2xl border border-black/[3%] bg-transparent dark:border-white/5"></div>
              <div
                className={cn(
                  "noise relative rounded-tl-2xl rounded-tr-2xl bg-ds-asset-card-card-bg",
                  "overflow-hidden",
                  aspectRatio === "horizontal"
                    ? "aspect-video"
                    : "aspect-[9/16]"
                )}
              >
                <PhysicalAssetThumbnail
                  assetImage={assetImage}
                  barcode={barcode}
                  assetName={assetName}
                />
                <motion.div
                  className="absolute left-0 top-0 z-40 rounded-tl-2xl p-2"
                  variants={assetCardCheckboxAnimation}
                >
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={() =>
                      addOrRemoveItem({
                        id: versionStack?.id ?? assetId,
                        name: assetName,
                        resourceType: "PhysicalAsset",
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
              <div className="noise flex flex-col rounded-bl-2xl rounded-br-2xl bg-ds-asset-card-card-bg bg-repeat px-5 py-3 shadow-physical-asset dark:shadow-physical-asset-dark">
                <div className="flex w-full gap-1">
                  <h4
                    className="truncate text-ds-text-primary"
                    title={assetName}
                  >
                    {assetName}
                  </h4>
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
                  {activeText || "Asset"}
                </p>
              </div>
            </div>
          </motion.div>
          {/* </Link> */}
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
