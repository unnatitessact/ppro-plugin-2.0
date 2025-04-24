import { useEffect, useMemo, useState } from "react";

// import { useParams } from 'next/navigation'; // Commented out

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  AnimateLayoutChanges,
  arrayMove,
  defaultAnimateLayoutChanges,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  ,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@nextui-org/react";
import { useMutationState } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { toast } from "sonner";

import { DotGrid2X3 } from "@tessact/icons";

import { Tooltip } from "../ui/Tooltip"; // Fixed path

// import { useLibraryFilterState } from '../../hooks/useLibraryFilterState'; // Fixed path & Commented out

import {
  useRemoveFromVersionStack,
  useReorderVersionStack,
} from "../../api-integration/mutations/library"; // Fixed path
import { useAutomationConfigs } from "../../api-integration/queries/automations"; // Fixed path
import { useLibraryContentsQuery } from "../../api-integration/queries/library"; // Fixed path
import {
  RemoveFileFromVersionStackPayload,
  VersionStackAsset,
  VersionStackItem,
} from "../../api-integration/types/library"; // Fixed path

import { useLibraryStore } from "../../stores/library-store"; // Fixed path
import { useParamsStateStore } from "../../stores/params-state-store"; // Import store

import { formatDate } from "../../utils/dates"; // Fixed path

import { Button } from "../ui/Button";
import { Divider } from "../ui/Divider";
import { Modal, ModalBody, ModalContent, ModalHeader } from "../ui/Modal";
import {
  ToastError,
  ToastFallback,
  ToastProcess,
  ToastSuccess,
} from "../ui/ToastContent";
import {
  FileCard,
  getResourceType,
  PhysicalAssetThumbnail,
  Thumbnail,
} from "./LibraryTableView";

