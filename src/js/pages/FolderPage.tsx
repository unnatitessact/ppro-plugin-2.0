"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";

// import dynamic from 'next/dynamic';
// import { useParams, useSearchParams } from 'next/navigation';

// import {
//   LibraryRoomEvent,
//   useLibraryEventListener,
// } from "../../../liveblocks.config";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroller";

import { Button } from "@/components/ui/Button";
import { ScrollShadow } from "@/components/ui/ScrollShadow";

import { LibraryRoomProvider } from "../../../liveblocks.config";

import { ResourceCard } from "@/components/library/asset/ResourceCard";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useFileUpload } from "@/hooks/useFileUpload";
// import { useLibraryFilterState } from "@/hooks/useLibraryFilterState";
// import { useWorkspace } from "@/hooks/useWorkspace";

import {
  getLibraryContentsQueryKey,
  getLibraryPermissionsQueryKey,
  getLibrarySubcontentsQueryKey,
  useAssetDetailsQuery,
  useLibraryContentsQuery,
  useLibraryContentsQueryKey,
  useLibraryPermissionsQuery,
  useLibrarySubcontentsQuery,
} from "@/api-integration/queries/library";
import { LibraryAsset, LibraryResults } from "@/api-integration/types/library";

import { useLibraryStore } from "@/stores/library-store";
import { useUploadsStore } from "@/stores/uploads-store";

import { REMIXES_FLAG } from "@/utils/featureFlagUtils";
import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import { UploadAsset } from "@/components/library/asset/UploadAsset";
import { LibraryEmptyState } from "@/components/library/EmptyState";
import { FetchingNextPageIndicator } from "@/components/library/FetchNextPageIndicator";
import { LibraryTableView } from "@/components/library/LibraryTableView";
import { WithLibraryThreeDotMenu } from "@/components/library/WithLibraryThreeDotMenu";
import {
  AssetCardSkeleton,
  AssetCardFetchingSkeleton,
} from "@/components/skeletons/AssetCardSkeleton";
import { useParamsStateStore } from "@/stores/params-state-store";
import { useLibraryFilterStore } from "@/stores/library-filter-store";

// const UploadAsset = dynamic(
//   async () => {
//     const mod = await import("@/components/library/asset/UploadAsset");
//     return { default: mod.UploadAsset };
//   },
//   { ssr: false }
// );

// const LibraryEmptyState = dynamic(
//   async () => {
//     const mod = await import("@/components/library/EmptyState");
//     return { default: mod.LibraryEmptyState };
//   },
//   { ssr: false }
// );

// const FetchingNextPageIndicator = dynamic(
//   async () => {
//     const mod = await import("@/components/library/FetchingNextPageIndicator");
//     return { default: mod.FetchingNextPageIndicator };
//   },
//   { ssr: false }
// );
// const LibraryTableView = dynamic(
//   async () => {
//     const mod = await import("@/components/library/LibraryTableView");
//     return { default: mod.LibraryTableView };
//   },
//   { ssr: false }
// );

// const WithLibraryThreeDotMenu = dynamic(
//   async () => {
//     const mod = await import("@/components/library/WithLibraryThreeDotMenu");
//     return { default: mod.WithLibraryThreeDotMenu };
//   },
//   { ssr: false }
// );

// const AssetCardSkeleton = dynamic(
//   async () => {
//     const mod = await import("@/components/skeletons/AssetCardSkeleton");
//     return { default: mod.AssetCardSkeleton };
//   },
//   { ssr: false }
// );

// const AssetCardFetchingSkeleton = dynamic(
//   async () => {
//     const mod = await import("@/components/skeletons/AssetCardSkeleton");
//     return { default: mod.AssetCardFetchingSkeleton };
//   },
//   { ssr: false }
// );

