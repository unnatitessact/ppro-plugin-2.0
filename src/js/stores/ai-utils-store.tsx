import { create } from "zustand";

import { Preset } from "../api-integration/types/ai";
import { LibraryAsset as MainLibraryAsset } from "../api-integration/types/library";
import { LibraryAsset } from "../api-integration/types/projects";

interface AIUtilsState {
  selectedTab: "presets" | "history";
  setSelectedTab: (selectedTab: "presets" | "history") => void;
  selectedPreset: Preset | null;
  setSelectedPreset: (selectedPreset: Preset | null) => void;
  selectedChat: string | null;
  setSelectedChat: (selectedChat: string | null) => void;
  // files uploaded by the user
  uploadedFiles: File[];
  setUploadedFiles: (uploadedFiles: File[]) => void;
  // files to show in the add comment component
  uploadedFilesToShow: (MainLibraryAsset | LibraryAsset)[];
  setUploadedFilesToShow: (
    uploadedFilesToShow: (MainLibraryAsset | LibraryAsset)[]
  ) => void;
  // files selected in the library
  selectedLibraryItems: (MainLibraryAsset | LibraryAsset)[];
  addOrRemoveLibraryItem: (
    libraryFile: MainLibraryAsset | LibraryAsset
  ) => void;
  isPresetPromptOpen: boolean;
  setIsPresetPromptOpen: (isPresetPromptOpen: boolean) => void;
  presetToPreview: Preset | null;
  setPresetToPreview: (presetToPreview: Preset | null) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  clearSelectedLibraryItems: () => void;
  reset: () => void;
}

export const useAIUtilsStore = create<AIUtilsState>((set) => ({
  selectedTab: "presets" as "presets" | "history",
  setSelectedTab: (selectedTab: "presets" | "history") => set({ selectedTab }),
  selectedPreset: null,
  setSelectedPreset: (selectedPreset: Preset | null) => set({ selectedPreset }),
  selectedChat: null,
  setSelectedChat: (selectedChat: string | null) => set({ selectedChat }),
  uploadedFiles: [],
  setUploadedFiles: (uploadedFiles: File[]) => set({ uploadedFiles }),
  uploadedFilesToShow: [],
  setUploadedFilesToShow: (
    uploadedFilesToShow: (MainLibraryAsset | LibraryAsset)[]
  ) => set({ uploadedFilesToShow }),
  selectedLibraryItems: [],
  addOrRemoveLibraryItem: (libraryFile: MainLibraryAsset | LibraryAsset) =>
    set((state) => ({
      selectedLibraryItems: state.selectedLibraryItems.includes(libraryFile)
        ? state.selectedLibraryItems.filter(
            (item) => item.id !== libraryFile.id
          )
        : [...state.selectedLibraryItems, libraryFile],
    })),
  clearSelectedLibraryItems: () => set({ selectedLibraryItems: [] }),
  isPresetPromptOpen: false,
  setIsPresetPromptOpen: (isPresetPromptOpen: boolean) =>
    set({ isPresetPromptOpen }),

  presetToPreview: null,
  setPresetToPreview: (presetToPreview: Preset | null) =>
    set({ presetToPreview }),

  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  reset: () =>
    set({
      selectedTab: "presets",
      selectedPreset: null,
      selectedChat: null,
      uploadedFiles: [],
      uploadedFilesToShow: [],
      selectedLibraryItems: [],
      isPresetPromptOpen: false,
      presetToPreview: null,
      searchQuery: "",
    }),
}));
