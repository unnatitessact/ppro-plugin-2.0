import { create } from "zustand";

interface LibraryState {
  folderId: string | null;
  isFolderOpen: boolean;
  setFolderId: (folderId: string | null) => void;
  setIsFolderOpen: (isFolderOpen: boolean) => void;
  assetId: string | null;
  setAssetId: (assetId: string | null) => void;
}

export const useLibraryState = create<LibraryState>((set) => ({
  folderId: null,
  isFolderOpen: false,
  setFolderId: (folderId) => set({ folderId }),
  setIsFolderOpen: (isFolderOpen) => set({ isFolderOpen }),
  assetId: null,
  setAssetId: (assetId) => set({ assetId }),
}));
