import { create } from "zustand";

import { UserWithWorkspaceAndRole } from "../api-integration/types/user-management";

interface UserStore {
  selectedItems: UserWithWorkspaceAndRole[];
  setSelectedItems: (selectedItems: UserWithWorkspaceAndRole[]) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  selectedItems: [],
  setSelectedItems: (selectedItems) => set({ selectedItems }),
}));
