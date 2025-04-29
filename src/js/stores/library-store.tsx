import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PermissionPayload } from "../api-integration/types/library";

// import { PermissionPayload } from "../components/security-groups/files-folders/PermissionDropdown";

import { CompositionOutput } from "../api-integration/types/ai";
import {
  IndexStatus,
  LibraryAsset,
  ResourceType,
} from "../api-integration/types/library";

import {
  FieldOption,
  MetadataFieldType,
} from "../api-integration/types/metadata";

export type View = "masonry" | "grid" | "list";
export type AspectRatio = "vertical" | "horizontal";
export type Thumbnail = "fill" | "fit";
export type VideoTab = "original" | "editor";

export interface SelectedLibraryItem {
  id: string;
  name: string;
  resourceType: ResourceType;
  thumbnail?: string;
  indexStatus?: IndexStatus;
  permissions?: PermissionPayload[];
  connection_id: string | null;
}

export interface Filter {
  id: string;
  key?: string;
  label: string;
  type: MetadataFieldType;
  value: string | null;
  operator: string | null;
  isStatic?: boolean;
  options: FieldOption[];
}

export interface Sort {
  id: string;
  label: string;
  key: string;
  direction: "asc" | "desc";
  type: "date" | "name";
}

interface LibraryState {
  selectedItems: SelectedLibraryItem[];
  setSelectedItems: (selectedItems: SelectedLibraryItem[]) => void;
  addOrRemoveItem: (item: SelectedLibraryItem) => void;
  clearSelectedItems: () => void;
  selectedClipboardAction: "copy" | "cut" | null;
  setSelectedClipboardAction: (
    selectedClipboardAction: "copy" | "cut" | null
  ) => void;
  showFilterBar: boolean;
  toggleFilterBar: () => void;
  showSortBar: boolean;
  toggleSortBar: () => void;
  view: View;
  setView: (view: View) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  thumbnail: Thumbnail;
  setThumbnail: (thumbnail: Thumbnail) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  filterMatchType: "all" | "any";
  setFilterMatchType: (filterMatchType: "all" | "any") => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (filterId: string) => void;
  modifyFilter: (filterId: string, filter: Filter) => void;
  clearFilters: () => void;
  sorts: Sort[];
  addSort: (sort: Sort) => void;
  removeSort: (sortId: string) => void;
  modifySort: (sortId: string, sort: Sort) => void;
  clearSorts: () => void;
  flattenFolders: boolean;
  setFlattenFolders: (flattenFolders: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  showMetadataPanel: boolean;
  toggleMetadataPanel: () => void;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (isSearchExpanded: boolean) => void;
  selectedLibraryItems: LibraryAsset[];
  setSelectedLibraryItems: (selectedLibraryItems: LibraryAsset[]) => void;
  addOrRemoveLibraryItem: (item: LibraryAsset) => void;
  clearSelectedLibraryItems: () => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (isPublishModalOpen: boolean) => void;
  selectedVideoTab: VideoTab;
  setSelectedVideoTab: (selectedVideoTab: VideoTab) => void;
  compositionToPreview: CompositionOutput;
  setCompositionToPreview: (compositionToPreview: CompositionOutput) => void;
  selectedVersionStackId: string | null;
  setSelectedVersionStackId: (selectedVersionStackId: string | null) => void;
  showVersionsPanel: boolean;
  toggleVersionsPanel: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      filterMatchType: "all",
      setFilterMatchType: (filterMatchType: "all" | "any") =>
        set({ filterMatchType }),
      addFilter: (filter: Filter) =>
        set((state) => ({ filters: [...state.filters, filter] })),
      modifyFilter: (filterId: string, filter: Filter) =>
        set((state) => ({
          filters: state.filters.map((f) => (f.id === filterId ? filter : f)),
        })),
      removeFilter: (filterId: string) =>
        set((state) => ({
          filters: state.filters.filter((f) => f.id !== filterId),
        })),
      clearFilters: () => set({ filters: [] }),
      addSort: (sort: Sort) =>
        set((state) => ({ sorts: [...state.sorts, sort] })),
      modifySort: (sortId: string, sort: Sort) =>
        set((state) => ({
          sorts: state.sorts.map((s) => (s.id === sortId ? sort : s)),
        })),
      removeSort: (sortId: string) =>
        set((state) => ({ sorts: state.sorts.filter((s) => s.id !== sortId) })),
      clearSorts: () => set({ sorts: [] }),
      showVersionsPanel: false,
      toggleVersionsPanel: () =>
        set((state) => ({ showVersionsPanel: !state.showVersionsPanel })),
      sorts: [],
      setSorts: (sorts: Sort[]) => set({ sorts }),
      filters: [],
      setFilters: (filters: Filter[]) => set({ filters }),
      selectedItems: [],
      setSelectedItems: (selectedItems: SelectedLibraryItem[]) =>
        set({ selectedItems }),
      addOrRemoveItem: (item: SelectedLibraryItem) =>
        set((state) => ({
          selectedItems: state.selectedItems.some((i) => i.id === item.id)
            ? state.selectedItems.filter((i) => i.id !== item.id)
            : [...state.selectedItems, item],
        })),
      clearSelectedItems: () => set({ selectedItems: [] }),
      selectedClipboardAction: null,
      setSelectedClipboardAction: (
        selectedClipboardAction: "copy" | "cut" | null
      ) => set({ selectedClipboardAction }),
      showFilterBar: false,
      toggleFilterBar: () =>
        set((state) => ({ showFilterBar: !state.showFilterBar })),
      showSortBar: false,
      toggleSortBar: () =>
        set((state) => ({ showSortBar: !state.showSortBar })),
      view: "grid",
      setView: (view: View) => set({ view }),
      aspectRatio: "horizontal",
      setAspectRatio: (aspectRatio: AspectRatio) => set({ aspectRatio }),
      thumbnail: "fit",
      setThumbnail: (thumbnail: Thumbnail) => set({ thumbnail }),
      // flattenFolders: false,
      // setFlattenFolders: (flattenFolders: boolean) => set({ flattenFolders }),
      showMetadataPanel: true,
      toggleMetadataPanel: () =>
        set((state) => ({ showMetadataPanel: !state.showMetadataPanel })),
      isSearchExpanded: false,
      setIsSearchExpanded: (isSearchExpanded: boolean) =>
        set({ isSearchExpanded }),

      selectedLibraryItems: [],
      setSelectedLibraryItems: (selectedLibraryItems: LibraryAsset[]) =>
        set({ selectedLibraryItems }),
      addOrRemoveLibraryItem: (item: LibraryAsset) =>
        set((state) => ({
          selectedLibraryItems: state.selectedLibraryItems.includes(item)
            ? state.selectedLibraryItems.filter((i) => i !== item)
            : [...state.selectedLibraryItems, item],
        })),
      clearSelectedLibraryItems: () => set({ selectedLibraryItems: [] }),
      isPublishModalOpen: false,
      setIsPublishModalOpen: (isPublishModalOpen: boolean) =>
        set({ isPublishModalOpen }),
      selectedVideoTab: "original",
      setSelectedVideoTab: (selectedVideoTab: VideoTab) =>
        set({ selectedVideoTab }),
      compositionToPreview: [],
      setCompositionToPreview: (compositionToPreview: CompositionOutput) =>
        set({ compositionToPreview }),
      selectedVersionStackId: null,
      setSelectedVersionStackId: (selectedVersionStackId: string | null) =>
        set({ selectedVersionStackId }),
      search: "",
      setSearch: (search: string) => set({ search }),
      flattenFolders: false,
      setFlattenFolders: (flattenFolders: boolean) => set({ flattenFolders }),
    }),

    {
      name: "library-store",
      partialize: (state) => ({
        view: state.view,
        aspectRatio: state.aspectRatio,
        thumbnail: state.thumbnail,
      }),
    }
  )
);
