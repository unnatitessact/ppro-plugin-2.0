import { create } from "zustand";

import { LibraryAsset } from "../api-integration/types/library";

import { View } from "./library-store";

const usePresetStore = create<{
  selectedItems: string[];
  setSelectedItems: (selectedItems: string[]) => void;
  addOrRemoveItem: (item: string) => void;
  clearSelectedItems: () => void;
  search: string;
  setSearch: (search: string) => void;
  dashboardView: View;
  setDashboardView: (view: View) => void;
  selectedPresets: string[];
  setSelectedPresets: (selectedPresets: string[]) => void;
  addOrRemovePresets: (item: string) => void;
  clearSelectedPresets: () => void;

  isLibraryPanelOpen: boolean;
  setIsLibraryPanelOpen: (isLibraryPanelOpen: boolean) => void;

  selectedLibraryItems: LibraryAsset[];
  addOrRemoveLibraryItem: (libraryFile: LibraryAsset) => void;

  selectedVersion: number;
  setSelectedVersion: (version: number) => void;
}>((set) => ({
  selectedItems: [],
  setSelectedItems: (selectedItems: string[]) => set({ selectedItems }),
  addOrRemoveItem: (item: string) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(item)
        ? state.selectedItems.filter((i) => i !== item)
        : [...state.selectedItems, item],
    })),
  clearSelectedItems: () => set({ selectedItems: [] }),
  search: "",
  setSearch: (search: string) => set({ search }),
  dashboardView: "grid",
  setDashboardView: (view: View) => set({ dashboardView: view }),
  isLibraryPanelOpen: true,
  setIsLibraryPanelOpen: (isLibraryPanelOpen: boolean) =>
    set({ isLibraryPanelOpen }),
  selectedPresets: [],
  setSelectedPresets: (selectedPresets: string[]) => set({ selectedPresets }),
  addOrRemovePresets: (item: string) =>
    set((state) => ({
      selectedPresets: state.selectedPresets.includes(item)
        ? state.selectedPresets.filter((i) => i !== item)
        : [...state.selectedPresets, item],
    })),
  clearSelectedPresets: () => set({ selectedPresets: [] }),
  selectedLibraryItems: [],
  addOrRemoveLibraryItem: (libraryFile: LibraryAsset) =>
    set((state) => ({
      selectedLibraryItems: state.selectedLibraryItems.some(
        (i) => i.id === libraryFile.id
      )
        ? state.selectedLibraryItems.filter((i) => i.id !== libraryFile.id)
        : [...state.selectedLibraryItems, libraryFile],
    })),
  selectedVersion: 0,
  setSelectedVersion: (version: number) => set({ selectedVersion: version }),
}));

export default usePresetStore;
