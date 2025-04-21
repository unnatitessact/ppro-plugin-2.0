"use client";

import { Key, useEffect, useMemo, useRef, useState } from "react";

// import { useParams, usePathname, useRouter } from 'next/navigation';

import { cn, Skeleton, useDisclosure } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import {
  ChevronRightSmall,
  FileBendFilled,
  Folder1Filled,
} from "@tessact/icons";

import { Listbox, ListboxItem } from "../ui/Listbox";
import { AlertModal } from "../ui/modal/AlertModal";
import { Tooltip } from "../ui/Tooltip";

import { useLibraryState } from "../../stores/library-state";
// import { useFileUpload } from "../../hooks/useFileUpload";

import {
  useDeleteAsset,
  useRenameAsset,
} from "../../api-integration/mutations/library";
import { useTreeQuery } from "../../api-integration/queries/library";
import { ResourceType } from "../../api-integration/types/library/library";

interface TreeNodeProps {
  nodeId: string;
  name: string;
  resourcetype: ResourceType;
  maxWidth?: number;
  isOnRoot: boolean;
  childrenCount?: number;
  parent: string;
  fileExtension?: string;
}

const getIconFromResourceType = (resourcetype: ResourceType) => {
  switch (resourcetype) {
    case "Folder":
      return <Folder1Filled size={20} className="text-ds-text-secondary" />;
    default:
      return <FileBendFilled size={20} className="text-ds-text-secondary" />;
  }
};

