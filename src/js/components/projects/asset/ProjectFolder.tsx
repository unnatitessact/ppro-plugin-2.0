"use client";

import { Key, useState } from "react";

import { useWindowEvent } from "@mantine/hooks";
import { cn, useDisclosure } from "@nextui-org/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  TriangleCheckedIcon,
  TriangleDottedIcon,
  TriangleHalfFilledIcon,
} from "@tessact/tessact-icons";
import { motion } from "framer-motion";

import {
  Branches,
  ChevronRightSmall,
  DotGrid1X3Horizontal,
} from "@tessact/icons";

import { Checkbox } from "@/components/ui/Checkbox";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";
import { AlertModal } from "@/components/ui/modal/AlertModal";
// import { Link } from '@/components/ui/NextLink';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/RadixDropdown";
import { Tooltip } from "@/components/ui/Tooltip";

import { Thumbnail } from "@/components/library/asset/FolderCard";

import { useWorkspace } from "@/hooks/useWorkspace";

import {
  useDeleteProject,
  useDuplicateProject,
  useEditProject,
} from "@/api-integration/mutations/projects";
import { useProjectStatusesQuery } from "@/api-integration/queries/projects";
import {
  ProjectStatus,
  ProjectWorkflow,
  StackedFiles,
} from "@/api-integration/types/projects";

import { useProjectStore } from "@/stores/project-store";

import {
  assetCardCheckboxAnimation,
  assetCardDropdownAnimation,
} from "@/constants/animations";

interface NewProjectFolderProps {
  projectId: string;
  projectName: string;
  subcontents: StackedFiles[];
  completedTasks: number;
  totalTasks: number;
  status: string;
  is_archived: boolean;
  assigned_workflow?: ProjectWorkflow;
}

