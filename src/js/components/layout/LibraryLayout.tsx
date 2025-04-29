"use client";

import type { ReactNode } from "react";

import { useEffect, useRef } from "react";

// import { usePathname } from 'next/navigation';
import { useLocation, useParams } from "react-router-dom";

import { SelectionProvider } from "@/context/selection";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@nextui-org/react";
import { AnimatePresence, LayoutGroup } from "framer-motion";

import { LibraryActionbar } from "@/components/action-bar/LibraryActionbar";
import { RootActionbar } from "@/components/action-bar/RootActionbar";
import { FilterBar } from "@/components/filters/FilterBar";
import { SortBar } from "@/components/filters/SortBar";
import { SelectionBar } from "@/components/library/SelectionBar";
import { VersionModal } from "@/components/library/VersionModal";

// import { LibraryRemixBar } from "@/components/remixes-bar/LibraryRemixBar";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useLibraryFilterState } from "@/hooks/useLibraryFilterState";

import { useLibraryStore } from "@/stores/library-store";

import { REMIXES_FLAG } from "@/utils/featureFlagUtils";
import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";

// import { useLibraryFilterStore } from "@/stores/library-filter-store";

const LibraryLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const {
    selectedItems,
    showFilterBar,
    showSortBar,
    toggleFilterBar,
    toggleSortBar,
    selectedVersionStackId,
    setSelectedVersionStackId,
  } = useLibraryStore();

  const { filters, sorts } = useLibraryFilterState();

  // const { folderStates } = useLibraryFilterStore();

  const currentFolderId = useParams().folderId;

  // const { filters, sorts } = folderStates[currentFolderId || ""];

  const pathname = useLocation().pathname;

  console.log("pathname", pathname);

  const showBars =
    pathname === "/" ||
    (pathname.includes("/folder") && !pathname.includes("metadata"));

  console.log({
    showBars,
  });
  const selectionContainerRef = useRef<HTMLDivElement>(null);
  const isRemixesEnabled = useFeatureFlag(REMIXES_FLAG);

  // Track filter and sort states to prevent excessive re-renders
  const prevFiltersLengthRef = useRef(filters.length);
  const prevSortsLengthRef = useRef(sorts.length);
  const prevShowFilterBarRef = useRef(showFilterBar);
  const prevShowSortBarRef = useRef(showSortBar);
  const prevPathRef = useRef(pathname);
  const prevFolderIdRef = useRef(currentFolderId);

  // Ensure filter and sort bars remain visible when they have active items
  useEffect(() => {
    // Only run effect if something relevant has changed
    const filtersChanged = prevFiltersLengthRef.current !== filters.length;
    const sortsChanged = prevSortsLengthRef.current !== sorts.length;
    const filterBarChanged = prevShowFilterBarRef.current !== showFilterBar;
    const sortBarChanged = prevShowSortBarRef.current !== showSortBar;
    const pathChanged = prevPathRef.current !== pathname;
    const folderIdChanged = prevFolderIdRef.current !== currentFolderId;

    if (filtersChanged || filterBarChanged || pathChanged || folderIdChanged) {
      // If we have filters but the filter bar is not showing, show it
      if (filters.length > 0 && !showFilterBar) {
        toggleFilterBar();
      }

      // Update refs
      prevFiltersLengthRef.current = filters.length;
      prevShowFilterBarRef.current = showFilterBar;
    }

    if (sortsChanged || sortBarChanged || pathChanged || folderIdChanged) {
      // If we have sorts but the sort bar is not showing, show it
      if (sorts.length > 0 && !showSortBar) {
        toggleSortBar();
      }

      // Update refs
      prevSortsLengthRef.current = sorts.length;
      prevShowSortBarRef.current = showSortBar;
    }

    if (pathChanged) {
      prevPathRef.current = pathname;
    }

    if (folderIdChanged) {
      prevFolderIdRef.current = currentFolderId;
    }
  }, [
    filters.length,
    sorts.length,
    showFilterBar,
    showSortBar,
    toggleFilterBar,
    toggleSortBar,
    pathname,
    currentFolderId,
  ]);

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col",
        isMobile && "gap-0"
      )}
    >
      <RootActionbar>
        <LibraryActionbar />
      </RootActionbar>
      <LayoutGroup>
        {showBars && (
          <AnimatePresence initial={false}>
            {(showFilterBar || filters.length > 0) && (
              <FilterBar key="filter-bar" />
            )}
            {(showSortBar || sorts.length > 0) && <SortBar key="sort-bar" />}
          </AnimatePresence>
        )}
        <SelectionProvider
          containerIds={["closest-asset-container", "closest-asset-wrapper"]}
          selectionContainerRef={selectionContainerRef}
        >
          <div
            className="flex h-full min-h-0 w-full gap-4"
            ref={selectionContainerRef}
          >
            {children}
          </div>
        </SelectionProvider>
      </LayoutGroup>
      <AnimatePresence>
        {selectedItems?.length > 0 && showBars && (
          <SelectionBar key="selection-bar" />
        )}
      </AnimatePresence>
      <VersionModal
        isOpen={!!selectedVersionStackId}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedVersionStackId(null);
          }
        }}
      />
    </div>
  );
};

export default LibraryLayout;
