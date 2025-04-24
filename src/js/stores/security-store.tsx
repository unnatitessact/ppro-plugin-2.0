import { create } from "zustand";

import { ModifiedTreeView } from "../types/security-group";

interface SecurityGroupState {
  selectedWorkspace: string;
  setSelectedWorkspace: (selectedWorkspace: string) => void;
  seletedTreeNode: ModifiedTreeView[];
  setSelectedTreeNode: (selectedTreeNode: ModifiedTreeView[]) => void;
  clearSelectedTreeNode: () => void;
}

export const useSecurityGroupStore = create<SecurityGroupState>((set) => ({
  selectedWorkspace: "",
  setSelectedWorkspace: (selectedWorkspace: string) =>
    set({ selectedWorkspace }),
  seletedTreeNode: [],
  setSelectedTreeNode: (selectedTreeNode: ModifiedTreeView[]) =>
    set({ seletedTreeNode: selectedTreeNode }),
  clearSelectedTreeNode: () => set({ seletedTreeNode: [] }),
}));
