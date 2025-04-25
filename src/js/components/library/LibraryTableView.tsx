import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// import { useParams, useRouter } from 'next/navigation';

import { useMediaQuery } from "@mantine/hooks";
import { cn, Image, Skeleton, useDisclosure } from "@nextui-org/react";
import { motion } from "framer-motion";
import prettyBytes from "pretty-bytes";
import Barcode from "react-barcode";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import {
  BubbleText6,
  DotGrid1X3Horizontal,
  Folder1Filled,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import {
  ToastFallback,
  ToastProcess,
  ToastSuccess,
} from "@/components/ui/ToastContent";

import { VersionModalButton } from "@/components/library/asset/VersionModalButton";
import { DeleteModal } from "@/components/library/modals/DeleteModal";
import { FetchingNextPageIndicator } from "./FetchNextPageIndicator";
import { Table } from "../ui/Table";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useFileUpload } from "@/hooks/useFileUpload";

import {
  useDeleteAsset,
  useDeleteTableAsset,
  useRenameAsset,
  useRenameTableAsset,
} from "@/api-integration/mutations/library";
import { LibraryAsset, ResourceType } from "@/api-integration/types/library";

import { useLibraryStore } from "@/stores/library-store";
import { FileUpload, useUploadsStore } from "@/stores/uploads-store";

import { useParamsStateStore } from "@/stores/params-state-store";

import { Column } from "@/types/table";

import { formatDate } from "@/utils/dates";
import { REMIXES_FLAG } from "@/utils/featureFlagUtils";
import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import { StatusDropdown } from "./StatusDropdown";
import { getIcon } from "./thumbnail/IconThumbnail";

interface LibraryTableViewProps {
  data: LibraryAsset[];
  uploads: FileUpload[];
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetching: boolean;
  showStatusDropdown?: boolean;
  showTaggingDropdown?: boolean;
  showCommentsCount?: boolean;
  emptyStateComponent?: React.ReactNode;
}

export const getResourceType = (
  resourcetype: ResourceType,
  connection: boolean
) => {
  if (resourcetype === "Folder" && connection) return "Connected folder";
  if (resourcetype === "AudioFile") return "Audio file";
  if (resourcetype === "VideoFile") return "Video file";
  if (resourcetype === "Folder") return "Folder";
  if (resourcetype === "ImageFile") return "Image file";
  if (resourcetype === "File") return "File";
  if (resourcetype === "PhysicalAsset") return "Physical asset";
};

