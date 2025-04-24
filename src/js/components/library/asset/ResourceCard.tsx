import { useCallback, useMemo, useRef, useState, useTransition } from "react";

import { SelectionItemWrapper } from "@/context/selection-item";
import { useDndContext } from "@dnd-kit/core";
import { useDisclosure } from "@nextui-org/react";
import { useMutationState } from "@tanstack/react-query";
import { toast } from "sonner";

import { PermissionPayload } from "@/api-integration/types/library";

import { AlertModal } from "@/components/ui/modal/AlertModal";
import {
  ToastFallback,
  ToastProcess,
  ToastSuccess,
} from "@/components/ui/ToastContent";

import LibraryDraggable from "@/components/library/LibraryDraggable";
import { LibraryDroppable } from "@/components/library/LibraryDroppable";
import { DeleteModal } from "@/components/library/modals/DeleteModal";

import { useFileUpload } from "@/hooks/useFileUpload";
import { useTagger } from "@/hooks/useTagger";
import { useValidLibraryDrop } from "@/hooks/useValidLibraryDrop";

import {
  useDeleteAsset,
  useRenameAsset,
} from "@/api-integration/mutations/library";
import {
  AddFileToVersionStackPayload,
  LibraryAsset,
  SharedStatus,
  VersionStackAsset,
} from "@/api-integration/types/library";

import { useLibraryStore } from "@/stores/library-store";
import { useUploadsStore } from "@/stores/uploads-store";
import { useParamsStateStore } from "@/stores/params-state-store";