export const TreeNode = ({
  nodeId,
  name,
  resourcetype,
  maxWidth,
  isOnRoot,
  childrenCount,
  parent,
  fileExtension,
}: TreeNodeProps) => {
  //   const { folderId, assetId } = useParams() as {
  //     folderId: string;
  //     assetId: string;
  //   };

  const { folderId, setFolderId, assetId } = useLibraryState();

  const {
    isOpen: isRenameModalOpen,
    onOpenChange: onRenameModalOpenChange,
    onOpen: openRenameModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onOpen: onDeleteModalOpen,
  } = useDisclosure();

  const inputRef = useRef<HTMLInputElement>(null);

  // const { uploadFile } = useFileUpload("library", nodeId);

  const { mutateAsync: renameAsset } = useRenameAsset(nodeId);
  const { mutateAsync: deleteAsset } = useDeleteAsset(nodeId);

  const uploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // if (files) {
    //   Array.from(files).forEach((file) => uploadFile(file));
    // }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isActive =
    resourcetype === "Folder" ? folderId === nodeId : assetId === nodeId;

  const [isExpanded, setIsExpanded] = useState(false);

  // const router = useRouter();
  // const pathname = usePathname();

  // const isOnTaggingScreen = pathname.includes("/tagging");

  const {
    data: children,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useTreeQuery(nodeId, {
    enabled: isExpanded,
  });

  const [isHovered, setIsHovered] = useState(false);

  const heightRef = useRef<HTMLDivElement>(null);

  const height = heightRef.current?.clientHeight || 0;

  useEffect(() => {
    if (resourcetype === "Folder" && folderId === nodeId) {
      setIsExpanded(true);
    }
  }, [folderId, nodeId, resourcetype]);

  const allNodes = useMemo(() => {
    return children?.pages.flatMap((page) => page.results) || [];
  }, [children]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const href = useMemo(() => {
    if (resourcetype === "Folder") {
      return `/library/folder/${nodeId}`;
    } else if (resourcetype === "VideoFile") {
      return `/tagging/asset/${nodeId}`;
    } else if (resourcetype === "File" && fileExtension === ".tdraft") {
      return `/library/video/${nodeId}`;
    }
    return `/library/asset/${nodeId}`;
  }, [resourcetype, nodeId, fileExtension]);

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="flex">
            <input
              type="file"
              ref={inputRef}
              multiple
              onChange={uploadFiles}
              hidden
            />
            <div className="h-4 w-4 flex-shrink-0">
              {resourcetype === "Folder" && !!childrenCount && (
                <ChevronRightSmall
                  size={16}
                  className={cn(
                    "mt-2 cursor-pointer text-ds-text-secondary transition",
                    isExpanded && "rotate-90"
                  )}
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              )}
            </div>
            <div className="relative flex w-full flex-col">
              {!isOnRoot && (
                <div className="absolute -left-6 top-1 -z-10 h-3 w-2 rounded-bl-md border-b border-l border-ds-link-tree-lines" />
              )}
              {/* <Link href={href} className="w-full"> */}
              <motion.div
                className={cn(
                  "relative flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-2"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="flex-shrink-0">
                  {getIconFromResourceType(resourcetype)}
                </span>
                <Tooltip
                  showArrow={true}
                  delay={500}
                  closeDelay={0}
                  content={<span>{name}</span>}
                  classNames={{
                    content: "p-2",
                  }}
                >
                  <p
                    className={cn("overflow-hidden truncate text-sm")}
                    style={{ maxWidth: maxWidth || "100%" }}
                  >
                    {name}
                  </p>
                </Tooltip>
                {isHovered && (
                  <motion.div
                    layout
                    transition={{ duration: 0.2 }}
                    layoutId="tree-hover-indicator"
                    className="absolute inset-0 -z-20 h-9 w-full rounded-xl bg-ds-link-bg-hover"
                  ></motion.div>
                )}
                {isActive && (
                  <motion.div
                    layout
                    transition={{ duration: 0.2 }}
                    layoutId="tree-active-indicator"
                    className="absolute inset-0 -z-10 h-9 w-full rounded-xl bg-ds-link-bg-selected"
                  ></motion.div>
                )}
              </motion.div>
              {/* </Link> */}
              {isExpanded ? (
                isLoading ? (
                  Array.from({ length: childrenCount || 0 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-1.5 pl-5"
                    >
                      <Skeleton className="h-5 w-5 flex-shrink-0 rounded-md" />
                      <Skeleton className="h-5 w-full max-w-32 rounded-md" />
                    </div>
                  ))
                ) : (
                  <div className="relative flex flex-col" ref={heightRef}>
                    <div
                      style={{ height: `${height - 26}px` }}
                      className="absolute -left-2 top-0 -z-10 w-0.5 border-l border-ds-link-tree-lines"
                    />
                    {allNodes.map((child) => {
                      if (child.resourcetype === "VersionStack") {
                        if (child?.versions?.length === 0) return null;
                        const file = child?.versions?.[0]?.file;
                        return (
                          <TreeNode
                            key={child.id}
                            name={file.name}
                            nodeId={child.id}
                            resourcetype={file.resourcetype}
                            isOnRoot={false}
                            maxWidth={maxWidth}
                            parent={child.parent}
                          />
                        );
                      }
                      return (
                        <TreeNode
                          key={child.id}
                          name={child.name}
                          nodeId={child.id}
                          resourcetype={child.resourcetype}
                          isOnRoot={false}
                          maxWidth={maxWidth}
                          childrenCount={child.children_count}
                          parent={child.parent}
                          fileExtension={child.file_extension}
                        />
                      );
                    })}
                    <div ref={ref}></div>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            {resourcetype === "Folder" ? (
              <FolderActions
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                openRenameModal={openRenameModal}
                openDeleteModal={onDeleteModalOpen}
                folderId={nodeId}
                inputRef={inputRef}
              />
            ) : (
              <AssetActions
                openRenameModal={openRenameModal}
                openDeleteModal={onDeleteModalOpen}
              />
            )}
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <AlertModal
        isOpen={isRenameModalOpen}
        title="Rename"
        description={name}
        onConfirm={async (value) => await renameAsset(value)}
        onOpenChange={onRenameModalOpenChange}
        actionText="Confirm"
        hasInput
        inputPlaceholder="New name"
        defaultValue={name}
      />
      <AlertModal
        isOpen={isDeleteModalOpen}
        title="Delete"
        description={`Are you sure you want to delete ${name}?`}
        onConfirm={async () => {
          await deleteAsset(void 0, {
            onSuccess: () => {
              // If one the same page, redirect to the parent folder
              // if (pathname.includes(nodeId)) {
              //   if (parent) {
              //     router.push(`/library/folder/${parent}`);
              //   } else {
              //     router.push("/library");
              //   }
              // }
            },
          });
        }}
        onOpenChange={onDeleteModalOpenChange}
        actionText="Delete"
        danger
      ></AlertModal>
    </>
  );
};

const AssetActions = ({
  openRenameModal,
  openDeleteModal,
}: {
  openRenameModal: () => void;
  openDeleteModal: () => void;
}) => {
  const onAction = (key: Key) => {
    if (key === "rename") {
      openRenameModal();
    } else if (key === "delete") {
      openDeleteModal();
    }
  };

  return (
    <Listbox onAction={onAction}>
      <ListboxItem key="rename" as={ContextMenu.Item}>
        Rename
      </ListboxItem>
      <ListboxItem key="delete" as={ContextMenu.Item}>
        Delete
      </ListboxItem>
    </Listbox>
  );
};

const FolderActions = ({
  isExpanded,
  setIsExpanded,
  openRenameModal,
  openDeleteModal,
  inputRef,
}: {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  openRenameModal: () => void;
  openDeleteModal: () => void;
  folderId: string;
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  const onAction = (key: Key) => {
    if (key === "expand") {
      setIsExpanded(!isExpanded);
    } else if (key === "rename") {
      openRenameModal();
    } else if (key === "delete") {
      openDeleteModal();
    } else if (key === "upload") {
      inputRef.current?.click();
    }
  };

  return (
    <>
      <Listbox onAction={onAction}>
        <ListboxItem key="upload" as={ContextMenu.Item}>
          Upload here
        </ListboxItem>
        <ListboxItem key="expand" as={ContextMenu.Item}>
          {isExpanded ? "Collapse" : "Expand"}
        </ListboxItem>
        <ListboxItem key="rename" as={ContextMenu.Item}>
          Rename
        </ListboxItem>
        <ListboxItem key="delete" as={ContextMenu.Item}>
          Delete
        </ListboxItem>
      </Listbox>
    </>
  );
};