export const LibraryTableView = ({
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetching,
  showStatusDropdown,
  showCommentsCount,
  uploads,
  emptyStateComponent,
}: LibraryTableViewProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const {
    selectedItems,
    setSelectedItems,
    clearSelectedItems,
    setSelectedClipboardAction,
    addOrRemoveItem,
  } = useLibraryStore();

  const isRemixesEnabled = useFeatureFlag(REMIXES_FLAG);

  // const dataWithVersions: LibraryAsset[] = useMemo(() => {
  //   return (
  //     data.map((asset) => {
  //       if (asset.resourcetype === 'VersionStack') {
  //         const highestVersion = asset.versions.reduce((prev, current) =>
  //           prev.version_number > current.version_number ? prev : current
  //         );

  //         const resource = highestVersion.file;
  //         return resource;
  //       }
  //       return asset;
  //     }) ?? []
  //   );
  // }, [data]);

  const [selectedRow, setSelectedRow] = useState<LibraryAsset | null>(null);

  // const { folderId } = useParams() as { folderId?: string };

  const { folderId } = useParamsStateStore();

  const [rightClickedFile, setRightClickedFile] = useState<{
    versionStackId: string;
    versionStackFileId: string;
  } | null>(null);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload(
    "library",
    folderId || null,
    undefined,
    undefined
  );

  const uploadFiles = async (files: File[]) => {
    if (!rightClickedFile || !files.length) return;
    toast.promise(
      uploadFile(
        files[0],
        null,
        rightClickedFile?.versionStackId,
        rightClickedFile?.versionStackFileId
      ),
      {
        loading: <ToastProcess title={`Uploading file as new version`} />,
        success: <ToastSuccess title={`Uploaded new file as version`} />,
        error: (
          <ToastFallback title={`Failed to upload new file as version}`} />
        ),
      }
    );
  };

  const handleUploadVersion = useCallback(
    (row: LibraryAsset) => {
      if (uploadInputRef?.current) {
        setRightClickedFile({
          versionStackId: row?.id,
          versionStackFileId:
            row?.resourcetype === "VersionStack"
              ? row?.versions?.[0]?.file?.id
              : row?.id,
        });
        uploadInputRef.current.click();
      }
    },
    [uploadInputRef, setRightClickedFile]
  );

  // const router = useRouter();

  const selectedData = useMemo(() => {
    return selectedItems
      .map((item) => data.find((asset) => asset.id === item.id))
      .filter((item) => item !== undefined);
  }, [selectedItems, data]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetching]);

  const columns: Column<LibraryAsset>[] = useMemo(() => {
    const baseColumns: Column<LibraryAsset>[] = [
      {
        header: "Asset",
        key: "asset",
        label: "Asset",
        cell: ({ row }) => {
          const resource =
            row?.resourcetype === "VersionStack" ? row.versions[0].file : row;

          return (
            <div className="flex items-center gap-3">
              <div className="aspect-video h-10">
                {resource.resourcetype === "VideoFile" ||
                resource.resourcetype === "ImageFile" ? (
                  <Thumbnail
                    fileName={resource.name}
                    thumbnailUrl={resource.thumbnail || ""}
                  />
                ) : resource.resourcetype === "PhysicalAsset" ? (
                  <PhysicalAssetThumbnail
                    barcode={resource.barcode}
                    thumbnailUrl={resource.asset_image || ""}
                  />
                ) : resource.resourcetype === "Folder" ? (
                  <FolderCard />
                ) : (
                  <FileCard />
                )}
              </div>
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <h3 className="truncate">{resource.name}</h3>
                  {row?.resourcetype === "VersionStack" ? (
                    <VersionModalButton versionStack={row} />
                  ) : null}
                </div>
                <p
                  className={cn(
                    "flex items-center gap-1 text-xs text-ds-text-secondary"
                    // activeText && 'text-ds-text-primary'
                  )}
                >
                  <VersionUploadActiveText
                    id={resource?.id}
                    fallbackText={getResourceType(
                      resource.resourcetype,
                      !!(
                        resource.resourcetype === "Folder" &&
                        resource.connection_id
                      )
                    )}
                  />
                </p>
              </div>
            </div>
          );
        },
        isSortable: false,
        minWidth: 400,
        maxWidth: 800,
        isResizable: true,
      },
    ];
    if (!isMobile) {
      baseColumns.push({
        header: "Uploaded on",
        key: "uploadedOn",
        label: "Uploaded on",
        cell: ({ row }) => {
          const resource =
            row?.resourcetype === "VersionStack"
              ? row?.versions?.[0]?.file
              : row;
          return <div>{formatDate(resource?.created_on)}</div>;
        },
        isSortable: false,
        minWidth: 150,
        maxWidth: 300,
        isResizable: true,
      });

      baseColumns.push({
        header: "Size",
        key: "size",
        label: "Size",
        cell: ({ row }) => {
          const resource =
            row?.resourcetype === "VersionStack"
              ? row?.versions?.[0].file
              : row;

          if (
            resource.resourcetype === "PhysicalAsset" ||
            resource.resourcetype === "Folder"
          ) {
            return "";
          } else {
            return <div>{prettyBytes(resource?.size)}</div>;
          }
        },
        isSortable: false,
        minWidth: 150,
        maxWidth: 300,
        isResizable: true,
      });

      if (showStatusDropdown) {
        baseColumns.push({
          header: "Status",
          key: "status",
          label: "Status",
          cell: ({ row }) => {
            const resource =
              row?.resourcetype === "VersionStack"
                ? row?.versions?.[0].file
                : row;

            return resource.resourcetype === "Folder" ||
              resource.resourcetype === "PhysicalAsset" ? (
              <div></div>
            ) : (
              <StatusDropdown
                assetId={resource.id}
                status={resource?.file_status}
                variant="pill"
              />
            );
          },
          isSortable: false,
          minWidth: 200,
          maxWidth: 350,
          isResizable: true,
        });
      }

      if (showCommentsCount) {
        baseColumns.push({
          header: "Comments",
          key: "comments",
          label: "Comments",
          cell: ({ row }) => {
            const resource =
              row?.resourcetype === "VersionStack"
                ? row?.versions?.[0].file
                : row;
            return resource.resourcetype === "Folder" ||
              resource.resourcetype === "PhysicalAsset" ? (
              <div></div>
            ) : (
              <div className="flex items-center gap-0.5 px-2 text-ds-text-secondary">
                <BubbleText6 size={12} />
                {resource.comments_count}
              </div>
            );
          },
          isSortable: false,
          minWidth: 200,
          maxWidth: 350,
        });
      }

      baseColumns.push({
        header: "Actions",
        key: "actions",
        label: "Actions",
        cell: ({ row }) => {
          return (
            <ThreeDotMenu
              // assetId={row.id}
              // fileName={row.name}
              asset={row}
              isSelected={selectedItems.some((item) => item.id === row.id)}
              isConnected={!!row?.connection_id}
              // isConnectedFolder={row?.resourcetype === 'Folder' && !!row?.connection_id}
              // resourceType={row.resourcetype}
              // permissions={row?.permissions || []}
              handleUploadVersion={handleUploadVersion}
            />
          );
        },
        isSortable: false,
        isResizable: true,
        minWidth: 150,
        maxWidth: 250,
      });
    }

    return baseColumns;
  }, [
    selectedItems,
    showStatusDropdown,
    showCommentsCount,
    handleUploadVersion,
    isMobile,
  ]);

  const { mutate: renameAsset } = useRenameTableAsset();
  const { mutate: deleteAsset } = useDeleteTableAsset();

  const { isOpen: isRenameModalOpen, onOpenChange: onRenameModalOpenChange } =
    useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } =
    useDisclosure();

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col",
        isMobile && "pl-2.5"
      )}
    >
      <Table
        columns={columns}
        data={data}
        tableId="library"
        hasTableHeader={false}
        isColumnDragEnabled={!isMobile}
        isSelectionEnabled={!isMobile}
        isLoading={isLoading}
        isRowDragEnabled={false}
        searchQuery=""
        emptyStateComponent={emptyStateComponent}
        hasRightClickMenu={true}
        rightClickMenuOptions={(row) => {
          const isFolder = row.resourcetype === "Folder";
          const isConnectedFolder = isFolder && !!row.connection_id;

          const hasEditPermission =
            !!row?.permissions?.includes?.("can_edit_asset");
          const hasDeletePermission =
            !!row?.permissions?.includes("can_delete_asset");

          return [
            ...(isConnectedFolder || !hasEditPermission
              ? []
              : [
                  {
                    label: "Rename",
                    key: "rename",
                    onAction: (id: string) => {
                      const row = data.find((item) => item.id === id);
                      const resource =
                        row?.resourcetype === "VersionStack"
                          ? row?.versions?.[0].file
                          : row;
                      if (resource) {
                        setSelectedRow(resource);
                        onRenameModalOpenChange();
                      }
                    },
                  },
                ]),
            ...(hasEditPermission
              ? [
                  {
                    label: "Cut",
                    key: "cut",
                    onAction: () => {
                      clearSelectedItems();
                      addOrRemoveItem({
                        id: row.id,
                        name: row.name,
                        resourceType: row.resourcetype,
                        thumbnail:
                          row.resourcetype === "VideoFile" ||
                          row.resourcetype === "ImageFile"
                            ? row.thumbnail || undefined
                            : "",
                        indexStatus:
                          row.resourcetype === "VideoFile"
                            ? row.index_status
                            : undefined,
                        permissions: row?.permissions || [],
                        connection_id: row?.connection_id ?? null,
                      });
                      setSelectedClipboardAction("cut");
                    },
                  },
                  {
                    label: "Copy",
                    key: "copy",
                    onAction: () => {
                      clearSelectedItems();
                      addOrRemoveItem({
                        id: row.id,
                        name: row.name,
                        resourceType: row.resourcetype,
                        thumbnail:
                          row.resourcetype === "VideoFile" ||
                          row.resourcetype === "ImageFile"
                            ? row.thumbnail || undefined
                            : "",
                        indexStatus:
                          row.resourcetype === "VideoFile"
                            ? row.index_status
                            : undefined,
                        permissions: row?.permissions || [],
                        connection_id: row?.connection_id ?? null,
                      });
                      setSelectedClipboardAction("copy");
                    },
                  },
                ]
              : []),
            ...(!isFolder
              ? [
                  {
                    label: "Upload a version",
                    key: "upload-version",
                    onAction: () => {
                      handleUploadVersion(row);
                    },
                  },
                ]
              : [
                  {
                    label: "View metadata",
                    key: "view-metadata",
                    onAction: () => {
                      // router.push(`/library/folder/${row?.id}/metadata`);
                    },
                  },
                ]),
            ...(hasDeletePermission
              ? [
                  {
                    label: "Delete",
                    key: "delete",
                    onAction: (id: string) => {
                      const row = data.find((item) => item.id === id);
                      if (row) {
                        setSelectedRow(row);
                        onDeleteModalOpenChange();
                      }
                    },
                  },
                ]
              : []),
          ];
        }}
        onSearchQueryChange={() => {}}
        onRowClick={(row: LibraryAsset) => {
          const isVersionStack = row?.resourcetype === "VersionStack";
          const resource = isVersionStack ? row?.versions?.[0].file : row;
          const versionParam = isVersionStack ? `?version=${resource?.id}` : "";
          if (row.resourcetype === "File" && row.file_extension === ".tdraft") {
            // router.push(`/library/video/${row?.id}${versionParam}`);
          } else {
            // router.push(
            //   row.resourcetype === "Folder"
            //     ? `/library/folder/${row.id}`
            //     : `/library/asset/${row?.id}${versionParam}`
            // );
          }
        }}
        selectedData={selectedData}
        setSelectedData={(assets: LibraryAsset[]) => {
          const newSelectedItems = Array.from(
            new Set([
              ...(assets?.map((asset) => ({
                id: asset.id,
                name: asset.name,
                resourceType: asset.resourcetype,
                thumbnail:
                  asset.resourcetype === "VideoFile" ||
                  asset.resourcetype === "ImageFile"
                    ? asset.thumbnail || undefined
                    : "",
                indexStatus:
                  asset.resourcetype === "VideoFile"
                    ? asset.index_status
                    : undefined,
                permissions: asset?.permissions || [],
                connection_id: asset?.connection_id ?? null,
              })) ?? []),
            ])
          );

          setSelectedItems(newSelectedItems);
        }}
        sortColumn={{
          key: "asset",
          order: "asc",
        }}
        setSortColumn={() => {}}
        loadingState={
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex w-full items-center gap-1">
              <Skeleton className="aspect-video h-10 rounded-md" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
            </div>
            <div className="flex w-full">
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="flex w-full">
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="flex w-full">
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          </div>
        }
        tableActions={null}
        paginationScrollRef={ref}
        scrollOffsetBottomPadding={
          isRemixesEnabled ? 164 : selectedItems.length ? 86 : 0
        }
        topContent={uploads.map((upload) => ({
          key: upload.uploadId,
          content: <UploadIndicator upload={upload} />,
        }))}
        hideColumnAddButton={isMobile}
        hideTableHead={isMobile}
      />
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
        description={selectedRow?.name}
        onConfirm={async (value) =>
          await renameAsset({
            newName: value,
            assetId: selectedRow?.id as string,
          })
        }
        onOpenChange={onRenameModalOpenChange}
        actionText="Confirm"
        hasInput
        inputPlaceholder="New name"
        defaultValue={selectedRow?.name}
      />
      {selectedRow && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onOpenChange={onDeleteModalOpenChange}
          selectedItems={[
            {
              id: selectedRow.id,
              name: selectedRow.name,
              resourceType: selectedRow.resourcetype,
              permissions: selectedRow.permissions,
              connection_id: selectedRow.connection_id ?? null,
            },
          ]}
          handleDelete={async () => {
            await deleteAsset({
              assetId: selectedRow?.id,
            });
            // if (isSelected) {
            //   setSelectedItems(selectedItems.filter((item) => item.id !== resource.id));
            // }
          }}
        />
      )}
      {/* <AlertModal
        isOpen={isDeleteModalOpen}
        title="Delete"
        description={`Are you sure you want to delete ${selectedRow?.name}?`}
        onConfirm={async () => {
          if (selectedRow) {
            await deleteAsset({ assetId: selectedRow.id });
          }
        }}
        onOpenChange={onDeleteModalOpenChange}
        actionText="Delete"
        danger
      ></AlertModal> */}
      <FetchingNextPageIndicator isFetching={isFetching} />
    </div>
  );
};

