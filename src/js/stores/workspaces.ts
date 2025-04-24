import { create } from "zustand";

import { UserWithWorkspaceAndRole } from "../api-integration/types/user-management";

const useWorkspaceStore = create<{
  selectedItems: UserWithWorkspaceAndRole[];
  setSelectedItems: (selectedItems: UserWithWorkspaceAndRole[]) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  selectedItems: [],
  setSelectedItems: (selectedItems: UserWithWorkspaceAndRole[]) =>
    set({ selectedItems }),
}));

export default useWorkspaceStore;