export const ProjectFolder = ({
  projectId,
  projectName,
  subcontents,
  completedTasks,
  totalTasks,
  status,
  is_archived,
  assigned_workflow,
}: NewProjectFolderProps) => {
  const actions = [
    { label: "Rename", value: "rename" },
    { label: "Change status", value: "change-status" },
    // { label: 'View metadata', value: 'view-metadata' },
    { label: "Duplicate", value: "duplicate" },
    { label: is_archived ? "Unarchive" : "Archive", value: "archive" },
    { label: "Delete", value: "delete" },
  ];
  const { isOpen: isDropdownOpen, onOpenChange: onDropdownOpenChange } =
    useDisclosure();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const {
    selectedProjects,
    addOrRemoveProjects,
    selectedClipboardAction,
    setAllProjects,
    allProjects,
  } = useProjectStore();
  const { workspace } = useWorkspace();

  const isSelected = selectedProjects.includes(projectId);

  const shouldControlsBeVisible = isDropdownOpen || isSelected;

  const { data: projectStatuses } = useProjectStatusesQuery();
  const { mutateAsync } = useEditProject(projectId);
  const { mutateAsync: deleteProject } = useDeleteProject(projectId);
  const { mutateAsync: duplicateProject } = useDuplicateProject(projectId);

  //   const router = useRouter();

  const handleAction = (action: Key) => {
    if (action === "rename") {
      openRenameModal();
    }
    // if (action === 'view-metadata') {

    // }
    if (action === "delete") {
      openDeleteModal();
    }
    if (action === "archive") {
      setAllProjects(
        allProjects?.map((project) => {
          if (project.id === projectId) {
            return { ...project, is_archived: !is_archived };
          }
          return project;
        })
      );

      mutateAsync({
        is_archived: !is_archived,
        workspace: workspace.id,
      });
    }
    // if (action === 'duplicate') {
    //   duplicateProject();
    // }
  };

  const handleStatusAction = (status: Key) => {
    const statusObject = projectStatuses?.find((ps) => ps.id === status);
    setAllProjects(
      allProjects?.map((project) => {
        if (project.id === projectId) {
          return { ...project, status: statusObject as ProjectStatus };
        }
        return project;
      })
    );
    mutateAsync({
      status: status as string,
      workspace: workspace.id,
    });
  };

  const handleDuplicateAction = (action: Key) => {
    if (action === "duplicate-without-content") {
      duplicateProject({ copy_content: false });
    }
    if (action === "duplicate-with-content") {
      duplicateProject({ copy_content: true });
    }
  };

  useWindowEvent("closeDropdown", () => {
    if (isDropdownOpen) {
      onDropdownOpenChange();
    }
  });

  const {
    isOpen: isRenameModalOpen,
    onOpen: openRenameModal,
    onOpenChange: onRenameModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();

  return (
    <>
      <ContextMenu.Root
        onOpenChange={(open) => {
          setIsContextMenuOpen(open);
          open && window.dispatchEvent(new CustomEvent("closeDropdown"));
        }}
      >
        <ContextMenu.Trigger>
          {/* <Link href={`/projects/${projectId}`} onMouseDown={() => {}}> */}
          <motion.div
            layout="position"
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-[20px] p-3",
              "transition-colors",
              "group h-full",
              isSelected
                ? "bg-ds-asset-card-bg-select"
                : "bg-ds-asset-card-bg hover:bg-ds-asset-card-bg-hover",
              isContextMenuOpen && "bg-ds-asset-card-bg-hover"
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
                // aspectRatio === 'horizontal' ? 'aspect-video' : 'aspect-[9/16]',
                "aspect-[4/3]",
                "noise rounded-2xl bg-ds-asset-card-card-bg",
                "flex flex-col items-center text-center",
                "relative overflow-hidden border border-black/[3%] dark:border-white/5"
              )}
            >
              <div className="z-50 mt-12 grid grid-rows-[20px,1fr] items-center gap-3">
                <div className="flex items-center justify-center">
                  <StatusIcon status={status} size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <Tooltip
                    showArrow={true}
                    delay={500}
                    closeDelay={0}
                    content={<span>{projectName}</span>}
                    classNames={{
                      content: "p-2",
                    }}
                  >
                    <span className="max-w-[200px] truncate text-base font-medium text-ds-text-primary">
                      {projectName}
                    </span>
                  </Tooltip>

                  {!is_archived && (
                    <div className="flex items-center gap-2 self-center">
                      {assigned_workflow && (
                        <Tooltip
                          showArrow={true}
                          delay={500}
                          closeDelay={0}
                          content={<span>{assigned_workflow?.name}</span>}
                          classNames={{
                            content: "p-2",
                          }}
                        >
                          <div className="flex">
                            <Branches size={16} className="text-primary-400" />
                          </div>
                        </Tooltip>
                      )}
                      <span className="font-regular text-xs text-ds-text-secondary">
                        {completedTasks} / {totalTasks} Complete
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {is_archived && (
                <span className="absolute bottom-4 z-50 text-sm font-medium text-ds-text-secondary">
                  Archived
                </span>
              )}
              {is_archived && (
                <div className="absolute left-0 top-0 z-40 h-full w-full rounded-2xl backdrop-blur-lg" />
              )}

              <ThumbnailStack
                subcontents={subcontents}
                isDropdownOpen={isDropdownOpen || isContextMenuOpen}
              />
              <motion.div
                className="absolute left-0 top-0 z-50 rounded-tl-2xl p-2"
                variants={assetCardCheckboxAnimation}
              >
                <Checkbox
                  isSelected={isSelected}
                  onValueChange={() => addOrRemoveProjects(projectId)}
                  isDisabled={!!selectedClipboardAction}
                />
              </motion.div>
              <motion.div
                className="absolute right-2 top-2 z-50"
                variants={assetCardDropdownAnimation}
              >
                <DropdownMenu
                  modal
                  open={isDropdownOpen}
                  onOpenChange={onDropdownOpenChange}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="rounded-lg bg-black/15 px-1 py-0.5 backdrop-blur-sm focus:outline-none"
                      aria-label="More options Project Folder"
                    >
                      <DotGrid1X3Horizontal size={20} className="text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-fit p-2">
                    {actions.map((action) => (
                      <>
                        {action.value === "change-status" ? (
                          <DropdownMenuSub key={action.value}>
                            <DropdownMenuSubTrigger
                              style={{
                                outline: "none",
                              }}
                            >
                              <div className="flex w-full items-center justify-between gap-5 outline-none">
                                {action.label}
                                <ChevronRightSmall size={20} />
                              </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="min-w-fit p-2">
                                {projectStatuses?.map((status) => (
                                  <DropdownMenuItem
                                    key={status.name}
                                    onSelect={() => {
                                      handleStatusAction(status.id);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <StatusIcon
                                        status={status.name}
                                        size={16}
                                      />
                                      {status.name}
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : action.value === "duplicate" ? (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              style={{
                                outline: "none",
                              }}
                            >
                              <div className="flex w-full items-center justify-between gap-5 outline-none">
                                {action.label}
                                <ChevronRightSmall size={20} />
                              </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="min-w-fit p-2">
                                <DropdownMenuItem
                                  key={"duplicate-without-content"}
                                  onSelect={() => {
                                    duplicateProject({
                                      copy_content: false,
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    Duplicate without content
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  key={"duplicate-with-content"}
                                  onSelect={() => {
                                    duplicateProject({
                                      copy_content: true,
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    Duplicate with content
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ) : (
                          <DropdownMenuItem
                            onSelect={() => handleAction(action.value)}
                            key={action.value}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        )}
                      </>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </motion.div>
          {/* </Link> */}
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="z-50 data-[state=open]:animate-custom-in">
            <Listbox
              onAction={handleAction}
              classNames={{ base: "border border-ds-menu-border", list: "p-1" }}
            >
              {actions.map((action) => (
                <ListboxItem key={action.value}>
                  {action.value === "change-status" ? (
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className="flex items-center justify-between gap-5 outline-none">
                        {action.label}
                        <ChevronRightSmall size={20} />
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.SubContent
                          className="z-50 data-[state=closed]:animate-custom-out data-[state=open]:animate-custom-in"
                          sideOffset={24}
                          alignOffset={-14}
                        >
                          <Listbox
                            onAction={handleStatusAction}
                            classNames={{
                              base: "border border-ds-menu-border",
                              list: "p-1",
                            }}
                          >
                            {projectStatuses?.map((status) => {
                              return (
                                <ListboxItem
                                  key={status.id}
                                  as={ContextMenu.Item}
                                >
                                  <div className="flex items-center gap-2 outline-none">
                                    <StatusIcon
                                      status={status.name}
                                      size={16}
                                    />
                                    {status.name}
                                  </div>
                                </ListboxItem>
                              );
                            })}
                          </Listbox>
                        </ContextMenu.SubContent>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                  ) : action.value === "duplicate" ? (
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className="flex items-center justify-between gap-5 outline-none">
                        {action.label}
                        <ChevronRightSmall size={20} />
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.SubContent
                          className="z-50 data-[state=closed]:animate-custom-out data-[state=open]:animate-custom-in"
                          sideOffset={24}
                          alignOffset={-14}
                        >
                          <Listbox
                            onAction={handleDuplicateAction}
                            classNames={{
                              base: "border border-ds-menu-border",
                              list: "p-1",
                            }}
                          >
                            <ListboxItem
                              key={"duplicate-without-content"}
                              as={ContextMenu.Item}
                            >
                              <div className="flex items-center gap-2 outline-none">
                                Duplicate without content
                              </div>
                            </ListboxItem>
                            <ListboxItem
                              key={"duplicate-with-content"}
                              as={ContextMenu.Item}
                            >
                              <div className="flex items-center gap-2 outline-none">
                                Duplicate with content
                              </div>
                            </ListboxItem>
                          </Listbox>
                        </ContextMenu.SubContent>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                  ) : (
                    <ContextMenu.Item className="outline-none">
                      {action.label}
                    </ContextMenu.Item>
                  )}
                </ListboxItem>
              ))}
            </Listbox>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <AlertModal
        isOpen={isRenameModalOpen}
        title="Rename"
        description={projectName}
        onConfirm={(value) => {
          setAllProjects(
            allProjects?.map((project) => {
              if (project.id === projectId) {
                return { ...project, name: value };
              }
              return project;
            })
          );
          mutateAsync({
            name: value,
            workspace: workspace.id,
          });
        }}
        onOpenChange={onRenameModalOpenChange}
        actionText="Confirm"
        hasInput
        inputPlaceholder="New name"
      />
      <AlertModal
        isOpen={isDeleteModalOpen}
        title="Delete"
        description={`Are you sure you want to delete ${projectName}?`}
        onConfirm={async () => {
          await deleteProject();
          setAllProjects(
            allProjects?.filter((project) => project.id !== projectId)
          );
        }}
        onOpenChange={onDeleteModalOpenChange}
        actionText="Delete"
        danger
      ></AlertModal>
    </>
  );
};

const ThumbnailStack = ({
  subcontents,
  isDropdownOpen,
}: {
  subcontents: StackedFiles[];
  isDropdownOpen: boolean;
}) => {
  return (
    <div className="absolute left-1/2 top-0 h-full w-4/5 -translate-x-1/2">
      {subcontents[2] && (
        <div
          className={cn(
            "bg-ds-asset-card-folder-bg shadow-project-folder",
            "absolute -bottom-[40%] -left-[15%] z-10 aspect-video w-full",
            "rounded-2xl -rotate-[15deg]",
            "transition-transform transform-gpu group-hover:translate-y-[1px] group-hover:scale-80",
            isDropdownOpen && "translate-y-[1px] scale-80"
          )}
        >
          <Thumbnail asset={subcontents[2]} />
        </div>
      )}
      {subcontents[1] && (
        <div
          className={cn(
            "bg-ds-asset-card-folder-bg shadow-project-folder",
            "absolute -bottom-[45%] -right-[25%] z-20 aspect-video w-full",
            "rounded-2xl rotate-[15deg]",
            "transition-transform transform-gpu group-hover:translate-y-0.5 group-hover:scale-90",
            isDropdownOpen && "translate-y-0.5 scale-90"
          )}
        >
          <Thumbnail asset={subcontents[1]} />
        </div>
      )}
      {subcontents[0] && (
        <div
          className={cn(
            "bg-ds-asset-card-folder-bg shadow-project-folder",
            "absolute -bottom-[45%] z-30 aspect-video w-full",
            "rounded-2xl rotate-[7deg]",
            "transition-transform transform-gpu group-hover:translate-y-1",
            isDropdownOpen && "translate-y-1"
          )}
        >
          <Thumbnail asset={subcontents[0]} />
        </div>
      )}
    </div>
  );
};

export const StatusIcon = ({
  status,
  size,
}: {
  status: string;
  size: number;
}) => {
  if (status === "In Progress" || status === "in_progress") {
    return (
      <TriangleHalfFilledIcon
        height={size}
        width={size}
        className="flex-shrink-0 text-ds-combination-amber-subtle-text"
      />
    );
  }
  if (status === "Completed" || status === "completed") {
    return (
      <TriangleCheckedIcon
        height={size}
        width={size}
        className="flex-shrink-0 text-green-400"
      />
    );
  }
  if (status === "Not Started" || status === "not_started") {
    return (
      <TriangleDottedIcon
        height={size}
        width={size}
        className="flex-shrink-0 text-default-400"
      />
    );
  }
};