export const Thumbnail = ({
  fileName,
  thumbnailUrl,
}: {
  fileName: string;
  thumbnailUrl: string;
}) => {
  const { thumbnail } = useLibraryStore();

  return (
    <div
      className={cn(
        "relative rounded-lg bg-ds-asset-card-bg-hover",
        "overflow-hidden",
        "aspect-video h-10"
      )}
    >
      <div className="pointer-events-none absolute z-20 h-full w-full rounded-lg border border-black/[8%] bg-transparent dark:border-white/15"></div>
      <Image
        src={thumbnailUrl}
        alt={fileName}
        className={cn(
          "aspect-video",
          thumbnail === "fit" ? "object-contain" : "object-cover object-center",
          "rounded-none",
          "flex h-full max-h-full w-full max-w-full"
        )}
        classNames={{ wrapper: "flex h-full w-full max-w-full" }}
      />
    </div>
  );
};

export const PhysicalAssetThumbnail = ({
  barcode,
  thumbnailUrl,
}: {
  barcode: string;
  thumbnailUrl: string;
}) => {
  const { thumbnail } = useLibraryStore();

  return (
    <div
      className={cn(
        "relative rounded-lg bg-ds-asset-card-bg-hover",
        "overflow-hidden",
        "aspect-video h-10"
      )}
    >
      <div className="pointer-events-none absolute z-20 h-full w-full rounded-lg border border-black/[8%] bg-transparent dark:border-white/15"></div>
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={barcode}
          className={cn(
            "aspect-video",
            thumbnail === "fit"
              ? "object-contain"
              : "object-cover object-center",
            "rounded-none",
            "flex h-full max-h-full w-full max-w-full"
          )}
          classNames={{ wrapper: "flex h-full w-full" }}
        />
      ) : (
        <Barcode
          renderer="img"
          value={barcode}
          background="transparent"
          lineColor="currentColor"
          displayValue={false}
        />
      )}
    </div>
  );
};