export const FolderPage = () => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const { setSelectedItems, view, selectedItems } = useLibraryStore();

  // const { filters, filterMatchType, sorts, search, isFlattened } =
  //   useLibraryFilterState();

  const { workspace } = useWorkspace();

  // const { folderId } = useParams() as { folderId: string };

  const { folderId } = useParamsStateStore();

  const { folderStates } = useLibraryFilterStore();

  const { filters, filterMatchType, sorts, search, isFlattened } = folderStates;

  const { data: folderDetails } = useAssetDetailsQuery(folderId as string);

  const libraryQueryKey = useLibraryContentsQueryKey(folderId as string);

  const { uploads } = useUploadsStore();

  const uploadsOnThisPage = useMemo(() => {
    return uploads.filter(
      (upload) => upload?.parent === folderId && !upload.versionStackId
    );
  }, [uploads, folderId]);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLibraryContentsQuery(folderId as string, {
      filters: [],
      sorts: [],
      searchQuery: "",
      flatten: false,
      matchType: "all",
    });

  const allResultsMinimal = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.results)
        .filter(
          (file) =>
            !uploadsOnThisPage.some((upload) => upload.fileId === file.id)
        ) || []
    );
  }, [data, uploadsOnThisPage]);

  const items = useMemo(() => {
    return (
      allResultsMinimal?.map((item) => ({
        id: item.id,
        resourcetype: item.resourcetype,
      })) || []
    );
  }, [allResultsMinimal]);

  const { data: permissions } = useLibraryPermissionsQuery(items);
  const { data: subContents } = useLibrarySubcontentsQuery(items);

  const queryClient = useQueryClient();

  // const searchParams = useSearchParams();
  // const childrenCount = searchParams.get("count");
  // const skeletonsToShow = childrenCount ? parseInt(childrenCount) : 10;

  const hasFolderEditPermission =
    folderDetails && folderDetails?.permissions?.includes("can_edit_asset");

  // useLibraryEventListener(({ event }) => {
  //   const typedEvent = event as LibraryRoomEvent;

  //   if (typedEvent.type === "FILE_UPLOADED") {
  //     queryClient.invalidateQueries({
  //       queryKey: getLibraryContentsQueryKey(workspace.id, folderId as string),
  //     });
  //   }
  //   if (typedEvent.type === "INDEX_STATUS_UPDATED") {
  //     queryClient.setQueryData(
  //       libraryQueryKey,
  //       (oldData: InfiniteData<LibraryResults["data"]>) => {
  //         if (!oldData) return;
  //         const newData = structuredClone(oldData);
  //         newData.pages.forEach((page) => {
  //           page.results.forEach((result) => {
  //             if (result.id === typedEvent.video_id) {
  //               if (
  //                 result.resourcetype === "VideoFile" &&
  //                 typedEvent.index_status
  //               ) {
  //                 result.index_status = typedEvent.index_status;
  //               }
  //               if (
  //                 result.resourcetype === "VideoFile" &&
  //                 typedEvent.index_percent
  //               ) {
  //                 result.index_percent = typedEvent.index_percent;
  //               }
  //             }
  //           });
  //         });
  //         return newData;
  //       }
  //     );
  //   }
  // });

  const allResults = useMemo<LibraryAsset[]>(() => {
    return allResultsMinimal.map((item) => ({
      ...item,
      permissions: permissions?.[item.id] || [],
      ...(item.resourcetype === "Folder" && {
        sub_contents: subContents?.[item.id] || [],
      }),
    })) as LibraryAsset[];
  }, [allResultsMinimal, permissions, subContents]);

  const debouncedFetchMoreData = useDebouncedCallback(() => {
    if (allResultsMinimal?.length > 0) {
      queryClient.invalidateQueries({
        queryKey: getLibraryPermissionsQueryKey(
          workspace.id,
          folderId as string,
          items.map((item) => item.id)
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getLibrarySubcontentsQueryKey(
          workspace.id,
          folderId as string
        ),
      });
    }
  }, 500);

  useEffect(() => {
    if (allResultsMinimal?.length > 0) {
      debouncedFetchMoreData();
    }
  }, [debouncedFetchMoreData, allResultsMinimal]);

  const selectAllItems = () => {
    const allItems = allResults.map((resource) => ({
      id: resource.id,
      name: resource.name,
      resourceType: resource.resourcetype,
      thumbnail:
        resource.resourcetype === "VideoFile"
          ? resource.thumbnail || undefined
          : undefined,
      indexStatus:
        resource.resourcetype === "VideoFile"
          ? resource.index_status || undefined
          : undefined,
      connection_id: resource.connection_id ?? null,
    }));
    setSelectedItems(allItems);
  };

  const { uploadFile } = useFileUpload("library", (folderId as string) || null);

  const isRemixesEnabled = useFeatureFlag(REMIXES_FLAG);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const scrollParentRef = useRef<HTMLDivElement>(null);

  const showFileStatus = true;
  const showCommentsCount = true;

  const uploadFiles = (files: File[]) => {
    if (files) {
      Array.from(files).forEach((file) => uploadFile(file));
    }
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  if (view === "list") {
    return (
      <WithLibraryThreeDotMenu onSelectAll={selectAllItems}>
        <motion.div
          className={cn("h-full min-h-0 pb-5", isMobile ? "pr-1" : "pr-6")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LibraryTableView
            data={allResults}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetching={isFetchingNextPage}
            showStatusDropdown={showFileStatus}
            uploads={uploadsOnThisPage}
            showCommentsCount={showCommentsCount}
            emptyStateComponent={
              !isLoading &&
              !search &&
              allResults.length === 0 &&
              uploadsOnThisPage.length === 0 ? (
                <>
                  <LibraryEmptyState
                    title="This folder is empty"
                    description="Once you upload your assets, they will appear here."
                    action={
                      hasFolderEditPermission ? (
                        <Button
                          onPress={() => {
                            console.log(inputFileRef?.current);
                            inputFileRef.current?.click();
                          }}
                          color="secondary"
                          className="mx-auto w-fit"
                        >
                          Upload files
                        </Button>
                      ) : undefined
                    }
                  />
                  <input
                    type="file"
                    ref={inputFileRef}
                    hidden
                    multiple
                    onChange={(e) =>
                      uploadFiles(Array.from(e.target.files || []))
                    }
                  />
                </>
              ) : !isLoading &&
                search &&
                allResults.length === 0 &&
                uploadsOnThisPage.length === 0 ? (
                <LibraryEmptyState
                  title="No assets found"
                  description={`There were no assets found matching "${search}" in this folder.`}
                />
              ) : (
                <div />
              )
            }
          />
        </motion.div>
      </WithLibraryThreeDotMenu>
    );
  }

  return (
    // <LibraryRoomProvider
    //   id={`library:${workspace?.id}:root`}
    //   initialPresence={{}}
    //   initialStorage={{}}
    // >
    <ScrollShadow
      className={cn("h-full min-h-0 w-full pb-0", isMobile ? "px-1" : "pr-4")}
      ref={scrollParentRef}
      scrollRestorationKey={`library-grid-${folderId}`}
    >
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        useWindow={false}
        getScrollParent={() => scrollParentRef.current}
        className="h-full"
      >
        <input
          type="file"
          ref={inputFileRef}
          hidden
          multiple
          onChange={(e) => uploadFiles(Array.from(e.target.files || []))}
        />
        <WithLibraryThreeDotMenu onSelectAll={selectAllItems}>
          <AnimatePresence initial={false} mode="wait">
            {!isLoading &&
            !search &&
            allResults.length === 0 &&
            uploadsOnThisPage.length === 0 ? (
              <LibraryEmptyState
                title="This folder is empty"
                description="Once you upload your assets, they will appear here."
                action={
                  hasFolderEditPermission ? (
                    <Button
                      onPress={() => inputFileRef.current?.click()}
                      color="secondary"
                      className="mx-auto w-fit"
                      aria-label="Upload files to library"
                    >
                      Upload files
                    </Button>
                  ) : undefined
                }
              />
            ) : !isLoading &&
              search &&
              allResults.length === 0 &&
              uploadsOnThisPage.length === 0 ? (
              <LibraryEmptyState
                title="No assets found"
                description={`There were no assets found matching "${search}" in this folder.`}
              />
            ) : (
              <div id="closest-asset-wrapper" className="h-full w-full">
                <motion.div
                  layout="position"
                  id="closest-asset-container"
                  className={cn(
                    "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))]",
                    isMobile &&
                      "grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-0",
                    isRemixesEnabled
                      ? "pb-40"
                      : selectedItems.length > 0
                      ? "pb-[86px]"
                      : "pb-0"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {uploadsOnThisPage.map((upload) => (
                    <motion.div key={upload.fileId} layoutId={upload.fileId}>
                      <UploadAsset {...upload} />
                    </motion.div>
                  ))}
                  <Suspense fallback={<></>}>
                    {isLoading
                      ? Array.from({ length: 10 }).map((_, index) => (
                          <AssetCardSkeleton key={index} />
                        ))
                      : allResults.map((resource) => (
                          <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    {isFetchingNextPage &&
                      Array.from({ length: 10 }).map((_, index) => (
                        <AssetCardFetchingSkeleton key={`fetching-${index}`} />
                      ))}
                    <FetchingNextPageIndicator
                      isFetching={isFetchingNextPage}
                      customText="Loading"
                    />
                  </Suspense>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </WithLibraryThreeDotMenu>
      </InfiniteScroll>
    </ScrollShadow>
    // </LibraryRoomProvider>
  );
};
