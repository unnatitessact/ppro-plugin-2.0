import { useEffect, useMemo, useRef } from "react";

import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useLibraryStore } from "@/stores/library-store";
// import { useDebouncedCallback } from '@mantine/hooks';
import { cn } from "@nextui-org/react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroller";

import { Button } from "@/components/ui/Button";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { LibraryEmptyState } from "./EmptyState";
import { FetchingNextPageIndicator } from "./FetchNextPageIndicator";
import { WithLibraryThreeDotMenu } from "./WithLibraryThreeDotMenu";
import { UploadAsset } from "./UploadAsset";
import { AssetCardSkeleton } from "../skeletons/AssetCardSkeleton";
import { AssetCardFetchingSkeleton } from "../skeletons/AssetCardSkeleton";
// import { useFilterStore } from "@/stores/library-filter-store";

// import { ResourceCard } from "@/components/library/asset/ResourceCard";

import { useFileUpload } from "@/hooks/useFileUpload";
// import { useLibraryFilterState } from "@/hooks/useLibraryFilterState";

// import { useGetLibraryContentPermissions } from '@/api-integration/mutations/library';
import {
  getLibraryContentsQueryKey,
  getLibraryPermissionsQueryKey,
  getLibrarySubcontentsQueryKey,
  useLibraryContentsQuery,
  useLibraryContentsQueryKey,
  useLibraryPermissionsQuery,
  useLibrarySubcontentsQuery,
} from "@/api-integration/queries/library";
// import { generateLibraryQueryParams } from '@/api-integration/queries/utils';
import { LibraryAsset, LibraryResults } from "@/api-integration/types/library";

import { useUploadsStore } from "@/stores/uploads-store";

import { useLibraryFilterStore } from "@/stores/library-filter-store";

import { REMIXES_FLAG } from "@/utils/featureFlagUtils";
import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

import { useWorkspace } from "@/hooks/useWorkspace";

export const Library = () => {
  const { workspace } = useWorkspace();

  const isRemixesEnabled = useFeatureFlag(REMIXES_FLAG);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLibraryContentsQuery(null, {
      filters: [],
      sorts: [],
      searchQuery: "",
      flatten: false,
      matchType: "all",
    });

  const { uploads } = useUploadsStore();
  const { setSelectedItems, selectedItems } = useLibraryStore();

  const uploadsOnThisPage = useMemo(() => {
    return uploads.filter(
      (upload) => upload?.parent === null && !upload.versionStackId
    );
  }, [uploads]);

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

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const queryClient = useQueryClient();

  const { data: permissions } = useLibraryPermissionsQuery(items);
  const { data: subContents } = useLibrarySubcontentsQuery(items);

  const debouncedFetchMoreData = useDebouncedCallback(() => {
    if (allResultsMinimal?.length > 0) {
      queryClient.invalidateQueries({
        queryKey: getLibraryPermissionsQueryKey(
          workspace.id,
          null,
          allResultsMinimal.map((item) => item.id)
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getLibrarySubcontentsQueryKey(workspace.id, null),
      });
    }
  }, 500);

  useEffect(() => {
    if (allResultsMinimal?.length > 0) {
      debouncedFetchMoreData();
    }
  }, [debouncedFetchMoreData, allResultsMinimal]);

  const allResults = useMemo<LibraryAsset[]>(() => {
    return allResultsMinimal.map((item) => ({
      ...item,
      permissions: permissions?.[item.id] || [],
      ...(item.resourcetype === "Folder" && {
        sub_contents: subContents?.[item.id] || [],
      }),
    })) as LibraryAsset[];
  }, [allResultsMinimal, permissions, subContents]);

  const scrollParentRef = useRef<HTMLDivElement>(null);

  const { folderStates } = useLibraryFilterStore();
  const { filters, sorts, searchQuery } = folderStates;

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
          ? resource.index_status
          : undefined,
      connection_id: resource.connection_id || null,
    }));
    setSelectedItems(allItems);
  };
  return (
    <ScrollShadow
      className={cn("h-full min-h-0 w-full pb-0", isMobile ? "px-1" : "pr-4")}
      ref={scrollParentRef}
      scrollRestorationKey="library-grid"
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
        {/* <input
          type="file"
          ref={inputFileRef}
          hidden
          multiple
          onChange={(e) => uploadFiles(Array.from(e.target.files || []))}
        /> */}
        <WithLibraryThreeDotMenu onLibraryRoot onSelectAll={selectAllItems}>
          <AnimatePresence initial={false} mode="wait">
            {/* <SelectionContext.Provider value={selection}> */}
            {!isLoading &&
            !folderStates.searchQuery &&
            allResults.length === 0 &&
            uploadsOnThisPage.length === 0 ? (
              <LibraryEmptyState
                title="Library is empty"
                description="Once you upload your assets, they will appear here."
                action={
                  <Button
                    // onPress={() => inputFileRef.current?.click()}
                    color="secondary"
                    className="mx-auto w-fit"
                    aria-label="Upload files to library"
                  >
                    Upload files
                  </Button>
                }
              />
            ) : !isLoading &&
              folderStates.searchQuery &&
              allResults.length === 0 &&
              uploadsOnThisPage.length === 0 ? (
              <LibraryEmptyState
                title="No assets found"
                description={`There were no assets found matching "${folderStates.searchQuery}" in this folder.`}
              />
            ) : (
              <div id="closest-asset-wrapper" className="h-full w-full">
                <motion.div
                  // layout="position"
                  id="closest-asset-container"
                  className={cn(
                    "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))]",
                    isMobile &&
                      "grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-0",
                    //
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
                  {isLoading
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <AssetCardSkeleton key={index} />
                      ))
                    : allResults.map((resource) => (
                        // <ResourceCard key={resource?.id} resource={resource} />
                        <div key={resource?.id}>
                          {resource.name}
                          {/* <ResourceCard resource={resource} /> */}
                        </div>
                      ))}
                  {isFetchingNextPage &&
                    Array.from({ length: 10 }).map((_, index) => (
                      <AssetCardFetchingSkeleton key={`fetching-${index}`} />
                    ))}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </WithLibraryThreeDotMenu>
        <FetchingNextPageIndicator
          isFetching={isFetchingNextPage}
          customText="Loading"
        />
      </InfiniteScroll>
    </ScrollShadow>
  );
};