export const FileCard = ({ fileExtension }: { fileExtension?: string }) => {
  return (
    <div className="aspect-video h-10">
      <div
        className={cn(
          "h-full w-full rounded-lg p-2 text-ds-text-secondary",
          "flex items-center justify-center",
          "transition-colors duration-200",
          "bg-ds-asset-card-bg-select"
        )}
      >
        {getIcon(fileExtension, 20)}
      </div>
    </div>
  );
};

export const FolderCard = () => {
  return (
    <div className="aspect-video h-10">
      <div
        className={cn(
          "h-full w-full rounded-lg p-2 text-ds-text-secondary",
          "flex items-center justify-center",
          "transition-colors duration-200",
          "bg-ds-asset-card-bg-select"
        )}
      >
        <Folder1Filled size={20} className="fill-ds-text-secondary" />
      </div>
    </div>
  );
};

const ThreeDotMenu = ({
  // assetId,
  // fileName,
  // resourceType,
  isSelected,
  isConnected,
  // isConnectedFolder,
  // permissions,
  asset,
  handleUploadVersion,
}: {
  asset: LibraryAsset;
  // assetId: string;
  // fileName: string;
  // resourceType: ResourceType;
  isConnected: boolean;
  isSelected: boolean;
  // isConnectedFolder?: boolean;
  // permissions: PermissionPayload[];
  handleUploadVersion?: (row: LibraryAsset) => void;
}) => {
  const { id: assetId, name: fileName, resourcetype: resourceType } = asset;

  const permissions = asset?.permissions ?? [];
  const isConnectedFolder =
    asset?.resourcetype === "Folder" && !!asset?.connection_id;

  const { mutate: renameAsset } = useRenameAsset(assetId);
  const { mutate: deleteAsset } = useDeleteAsset(assetId);

  const { isOpen: isRenameModalOpen, onOpenChange: onRenameModalOpenChange } =
    useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpenChange: onDeleteModalOpenChange } =
    useDisclosure();

  const { addOrRemoveItem, clearSelectedItems, setSelectedClipboardAction } =
    useLibraryStore();

  const hasEditPermission = !!permissions.includes("can_edit_asset");
  const hasDeletePermission = !!permissions.includes("can_delete_asset");

  // const router = useRouter();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            color="secondary"
            isIconOnly
            size="sm"
            aria-label="Library Table More options"
          >
            <DotGrid1X3Horizontal size={20} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) => {
            if (key === "rename") {
              onRenameModalOpenChange();
            }
            if (key === "cut") {
              clearSelectedItems();
              addOrRemoveItem({
                id: assetId,
                name: fileName,
                resourceType,
                permissions,
                connection_id: isConnected ? assetId : null,
              });
              setSelectedClipboardAction("cut");
            }
            if (key === "copy") {
              clearSelectedItems();
              addOrRemoveItem({
                id: assetId,
                name: fileName,
                resourceType,
                permissions,
                connection_id: isConnected ? assetId : null,
              });
              setSelectedClipboardAction("copy");
            }
            if (key === "delete") {
              onDeleteModalOpenChange();
            }
            if (key === "upload-version") {
              handleUploadVersion?.(asset);
            }
            if (key === "view-metadata") {
              // router.push(`/library/folder/${assetId}/metadata`);
            }
          }}
        >
          <DropdownItem
            key="rename"
            isDisabled={isConnectedFolder || !hasEditPermission}
            className={cn(
              (isConnectedFolder || !hasEditPermission) && "hidden"
            )}
          >
            Rename
          </DropdownItem>
          <DropdownItem
            key="cut"
            isDisabled={!hasEditPermission}
            className={cn(!hasEditPermission && "hidden")}
          >
            Cut
          </DropdownItem>
          <DropdownItem
            key="copy"
            isDisabled={!hasEditPermission}
            className={cn(!hasEditPermission && "hidden")}
          >
            Copy
          </DropdownItem>
          <DropdownItem
            key="upload-version"
            isDisabled={resourceType === "Folder"}
            className={cn(resourceType === "Folder" && "hidden")}
          >
            Upload a version
          </DropdownItem>
          <DropdownItem
            key="view-metadata"
            isDisabled={resourceType !== "Folder"}
            className={cn(resourceType !== "Folder" && "hidden")}
          >
            View metadata
          </DropdownItem>
          <DropdownItem
            key="delete"
            isDisabled={!hasDeletePermission}
            className={cn(!hasDeletePermission && "hidden")}
          >
            Delete
          </DropdownItem>
          {/* ...(!isFolder
              ? [
                  {
                    label: 'Upload a version',
                    key: 'upload-version',
                    onAction: () => {
                      if (uploadInputRef?.current) {
                        setRightClickedFile({
                          versionStackId: row?.id,
                          versionStackFileId:
                            row?.resourcetype === 'VersionStack'
                              ? row?.versions?.[0]?.file?.id
                              : row?.id
                        });
                        uploadInputRef.current.click();
                      }
                    }
                  }
                ]
              : [
                  {
                    label: 'View metadata',
                    key: 'view-metadata',
                    onAction: () => {
                      router.push(`/library/folder/${row?.id}/metadata`);
                    }
                  }
                ]), */}
        </DropdownMenu>
      </Dropdown>
      <AlertModal
        isOpen={isRenameModalOpen}
        title="Rename"
        description={fileName}
        onConfirm={async (value) => await renameAsset(value)}
        onOpenChange={onRenameModalOpenChange}
        actionText="Confirm"
        hasInput
        inputPlaceholder="New name"
        defaultValue={fileName}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        selectedItems={[
          {
            id: asset.id,
            name: asset.name,
            connection_id: asset.connection_id ?? null,
            resourceType: asset.resourcetype,
            permissions: asset.permissions,
          },
        ]}
        handleDelete={async () => {
          await deleteAsset();
          if (isSelected)
            addOrRemoveItem({
              id: assetId,
              name: fileName,
              resourceType,
              permissions,
              connection_id: isConnected ? assetId : null,
            });
        }}
        // selectedItems={[
        //   {
        //     id: resource.id,
        //     name: resource.name,
        //     resourceType: resource.resourcetype,
        //     permissions: resource.permissions,
        //     connection_id: resource.connection_id ?? null
        //   }
        // ]}
        // handleDelete={async () => {
        //   await deleteAsset();
        //   if (isSelected) {
        //     setSelectedItems(selectedItems.filter((item) => item.id !== resource.id));
        //   }
        // }}
      />
      {/* <AlertModal
        isOpen={isDeleteModalOpen}
        title="Delete"
        description={`Are you sure you want to delete ${fileName}?`}
        onConfirm={async () => {
          await deleteAsset();
          if (isSelected)
            addOrRemoveItem({
              id: assetId,
              name: fileName,
              resourceType,
              permissions,
              connection_id: isConnected ? assetId : null
            });
        }}
        onOpenChange={onDeleteModalOpenChange}
        actionText="Delete"
        danger
      ></AlertModal> */}
    </>
  );
};

