import { useCallback, useMemo, useRef, useState, useTransition } from "react";

// import dynamic from 'next/dynamic';
// import { useParams } from 'next/navigation';

import { SelectionItemWrapper } from "../../../context/selection-item";
import { useDndContext } from "@dnd-kit/core";
import { useDisclosure } from "@nextui-org/react";
import { useMutationState } from "@tanstack/react-query";
import { toast } from "sonner";

import { AlertModal } from "../../ui/modal/AlertModal";
import {
  ToastFallback,
  ToastProcess,
  ToastSuccess,
} from "../../ui/ToastContent";

import LibraryDraggable from "../LibraryDraggable";
import { LibraryDroppable } from "../LibraryDroppable";
import { DeleteModal } from "../modals/DeleteModal";
import { PermissionPayload } from "../../security-groups/files-folders/PermissionDropdown";

import { useFileUpload } from "../../../hooks/useFileUpload";
import { useTagger } from "../../../hooks/useTagger";
import { useValidLibraryDrop } from "../../../hooks/useValidLibraryDrop";

import {
  useDeleteAsset,
  useRenameAsset,
} from "../../../api-integration/mutations/library";
import {
  AddFileToVersionStackPayload,
  LibraryAsset,
  SharedStatus,
  VersionStackAsset,
  Folder,
  VideoAsset,
  ImageAsset,
  PhysicalAsset,
  AudioAsset,
  FileAsset,
  // LibrarySelectionItem,
} from "../../../api-integration/types/library";

import { useLibraryStore } from "../../../stores/library-store";
import { useUploadsStore, FileUpload } from "../../../stores/uploads-store";
import { useParamsStateStore } from "../../../stores/params-state-store";

import { AssetCard } from "./AssetCard";
import { AudioCard } from "./AudioCard";
import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";
import { ImageCard } from "./ImageCard";
import { PhysicalAssetCard } from "./PhysicalAssetCard";

export interface ResourceSpecificCardProps {
  // Common props across all cards
  assetId: string;
  fileName: string; // name prop (folderName in FolderCard)
  href?: string;
  versionStack?: VersionStackAsset;
  isDisabled?: boolean;
  resourceActions?: ResourceCardActions;
  viewId?: string;
  showDropzone?: boolean;
  activeText?: string;
  actions: {
    label: string;
    value: string;
  }[];
  permissions?: PermissionPayload[];
  sharedStatus?: SharedStatus | null;
  connectionId?: string | null;
}

interface ResourceCardProps {
  resource: LibraryAsset;
  viewId?: string;
}