import { AssetCard } from "@/components/library/asset/AssetCard";
import { AudioCard } from "@/components/library/asset/AudioCard";
import { FileCard } from "@/components/library/asset/FileCard";
import { FolderCard } from "@/components/library/asset/FolderCard";
import { ImageCard } from "@/components/library/asset/ImageCard";
import { PhysicalAssetCard } from "@/components/library/asset/PhysicalAssetCard";

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
  const isSelected = selectedItems.some((item) => item.id === resource.id);

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
                  ? resource.thumbnail || undefined
                  : "",
              indexStatus:
                resource.resourcetype === "VideoFile"
                  ? resource.index_status
                  : undefined,
              permissions: resource.permissions,
              connection_id: resource.connection_id ?? null,
            },
          ]);
        });
      } else if (!isSelectedValue && isSelected) {
        startTransition(() => {
          setSelectedItems(
            selectedItems.filter((item) => item.id !== resource.id)
          );
        });
      }
    },
    [isSelected, setSelectedItems, resource, selectedItems]
  );

  const { mutateAsync: renameAsset } = useRenameAsset(
    isResourceVersionStack ? resource?.versions?.[0]?.file?.id : resource?.id
  );
  const { mutateAsync: deleteAsset } = useDeleteAsset(resource?.id);

  const resourceFile = isResourceVersionStack
    ? {
        ...resource?.versions?.[0]?.file,
        permissions: resource?.permissions, // Pass version stack permissions to the file
      }
    : resource;

  const { uploadFile } = useFileUpload(
    "library",
    folderId as string,
    undefined,
    undefined
  );

  const uploadFiles = async (files: File[]) => {
    toast.promise(
      uploadFile(files[0], null, resourceFile?.id, resourceFile?.id),
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
        // dropzoneDisabled={resource?.resourcetype === 'Folder'}
      >
        <LibraryDraggable id={resource.id} data={resource}>
          <SelectionItemWrapper
            isSelected={isSelected}
            handleSelected={handleSelected}
            boxRef={boxRef}
          >
            <div ref={boxRef} className="h-full w-full">
              <ResourceCardContent
                resource={resourceFile}
                versionStack={isResourceVersionStack ? resource : undefined}
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
                  resource?.resourcetype !== "Folder"
                    ? resource?.share_status
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
        description={resourceFile.name}
        onConfirm={async (value) => await renameAsset(value)}
        onOpenChange={onRenameModalOpenChange}
        actionText="Confirm"
        hasInput
        inputPlaceholder="New name"
        defaultValue={resourceFile?.name}
        defaultInputSelected
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        selectedItems={[
          {
            id: resource.id,
            name: resource.name,
            resourceType: resource.resourcetype,
            permissions: resource.permissions,
            connection_id: resource.connection_id ?? null,
          },
        ]}
        handleDelete={async () => {
          await deleteAsset();
          if (isSelected) {
            setSelectedItems(
              selectedItems.filter((item) => item.id !== resource.id)
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
    (upload) => upload.versionStackFileId === resource?.id
  );

  const activeFileUploadsInsideThisFolder = uploads.filter(
    (upload) => upload.parent === resource?.id
  );

  const activeFileUploadProgress = activeFileUploadsInsideThisFolder.reduce(
    (acc, upload) => ({
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
    versionStack?.id ?? resource?.id,
    versionStack?.resourcetype ?? resource?.resourcetype
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
      ? resource?.resourcetype === "Folder"
        ? "Drop file to upload inside folder"
        : "Drop file to upload as a version"
      : undefined;

  const itemPermissions = useMemo(() => {
    return versionStack ? versionStack.permissions : resource?.permissions;
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
      // { label: 'Edit thumbnail', value: 'edit-thumbnail' },
      { label: "Cut", value: "cut", isDisabled: !hasEditPermission },
      { label: "Copy", value: "copy", isDisabled: !hasEditPermission },
      // { label: 'Download', value: 'download' },
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

  // Create common props object
  const commonProps = {
    key: resource.id,
    assetId: resource.id,
    fileName: resource.name,
    isDisabled: filesBeingAddedAsVersions.includes(resource.id),
    versionStack,
    resourceActions,
    viewId,
    showDropzone: !!activeText,
    activeText,
    permissions: versionStack
      ? versionStack.permissions
      : resource?.permissions,
    connectionId: resource.connection_id ?? null,
    ...(resource.resourcetype !== "Folder" && {
      fileStatus: showFileStatus ? resource.file_status : undefined,
      commentsCount: showCommentsCount ? resource.comments_count : undefined,
      sharedStatus: sharedStatus ?? resource.share_status,
    }),
  };

  switch (resource.resourcetype) {
    case "Folder":
      return (
        <FolderCard
          {...commonProps}
          key={resource.id}
          folderId={resource.id}
          folderName={resource.name}
          subcontents={resource.sub_contents}
          isConnectedFolder={!!resource.connection_id}
          childrenCount={resource.children_count}
          actions={actions}
        />
      );
    case "VideoFile":
      return (
        <AssetCard
          {...commonProps}
          key={resource.id}
          fileSize={resource.size}
          thumbnailUrl={resource.thumbnail || ""}
          scrubUrl={resource.scrub_url}
          duration={resource.duration}
          isHiRes={resource.file_extension === "mxf"}
          scrubWidth={resource.scrub_width}
          scrubHeight={resource.scrub_height}
          showTagging={showTagging}
          taggingStatus={resource.tagging_status}
          indexStatus={resource.index_status}
          indexPercent={resource.index_percent}
          actions={fileActions}
        />
      );
    case "ImageFile":
      return (
        <ImageCard
          {...commonProps}
          key={resource.id}
          assetId={resource.id}
          fileName={resource.name}
          fileSize={resource.size}
          thumbnailUrl={resource.thumbnail || ""}
          resolution={resource.resolution}
          fileStatus={showFileStatus ? resource.file_status : undefined}
          commentsCount={
            showCommentsCount ? resource.comments_count : undefined
          }
          isDisabled={filesBeingAddedAsVersions.includes(resource.id)}
          versionStack={versionStack}
          resourceActions={resourceActions}
          viewId={viewId}
          showDropzone={!!activeText}
          activeText={activeText}
          actions={fileActions}
          permissions={resource?.permissions}
        />
      );
    case "PhysicalAsset":
      return (
        <PhysicalAssetCard
          {...commonProps}
          key={resource.id}
          assetId={resource.id}
          assetName={resource.name}
          assetImage={resource.asset_image || ""}
          barcode={resource.barcode}
          location={resource.location}
          isDisabled={filesBeingAddedAsVersions.includes(resource.id)}
          versionStack={versionStack}
          resourceActions={resourceActions}
          viewId={viewId}
          showDropzone={!!activeText}
          activeText={activeText}
          actions={fileActions}
          permissions={resource?.permissions}
        />
      );
    case "AudioFile":
      return (
        <AudioCard
          {...commonProps}
          key={resource.id}
          assetId={resource.id}
          fileName={resource.name}
          duration={resource.duration}
          fileStatus={showFileStatus ? resource.file_status : undefined}
          commentsCount={
            showCommentsCount ? resource.comments_count : undefined
          }
          isDisabled={filesBeingAddedAsVersions.includes(resource.id)}
          versionStack={versionStack}
          resourceActions={resourceActions}
          viewId={viewId}
          showDropzone={!!activeText}
          activeText={activeText}
          actions={fileActions}
          permissions={resource?.permissions}
        />
      );
    default:
      return (
        <FileCard
          {...commonProps}
          key={resource.id}
          assetId={resource.id}
          fileName={resource.name}
          fileSize={resource.size}
          fileStatus={showFileStatus ? resource.file_status : undefined}
          commentsCount={
            showCommentsCount ? resource.comments_count : undefined
          }
          fileExtension={resource.file_extension}
          isDisabled={filesBeingAddedAsVersions.includes(resource.id)}
          versionStack={versionStack}
          resourceActions={resourceActions}
          viewId={viewId}
          showDropzone={!!activeText}
          activeText={activeText}
          actions={fileActions}
          permissions={resource?.permissions}
        />
      );
  }
};
