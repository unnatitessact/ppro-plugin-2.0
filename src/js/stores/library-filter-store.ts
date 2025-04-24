import { create } from "zustand";

import { Filter, Sort } from "./library-store";

// Type definitions for folder-specific filter state
export type FolderFilterState = {
  filters: Filter[];
  sorts: Sort[];
  searchQuery: string;
};

// Type definition for the filter store
export type FilterStore = {
  folderStates: Record<string, FolderFilterState>;
  setFolderState: (folderId: string, state: FolderFilterState) => void;
  updateFolderState: (
    folderId: string,
    updater: (state: FolderFilterState) => FolderFilterState
  ) => void;
};

// Zustand store for persistent filter states across navigation
export const useLibraryFilterStore = create<FilterStore>((set) => ({
  folderStates: {},
  setFolderState: (folderId, state) =>
    set((store) => ({
      folderStates: {
        ...store.folderStates,
        [folderId]: state,
      },
    })),
  updateFolderState: (folderId, updater) =>
    set((store) => {
      const currentState = store.folderStates[folderId] || {
        filters: [],
        sorts: [],
        searchQuery: "",
      };
      return {
        folderStates: {
          ...store.folderStates,
          [folderId]: updater(currentState),
        },
      };
    }),
}));