export const ResourceCard = ({ resource, viewId }: ResourceCardProps) => {
  const isResourceVersionStack = resource.resourcetype === "VersionStack";
  const { folderId } = useParamsStateStore();
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const {
    isOpen: isRenameModalOpen,
    onOpen: onRename,
    onOpenChange: onRenameModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDelete,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();

  const { selectedItems, setSelectedItems } = useLibraryStore();

  const boxRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedItems.some(
    (item: LibraryAsset) => item.id === resource.id
  );

  const [, startTransition] = useTransition();

  const handleSelected = useCallback(
    (isSelectedValue: boolean) => {
      if (isSelectedValue && !isSelected) {
        startTransition(() => {
          setSelectedItems([
            ...selectedItems,
            {
              id: resource.id,
              name: resource.name,
              resourceType: resource.resourcetype,
              thumbnail:
                resource.resourcetype === "VideoFile"
                  ? (resource as VideoAsset).thumbnail || undefined
                  : "",
              indexStatus:
                resource.resourcetype === "VideoFile"
                  ? (resource as VideoAsset).index_status
                  : undefined,
              permissions: resource.permissions,
              connection_id: resource.connection_id ?? null,
            },
          ]);
        });
      } else if (!isSelectedValue && isSelected) {
        startTransition(() => {
          setSelectedItems(
            selectedItems.filter(
              (item: LibraryAsset) => item.id !== resource.id
            )
          );
        });
      }
    },
    [isSelected, setSelectedItems, resource, selectedItems]
  );

  const isVersionStack = (res: LibraryAsset): res is VersionStackAsset =>
    res.resourcetype === "VersionStack";

  const resourceId = isVersionStack(resource)
    ? resource.versions?.[0]?.file?.id
    : resource.id;
  const resourceName = isVersionStack(resource)
    ? resource.versions?.[0]?.file?.name ?? resource.name
    : resource.name;
  const resourcePermissions = resource.permissions;
  const resourceConnectionType = resource.connection_id;

  const { mutateAsync: renameAsset } = useRenameAsset(resourceId ?? "");
  const { mutateAsync: deleteAsset } = useDeleteAsset(resource.id);

  const resourceFile = isVersionStack(resource)
    ? {
        ...resource.versions?.[0]?.file,
        permissions: resource.permissions,
      }
    : resource;

  if (!resourceFile) return null;

  const { uploadFile } = useFileUpload(
    "library",
    folderId as string,
    undefined,
    undefined
  );

  const uploadFiles = async (files: File[]) => {
    toast.promise(
      uploadFile(files[0], null, resourceFile.id, resourceFile.id),
      {
        loading: <ToastProcess title={`Uploading file as new version`} />,
        success: <ToastSuccess title={`Uploaded new file as version`} />,
        error: (
          <ToastFallback title={`Failed to upload new file as version}`} />
        ),
      }
    );
  };

  return (
    <>
      <LibraryDroppable
        id={resource.id}
        data={resource}
        setIsDropzoneActive={setIsDropzoneActive}
      >
        <LibraryDraggable id={resource.id} data={resource}>
          <SelectionItemWrapper
            isSelected={isSelected}
            handleSelected={handleSelected}
            boxRef={boxRef}
          >
            <div ref={boxRef} className="h-full w-full">
              <ResourceCardContent
                resource={
                  resourceFile as Exclude<LibraryAsset, VersionStackAsset>
                }
                versionStack={isVersionStack(resource) ? resource : undefined}
                isDropzoneActive={isDropzoneActive}
                resourceActions={{
                  onRename,
                  onDelete,
                  onVersionUpload: () => {
                    if (uploadInputRef.current) {
                      uploadInputRef.current.click();
                    }
                  },
                }}
                viewId={viewId}
                sharedStatus={
                  resource.resourcetype !== "Folder"
                    ? resource.share_status
                    : undefined
                }
              />
            </div>
          </SelectionItemWrapper>
        </LibraryDraggable>
      </LibraryDroppable>
      <input
        type="file"
        ref={uploadInputRef}
        hidden
        onChange={(e) => {
          uploadFiles(Array.from(e.target.files || []));
        }}
      />
      <AlertModal
        isOpen={isRenameModalOpen}
        title="Rename"
        description={resourceName}
        onConfirm={async (value: string) => await renameAsset(value)}
        onOpenChange={onRenameModalOpenChange}
        actionText="Confirm"
        hasInput
        inputPlaceholder="New name"
        defaultValue={resourceName}
        defaultInputSelected
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        selectedItems={[
          {
            id: resource.id,
            name: resourceName,
            resourceType: resource.resourcetype,
            permissions: resourcePermissions,
            connection_id: resourceConnectionType ?? null,
          },
        ]}
        handleDelete={async () => {
          await deleteAsset();
          if (isSelected) {
            setSelectedItems(
              selectedItems.filter(
                (item: LibraryAsset) => item.id !== resource.id
              )
            );
          }
        }}
      />
    </>
  );
};

export type ResourceCardActions = {
  onRename?: () => void;
  onDelete?: () => void;
  onVersionUpload?: () => void;
};

interface ResourceCardContentProps {
  resource: Exclude<LibraryAsset, VersionStackAsset>;
  resourceActions?: ResourceCardActions;
  versionStack?: VersionStackAsset;
  viewId?: string;
  isDropzoneActive?: boolean;
  sharedStatus?: SharedStatus | null;
}

const ResourceCardContent = ({
  resource,
  resourceActions,
  versionStack,
  viewId,
  isDropzoneActive,
  sharedStatus,
}: ResourceCardContentProps) => {
  const showFileStatus = true;
  const showCommentsCount = true;

  const { showTagging } = useTagger();

  const { uploads } = useUploadsStore();
  const activeVersionUploadsOnThisAsset = uploads.find(
    (upload: FileUpload) => upload.versionStackFileId === resource?.id
  );

  const activeFileUploadsInsideThisFolder = uploads.filter(
    (upload: FileUpload) => upload.parent === resource?.id
  );

  const activeFileUploadProgress = activeFileUploadsInsideThisFolder.reduce(
    (acc: { sizeUploaded: number; totalSize: number }, upload: FileUpload) => ({
      sizeUploaded: acc.sizeUploaded + upload.sizeUploaded,
      totalSize: acc.totalSize + upload.totalSize,
    }),
    { sizeUploaded: 0, totalSize: 0 }
  );

  const filesBeingAddedAsVersions = useMutationState({
    filters: {
      status: "pending",
      mutationKey: ["add-version-stack"],
    },
    select: (mutation) => {
      const payload = mutation.state.variables as AddFileToVersionStackPayload;
      return payload.file_ids;
    },
  }).flatMap((f) => f);

  const { over } = useDndContext();
  const overData = over?.data?.current as LibraryAsset;

  const isValidDrop = useValidLibraryDrop(
    versionStack?.id ?? resource.id,
    versionStack?.resourcetype ?? resource.resourcetype
  );

  const activeText =
    activeFileUploadsInsideThisFolder?.length > 0 &&
    activeFileUploadProgress?.totalSize > 0
      ? `Uploading files ${Math.round(
          (activeFileUploadProgress?.sizeUploaded * 100) /
            activeFileUploadProgress?.totalSize
        )}%`
      : activeVersionUploadsOnThisAsset
      ? `Uploading version ${Math.round(
          (activeVersionUploadsOnThisAsset.sizeUploaded * 100) /
            activeVersionUploadsOnThisAsset.totalSize
        )}%`
      : isValidDrop
      ? overData?.resourcetype === "Folder"
        ? `Drop here to move into this folder`
        : "Drop file to add as a version"
      : isDropzoneActive
      ? resource.resourcetype === "Folder"
        ? "Drop file to upload inside folder"
        : "Drop file to upload as a version"
      : undefined;

  const itemPermissions = useMemo(() => {
    return versionStack ? versionStack.permissions : resource.permissions;
  }, [versionStack, resource]);

  const hasEditPermission = useMemo(
    () => itemPermissions?.includes("can_edit_asset"),
    [itemPermissions]
  );
  const hasDeletePermission = useMemo(
    () => itemPermissions?.includes("can_delete_asset"),
    [itemPermissions]
  );

  const actions = useMemo(() => {
    const options = [
      {
        label: "Rename",
        value: "rename",
        isDisabled: !hasEditPermission,
      },
      { label: "Cut", value: "cut", isDisabled: !hasEditPermission },
      { label: "Copy", value: "copy", isDisabled: !hasEditPermission },
      { label: "Delete", value: "delete", isDisabled: !hasDeletePermission },
    ];
    return options
      .filter((option) => !option.isDisabled)
      .map(({ label, value }) => ({ label, value }));
  }, [hasDeletePermission, hasEditPermission]);

  const fileActions = useMemo(
    () => [{ label: "Upload a version", value: "upload-version" }, ...actions],
    [actions]
  );

  const commonProps: Omit<ResourceSpecificCardProps, "href" | "key"> = {
    assetId: resource.id,
    fileName: resource.name,
    isDisabled: filesBeingAddedAsVersions.includes(resource.id),
    versionStack,
    resourceActions,
    viewId,
    showDropzone: !!activeText,
    activeText,
    permissions: itemPermissions,
    connectionId: resource.connection_id ?? null,
    actions: [],
    ...(resource.resourcetype !== "Folder" && {
      fileStatus: showFileStatus
        ? (resource as Exclude<LibraryAsset, Folder>).file_status
        : undefined,
      commentsCount: showCommentsCount
        ? (resource as Exclude<LibraryAsset, Folder>).comments_count
        : undefined,
      sharedStatus:
        sharedStatus ??
        (resource as Exclude<LibraryAsset, Folder>).share_status,
    }),
  };

  switch (resource.resourcetype) {
    case "Folder":
      return (
        <FolderCard
          {...commonProps}
          folderId={resource.id}
          folderName={resource.name}
          subcontents={(resource as Folder).sub_contents}
          isConnectedFolder={!!resource.connection_id}
          childrenCount={(resource as Folder).children_count}
          actions={actions}
        />
      );
    case "VideoFile":
      return (
        <AssetCard
          {...commonProps}
          fileSize={(resource as VideoAsset).size}
          thumbnailUrl={(resource as VideoAsset).thumbnail || ""}
          scrubUrl={(resource as VideoAsset).scrub_url}
          duration={(resource as VideoAsset).duration}
          isHiRes={(resource as VideoAsset).file_extension === "mxf"}
          scrubWidth={(resource as VideoAsset).scrub_width}
          scrubHeight={(resource as VideoAsset).scrub_height}
          showTagging={showTagging}
          taggingStatus={(resource as VideoAsset).tagging_status}
          indexStatus={(resource as VideoAsset).index_status}
          indexPercent={(resource as VideoAsset).index_percent}
          actions={fileActions}
        />
      );
    case "ImageFile":
      return (
        <ImageCard
          {...commonProps}
          fileSize={(resource as ImageAsset).size}
          thumbnailUrl={(resource as ImageAsset).thumbnail || ""}
          resolution={(resource as ImageAsset).resolution}
          actions={fileActions}
        />
      );
    case "PhysicalAsset":
      return (
        <PhysicalAssetCard
          {...commonProps}
          assetId={resource.id}
          assetName={resource.name}
          assetImage={(resource as PhysicalAsset).asset_image || ""}
          barcode={(resource as PhysicalAsset).barcode}
          location={(resource as PhysicalAsset).location}
          actions={fileActions}
        />
      );
    case "AudioFile":
      return (
        <AudioCard
          {...commonProps}
          duration={(resource as AudioAsset).duration}
          actions={fileActions}
        />
      );
    default:
      return (
        <FileCard
          {...commonProps}
          fileSize={(resource as FileAsset).size}
          fileExtension={(resource as FileAsset).file_extension}
          actions={fileActions}
        />
      );
  }
};
