import { create } from "zustand";

import { UserWithTeamsAndRole } from "../api-integration/types/user-management";

const useTeamStore = create<{
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  selectedItems: UserWithTeamsAndRole[];
  setSelectedItems: (selectedItems: UserWithTeamsAndRole[]) => void;
}>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  selectedItems: [],
  setSelectedItems: (selectedItems: UserWithTeamsAndRole[]) =>
    set({ selectedItems }),
}));

export default useTeamStore;