const UploadIndicator = ({ upload }: { upload: FileUpload }) => {
  return (
    <div className="relative flex items-center justify-center py-6">
      Uploading {upload.fileName}
      <motion.div
        className="absolute left-0 top-0 -z-10 h-full w-full origin-left bg-ds-table-row-bg-hover"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: upload.sizeUploaded / upload.totalSize }}
        transition={{ duration: 0.1 }}
      ></motion.div>
    </div>
  );
};

export const VersionUploadActiveText = ({
  id,
  fallbackText,
}: {
  id: string;
  fallbackText?: string;
}) => {
  const { uploads } = useUploadsStore();

  const activeVersionUploadsOnThisAsset = uploads.find(
    (upload) => upload.versionStackFileId === id
  );
  const activeText = activeVersionUploadsOnThisAsset
    ? `Uploading version ${Math.round(
        (activeVersionUploadsOnThisAsset.sizeUploaded * 100) /
          activeVersionUploadsOnThisAsset.totalSize
      )}%`
    : "";
  if (activeText) {
    return (
      <div className="text-xs text-ds-button-primary-bg-hover">
        {activeText}
      </div>
    );
  }
  if (fallbackText) {
    return <div className="text-xs text-ds-text-secondary">{fallbackText}</div>;
  }
  return null;
};
