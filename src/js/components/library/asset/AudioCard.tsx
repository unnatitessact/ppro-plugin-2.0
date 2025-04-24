"use client";

import { Key, useMemo, useState } from "react";

import { useElementSize, useMediaQuery, useWindowEvent } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
// import prettyBytes from 'pretty-bytes';
import format from "format-duration";
import { motion } from "framer-motion";

import { BubbleText6, DotGrid1X3Horizontal } from "@tessact/icons";

import { Checkbox } from "../../ui/Checkbox";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../ui/Dropdown";
import { Listbox, ListboxItem } from "../../ui/Listbox";
// import { Link } from '../../ui/NextLink';

import { ResourceSpecificCardProps } from "./ResourceCard";
import { CardPill } from "../CardPill";
import { SharedIndicator } from "../SharedIndicator";
import { StatusDropdown } from "../StatusDropdown";

import { FileStatus } from "../../../api-integration/types/library";

import { useLibraryStore } from "../../../stores/library-store";

import { MOBILE_MEDIA_QUERY } from "../../../utils/responsiveUtils";

import {
  assetCardCheckboxAnimation,
  assetCardDropdownAnimation,
} from "../../../constants/animations";

import { IconThumbnail } from "../thumbnail/IconThumbnail";
import { VersionModalButton } from "./VersionModalButton";

interface AudioCardProps extends ResourceSpecificCardProps {
  duration: number;
  fileStatus?: FileStatus;
  commentsCount?: number;
}

// const actions = [
//   { label: 'Rename', value: 'rename' },
//   { label: 'Cut', value: 'cut' },
//   { label: 'Copy', value: 'copy' },
//   { label: 'Upload a version', value: 'upload-version' },
//   // { label: 'Download', value: 'download' },
//   { label: 'Delete', value: 'delete' }
// ];

export const AudioCard = ({
  assetId,
  fileName,
  duration,
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
}: AudioCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const versionParam = versionStack
    ? `?version=${versionStack?.versions[0]?.file.id}`
    : "";

  const variants = {
    hover: {
      y: "-50%",
      rotate: 360,
      transition: {
        y: { duration: 0.4 },
        borderRadius: { duration: 0.1 },
        rotate: { duration: 4, ease: "linear", repeat: Infinity },
      },
    },
  };

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
        name: fileName,
        resourceType: "AudioFile",
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
        resourceType: "AudioFile",
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

  const { ref, width } = useElementSize();

  const minHeight = useMemo(() => {
    if (aspectRatio === "horizontal") {
      return width * (9 / 16) + 64;
    } else {
      return width * (16 / 9) + 64;
    }
  }, [aspectRatio, width]);

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
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            layout="position"
            className={cn(
              "cursor-pointer rounded-[20px] p-3",
              "transition-colors",
              "group",
              isSelected
                ? "bg-ds-asset-card-bg-select"
                : "bg-ds-asset-card-bg hover:bg-ds-asset-card-bg-hover",
              isContextMenuOpen && "bg-ds-asset-card-bg-hover",
              "h-full w-full",
              showDropzone && "bg-primary-50",
              isDisabled && "pointer-events-none opacity-50",
              isMobile && "px-2.5 py-2"
            )}
            initial="initial"
            animate={
              isHovering || shouldControlsBeVisible
                ? ["animate", "hover"]
                : "initial"
            }
            style={{ minHeight: minHeight }}
          >
            <div
              className="noise relative flex h-full flex-col rounded-2xl border border-black/[3%] bg-ds-asset-card-card-bg shadow-physical-asset dark:border-white/5 dark:shadow-physical-asset-dark"
              ref={ref}
            >
              <IconThumbnail isSelected={isSelected} fileExtension={"audio"} />

              <div className="absolute h-full w-full overflow-hidden">
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
                        resourceType: "AudioFile",
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
              <div className="absolute left-0 top-0 h-full  w-full overflow-hidden">
                <motion.div
                  variants={variants}
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-0 z-10 overflow-hidden rounded-full -translate-x-1/2",
                    aspectRatio === "horizontal" && "aspect-square h-full",
                    aspectRatio === "vertical" && "aspect-square w-full"
                  )}
                  style={{
                    background:
                      "url(/vinyl.png) no-repeat center center / cover",
                  }}
                ></motion.div>
              </div>
              <div className="relative bottom-0 flex w-full flex-col overflow-hidden px-5 py-3">
                <div className="flex w-full gap-1">
                  <h4
                    className="truncate text-ds-text-primary"
                    title={fileName}
                  >
                    {fileName}
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
                  {activeText || format(duration * 1000)}
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
                {sharedStatus && (
                  <CardPill className="-bottom-4 right-[100px]">
                    <SharedIndicator sharedStatus={sharedStatus} />
                  </CardPill>
                )}
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