interface VersionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const VersionModal = ({ isOpen, onOpenChange }: VersionModalProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const [versionsState, setVersionsState] = useState<VersionStackItem[]>(); // Need to use local state due to https://github.com/clauderic/dnd-kit/issues/921

  // const [randomState, setRandomState] = useState(0); // used to tap into state flows.

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { folderId } = useParamsStateStore(); // Use store
  // const { folderId } = useParams() as { folderId?: string };

  const parentId = folderId ?? null;
  const { mutate: reorderVersionStack } = useReorderVersionStack();

  const { selectedVersionStackId } = useLibraryStore();

  // const { filters, filterMatchType, isFlattened, sorts, search } = useLibraryFilterState(); // Commented out

  const { data } = useLibraryContentsQuery(parentId, {
    filters: [], // Provide default
    sorts: [], // Provide default
    searchQuery: "", // Provide default
    flatten: false, // Provide default
    matchType: "all", // Provide default
  });

  const allResults = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  const version = allResults.find(
    (result) => result.id === selectedVersionStackId
  ) as VersionStackAsset;

  useEffect(() => {
    if (version && version?.versions?.length > 0) {
      setVersionsState(version.versions);
    }
  }, [version]);

  const versionsBeingRemoved = useMutationState({
    filters: {
      mutationKey: ["remove-from-version"],
      status: "pending",
    },
    select: (mutation) => {
      const variables = mutation.state
        .variables as RemoveFileFromVersionStackPayload;
      return variables.version_stack_item_id;
    },
  });

  if (!version || version.resourcetype !== "VersionStack" || !versionsState)
    return null;

  const versions = version?.versions ?? [];
  const version_stack_id = version.id ?? "";

  const animateLayoutChanges: AnimateLayoutChanges = (
    args: AnimateLayoutChangesCallbackArgs
  ) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const activeVersion = versionsState.find(
    (version) => version.id === activeId
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = versions.findIndex(
        (version) => version.id === active.id
      );
      const newIndex = versions.findIndex((version) => version.id === over.id);

      setVersionsState((prevVersionsState) =>
        prevVersionsState
          ? arrayMove(prevVersionsState, oldIndex, newIndex)
          : prevVersionsState
      );

      const new_order = arrayMove(
        versions.map((version) => version.file.id),
        oldIndex,
        newIndex
      );

      reorderVersionStack(
        {
          new_order,
          version_stack_id,
        },
        {
          onError: () => {
            toast.error(<ToastFallback title="Failed to reorder versions" />);
          },
        }
      );

      setActiveId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader>Manage versions</ModalHeader>
        <ModalBody>
          <div className={cn("flex gap-4", activeId && "cursor-grabbing")}>
            <div className="flex flex-shrink-0 flex-col gap-2">
              {Array.from({ length: versions.length }).map((_, index) => (
                <div
                  key={version.id}
                  className="flex h-16 min-w-0 items-center justify-center"
                >
                  <div
                    key={index}
                    className="flex h-6 w-8 min-w-0 items-center justify-center rounded-lg bg-default-200 px-1 font-medium text-ds-text-primary focus:outline-none"
                  >
                    v{versions.length - index}
                  </div>
                </div>
              ))}
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragStart={({ active }) => {
                if (!active) {
                  return;
                }
                setActiveId(active.id);
              }}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                disabled={versionsBeingRemoved?.length > 0}
                items={versionsState}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex w-full min-w-0 flex-col gap-2">
                  {versionsState.map((version) => (
                    <VersionItem
                      key={version.id}
                      version={version}
                      version_stack_id={version_stack_id}
                      animateLayoutChanges={animateLayoutChanges}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeId && activeVersion ? (
                  <VersionItem
                    key={version.id}
                    version_stack_id={version_stack_id}
                    version={activeVersion}
                    animateLayoutChanges={animateLayoutChanges}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface VersionItemProps {
  version: VersionStackItem;
  version_stack_id: string;
  animateLayoutChanges: AnimateLayoutChanges;
}

const VersionItem = ({
  version,
  version_stack_id,
  animateLayoutChanges,
}: VersionItemProps) => {
  const { mutateAsync: removeFromVersionStack, isPending } =
    useRemoveFromVersionStack();

  const { folderId } = useParamsStateStore(); // Use store
  // const { folderId } = useParams() as { folderId?: string };
  const { data: configs } = useAutomationConfigs();

  const isEditingDisabled = useMemo(
    () =>
      (
        configs?.filter(
          (config) =>
            config.trigger_code === "on_file_creation" &&
            config.item_id === folderId &&
            config.action_code === "create_new_project"
        ) ?? []
      ).length > 0,
    [configs, folderId]
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: version.id,
    animateLayoutChanges,
    disabled: isPending || isEditingDisabled,
  });

  const { active } = useDndContext();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemoveFromVersionStack = () => {
    if (isEditingDisabled) return;
    toast.promise(
      removeFromVersionStack({
        version_stack_item_id: version.id,
        version_stack_id,
      }),
      {
        loading: <ToastProcess title="Removing file from version stack" />,
        success: <ToastSuccess title="File removed from version stack" />,
        error: <ToastError title="Failed to remove file from version stack" />,
      }
    );
  };

  return (
    <div
      className={cn(
        "flex h-16 min-w-0  cursor-grab flex-col justify-center gap-4 rounded-2xl px-2 py-3 hover:bg-ds-link-bg-hover",
        isDragging && "cursor-grabbing bg-ds-link-bg-hover opacity-20",
        active &&
          active?.id &&
          active?.id === version?.id &&
          "cursor-grabbing bg-ds-link-bg-hover",
        isEditingDisabled && "cursor-default"
      )}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          "flex w-full min-w-0 items-center justify-between gap-5",
          "group"
        )}
      >
        <div className="flex  w-full min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {!isEditingDisabled && (
              <DotGrid2X3
                size={24}
                className="flex-shrink-0 text-ds-menu-text-secondary"
              />
            )}
            <VersionItemContent version={version} isPending={isPending} />
          </div>
          <Tooltip
            content={
              isEditingDisabled
                ? "This version cannot be removed since it is part of a project workflow"
                : "Remove from stack"
            }
            delay={500}
          >
            <Button
              isIconOnly
              variant="light"
              onPress={handleRemoveFromVersionStack}
              isDisabled={isPending}
              isLoading={isPending}
              className={cn(
                "text-ds-text-secondary",
                isEditingDisabled && "cursor-default"
              )}
              aria-label="Remove from version stack"
            >
              <CircleX size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export const VersionItemContent = ({
  version,
  isPending = false,
}: {
  version: VersionStackItem;
  isPending?: boolean;
}) => {
  const { active } = useDndContext();

  const isEditorDraft =
    version.file.resourcetype === "File" &&
    version.file.file_extension === ".tdraft";
  const isDocument =
    version.file.resourcetype === "File" &&
    version.file.file_extension === ".tscript";
  const isCanvas =
    version.file.resourcetype === "File" &&
    version.file.file_extension === ".tboard";

  return (
    <div className="flex min-w-0 items-start gap-2">
      <div className="aspect-video h-10 flex-shrink-0 ">
        {version.file.resourcetype === "VideoFile" ||
        version.file.resourcetype === "ImageFile" ? (
          <Thumbnail
            fileName={version.file.name}
            thumbnailUrl={version.file.thumbnail || ""}
          />
        ) : version.file.resourcetype === "PhysicalAsset" ? (
          <PhysicalAssetThumbnail
            barcode={version.file.barcode}
            thumbnailUrl={version.file.asset_image || ""}
          />
        ) : (
          <FileCard fileExtension={version.file.file_extension} />
        )}
      </div>

      <Tooltip
        content={version?.file?.name}
        placement="top-start"
        isDisabled={!!active?.id}
      >
        <div className="flex min-w-0 flex-col overflow-hidden whitespace-nowrap">
          <h3 className="truncate">{version.file.name}</h3>
          {isPending ? (
            <div className="text-xs text-ds-button-primary-bg-hover">
              Removing version...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xs text-ds-text-secondary">
                {version.file.resourcetype === "File" ? (
                  <>
                    {isDocument
                      ? "Document"
                      : isCanvas
                      ? "Canvas"
                      : isEditorDraft
                      ? "Video Draft"
                      : prettyBytes(version.file.size)}
                  </>
                ) : (
                  getResourceType(version.file.resourcetype, false)
                )}
              </p>
              <Divider orientation="vertical" className="h-2" />
              <p className="text-xs text-ds-text-secondary">
                uploaded {formatDate(version.file.created_on)}
              </p>
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};
