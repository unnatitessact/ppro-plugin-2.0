import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "../api-integration/types/auth";

interface TaggingState {
  taggingSelectedTab: "library" | "project";
  setTaggingSelectedTab: (taggingSelectedTab: "library" | "project") => void;
  search: string;
  setSearch: (search: string) => void;
  assignedUser: User | null;
  setAssignedUser: (assignedUser: User | null) => void;
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;

  badgeCount: number;
  setBadgeCount: (badgeCount: number) => void;
  updateBadgeCount: () => void;

  excludeDeletedFiles: boolean;
  setExcludeDeletedFiles: (excludeDeletedFiles: boolean) => void;

  selectedWorkspaceFilter: string | null;
  setSelectedWorkspaceFilter: (selectedWorkspaceFilter: string | null) => void;
}

export const useTaggingStore = create<TaggingState>()(
  persist(
    (set, get) => ({
      taggingSelectedTab: "project",
      setTaggingSelectedTab: (taggingSelectedTab: "library" | "project") =>
        set({ taggingSelectedTab }),

      search: "",
      setSearch: (search: string) => set({ search }),

      assignedUser: null,
      setAssignedUser: (assignedUser: User | null) => {
        set({ assignedUser });
        get().updateBadgeCount();
      },

      statusFilter: "",
      setStatusFilter: (statusFilter: string) => {
        set({ statusFilter });
        get().updateBadgeCount();
      },

      badgeCount: 0,
      setBadgeCount: (badgeCount: number) => set({ badgeCount }),
      // Helper function to update badge count
      updateBadgeCount: () => {
        const state = get();
        const activeFilters = [
          state.assignedUser,
          state.statusFilter,
          state?.excludeDeletedFiles,
          state?.selectedWorkspaceFilter,
        ].filter((filter) => !!filter).length;
        set({ badgeCount: activeFilters });
      },

      excludeDeletedFiles: false,
      setExcludeDeletedFiles: (excludeDeletedFiles: boolean) => {
        set({ excludeDeletedFiles });
        get().updateBadgeCount();
      },

      selectedWorkspaceFilter: null,
      setSelectedWorkspaceFilter: (selectedWorkspaceFilter: string | null) => {
        set({ selectedWorkspaceFilter });
        get().updateBadgeCount();
      },
    }),
    {
      name: "tagging-store", // unique name for localStorage key
    }
  )
);
