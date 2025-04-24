import { create } from 'zustand';

import { Filter, Sort } from './library-store';

// Type definitions for folder-specific filter state
export type FolderFilterState = {
  filters: Filter[];
  sorts: Sort[];
  searchQuery: string;
};

// Type definition for the project filter store
export type FilterStore = {
  // Map of projectId_folderId to filter state
  folderStates: Record<string, FolderFilterState>;
  setFolderState: (projectId: string, folderId: string, state: FolderFilterState) => void;
  updateFolderState: (
    projectId: string,
    folderId: string,
    updater: (state: FolderFilterState) => FolderFilterState
  ) => void;
};

// Create a combined key for storing folder state by both project and folder
const createKey = (projectId: string, folderId: string) => `${projectId}_${folderId}`;

// Zustand store for persistent project filter states across navigation
export const useFilterStore = create<FilterStore>((set) => ({
  folderStates: {},

  setFolderState: (projectId, folderId, state) =>
    set((store) => ({
      folderStates: {
        ...store.folderStates,
        [createKey(projectId, folderId)]: state
      }
    })),

  updateFolderState: (projectId, folderId, updater) =>
    set((store) => {
      const key = createKey(projectId, folderId);
      const currentState = store.folderStates[key] || {
        filters: [],
        sorts: [],
        searchQuery: ''
      };

      return {
        folderStates: {
          ...store.folderStates,
          [key]: updater(currentState)
        }
      };
    })
}));
