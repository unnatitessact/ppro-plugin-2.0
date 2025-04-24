import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  ClipForPayload,
  ClipSearchResult,
  QuickSearchResult,
  ScopeType,
  SelectedProject,
  Tab,
} from "../types/search";

import { Command } from "../utils/searchUtils";

interface SearchStore {
  // all commands
  focusIndex: number;
  setFocusIndex: (index: number) => void;

  // scoping
  scopeType: ScopeType;
  setScopeType: (scopeType: ScopeType) => void;
  scopeId: string | null;
  setScopeId: (scopeId: string | null) => void;

  // tertiary modal
  isFormSubmissionEnabled: boolean;
  setIsFormSubmissionEnabled: (open: boolean) => void;

  // open states
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSecondarySearchOpen: boolean;
  setIsSecondarySearchOpen: (open: boolean) => void;
  isSecondarySearchForUserManagementOpen: boolean;
  setIsSecondarySearchForUserManagementOpen: (open: boolean) => void;
  isTertiaryModalOpen: boolean;
  setIsTertiarySearchOpen: (open: boolean) => void;

  isUserManagementSearchOpen: boolean;
  setIsUserManagementSearchOpen: (open: boolean) => void;

  // search input
  // searchInput: string;
  // setSearchInput: (input: string) => void;
  // searchQuery: string;
  // setSearchQuery: (query: string) => void;
  selectedCommand: Command | null;
  setSelectedCommand: (command: Command | null) => void;

  selectedCommandForUserManagement: Command | null;
  setSelectedCommandForUserManagement: (command: Command | null) => void;

  userManagementSearchInput: string;
  setUserManagementSearchInput: (input: string) => void;

  // quick search
  selectedQuickSearchItem: QuickSearchResult | null;
  setSelectedQuickSearchItem: (clip: QuickSearchResult | null) => void;

  selectedQuickSearchItems: ClipForPayload[];
  addOrRemoveQuickSearchItem: (item: ClipForPayload) => void;

  // smart search
  selectedSmartSearchClip: ClipSearchResult | null;
  setSelectedSmartSearchClip: (clip: ClipSearchResult | null) => void;
  // smart search
  selectedSmartClips: ClipSearchResult[];
  setSelectedSmartClips: (clips: ClipSearchResult[]) => void;
  // smart search

  // search input
  selectedTab: Tab;
  setSelectedTab: (selectedTab: Tab) => void;

  // filter search
  // filterSearchFocusIndex: number;
  // setFilterSearchFocusIndex: (index: number) => void;
  // all search
  // filtered search
  filteredCommands: Command[];
  setFilteredCommands: (commands: Command[]) => void;

  // secondary search
  showBugReportPage: boolean;
  setShowBugReportPage: (show: boolean) => void;

  // secondary search
  // bug input
  bugInput: string;
  setBugInput: (input: string) => void;
  // bug module name
  bugModuleName: string;
  setBugModuleName: (moduleName: string) => void;
  // secondary search

  // secondary search
  isChangeFileStatusEnabled: boolean;
  setIsChangeFileStatusEnabled: (open: boolean) => void;

  isProjectFileStatusEnabled: boolean;
  setIsProjectFileStatusEnabled: (open: boolean) => void;

  // secondary search
  statusIndex: number;
  setStatusIndex: (index: number) => void;

  // output destination
  isAddFilesToDestinationOpen: boolean;
  setIsAddFilesToDestinationOpen: (open: boolean) => void;

  // output destination
  hasCompleteOutflow: boolean;
  setHasCompleteOutflow: (hasCompleteOutflow: boolean) => void;
  selectedProjectLibraryFiles: {
    id: string;
    start_time: number;
    end_time: number;
  }[];
  setSelectedProjectLibraryFiles: (
    files: { id: string; start_time: number; end_time: number }[]
  ) => void;
  visitedNodes: {
    id: string;
    name: string;
  }[];

  outflowIndex: number;
  setOutflowIndex: (index: number) => void;

  // output destination
  setVisitedNodes: (nodes: { id: string; name: string }[]) => void;
  isAddingTo: "library" | "project" | null;
  setIsAddingTo: (destination: "library" | "project" | null) => void;
  selectedProject: SelectedProject | null;
  setSelectedProject: (id: SelectedProject | null) => void;
  isAddToDestinationPopoverOpen: boolean;
  setIsAddToDestinationPopoverOpen: (open: boolean) => void;

  // user management
  userManagementFocusIndex: number;
  setUserManagementFocusIndex: (index: number) => void;
  filteredUserManagementCommands: Command[];
  setFilteredUserManagementCommands: (commands: Command[]) => void;

  // function
  reset: () => void;
  resetSecondarySearch: () => void;
  resetSelectedStates: () => void;
  resetUserManagementStates: () => void;
  navigationSearchResultFocusIndex: number;
  setNavigationSearchResultFocusIndex: (index: number) => void;
}

export const useSearchStore = create<SearchStore>()(
  subscribeWithSelector((set) => ({
    scopeType: "workspace",
    setScopeType: (scopeType) => set({ scopeType }),
    scopeId: null,
    setScopeId: (scopeId) => set({ scopeId }),

    isUserManagementSearchOpen: false,
    setIsUserManagementSearchOpen: (open) =>
      set({ isUserManagementSearchOpen: open }),

    isFormSubmissionEnabled: false,
    setIsFormSubmissionEnabled: (open) =>
      set({ isFormSubmissionEnabled: open }),
    bugInput: "",
    setBugInput: (input) => set({ bugInput: input }),
    isSearchOpen: false,
    setIsSearchOpen: (open) => set({ isSearchOpen: open }),
    // searchInput: '',
    // setSearchInput: (input) => set({ searchInput: input }),
    // searchQuery: '',
    // setSearchQuery: (query) => set({ searchQuery: query }),
    selectedCommand: null,
    setSelectedCommand: (command) => set({ selectedCommand: command }),
    selectedCommandForUserManagement: null,
    setSelectedCommandForUserManagement: (command) =>
      set({ selectedCommandForUserManagement: command }),
    userManagementSearchInput: "",
    setUserManagementSearchInput: (input) =>
      set({ userManagementSearchInput: input }),

    isTertiaryModalOpen: false,
    setIsTertiarySearchOpen: (open) => set({ isTertiaryModalOpen: open }),
    selectedTab: "" as Tab,
    setSelectedTab: (selectedTab) =>
      set({
        selectedTab,
      }),

    // quick search results
    selectedQuickSearchItem: null,
    setSelectedQuickSearchItem: (clip: QuickSearchResult | null) =>
      set({ selectedQuickSearchItem: clip }),

    selectedSmartSearchClip: null,
    setSelectedSmartSearchClip: (clip) =>
      set({ selectedSmartSearchClip: clip }),

    isSecondarySearchOpen: false,
    setIsSecondarySearchOpen: (open) => set({ isSecondarySearchOpen: open }),

    isSecondarySearchForUserManagementOpen: false,
    setIsSecondarySearchForUserManagementOpen: (open) =>
      set({ isSecondarySearchForUserManagementOpen: open }),

    selectedSmartClips: [],
    setSelectedSmartClips: (clips: ClipSearchResult[]) =>
      set({ selectedSmartClips: clips }),

    isChangeFileStatusEnabled: false,
    setIsChangeFileStatusEnabled: (open) =>
      set({ isChangeFileStatusEnabled: open }),

    isProjectFileStatusEnabled: false,
    setIsProjectFileStatusEnabled: (open) =>
      set({ isProjectFileStatusEnabled: open }),

    statusIndex: 0,
    setStatusIndex: (index: number) => set({ statusIndex: index }),

    selectedProject: null,
    setSelectedProject: (project: SelectedProject | null) =>
      set({ selectedProject: project }),

    isAddToDestinationPopoverOpen: false,
    setIsAddToDestinationPopoverOpen: (open: boolean) =>
      set({ isAddToDestinationPopoverOpen: open }),

    isAddFilesToDestinationOpen: false,
    setIsAddFilesToDestinationOpen: (open: boolean) =>
      set({ isAddFilesToDestinationOpen: open }),

    focusIndex: 0,

    setFocusIndex: (index) => set({ focusIndex: index }),
    // filterSearchFocusIndex: 0,
    // setFilterSearchFocusIndex: (index) => set({ filterSearchFocusIndex: index }),

    filteredCommands: [],
    setFilteredCommands: (commands) => set({ filteredCommands: commands }),
    // quickSearchFocusIndex: 0,
    // setQuickSearchFocusIndex: (index) => set({ quickSearchFocusIndex: index }),
    showBugReportPage: false,
    setShowBugReportPage: (show) => set({ showBugReportPage: show }),
    bugModuleName: "",
    setBugModuleName: (moduleName) => set({ bugModuleName: moduleName }),

    selectedProjectLibraryFiles: [],
    setSelectedProjectLibraryFiles: (files) =>
      set({ selectedProjectLibraryFiles: files }),

    isAddingTo: null,
    setIsAddingTo: (destination) => set({ isAddingTo: destination }),
    visitedNodes: [],
    setVisitedNodes: (nodes) => set({ visitedNodes: nodes }),

    outflowIndex: 0,
    setOutflowIndex: (index) => set({ outflowIndex: index }),

    hasCompleteOutflow: false,
    setHasCompleteOutflow: (hasCompleteOutflow) => set({ hasCompleteOutflow }),

    selectedQuickSearchItems: [],
    addOrRemoveQuickSearchItem: (item) => {
      set((state) => ({
        selectedQuickSearchItems: state.selectedQuickSearchItems.some(
          (i) => i.id === item.id
        )
          ? state.selectedQuickSearchItems.filter((i) => i.id !== item.id)
          : [...state.selectedQuickSearchItems, item],
      }));
    },

    resetSelectedStates: () => {
      set({
        selectedSmartClips: [],
        selectedProjectLibraryFiles: [],
        selectedQuickSearchItems: [],
      });
    },
    navigationSearchResultFocusIndex: 0,
    setNavigationSearchResultFocusIndex: (index) =>
      set({ navigationSearchResultFocusIndex: index }),

    userManagementFocusIndex: 0,
    setUserManagementFocusIndex: (index) =>
      set({ userManagementFocusIndex: index }),

    filteredUserManagementCommands: [],
    setFilteredUserManagementCommands: (commands) =>
      set({ filteredUserManagementCommands: commands }),

    resetUserManagementStates: () => {
      set({
        userManagementFocusIndex: 0,
        filteredUserManagementCommands: [],
        userManagementSearchInput: "",
        selectedCommandForUserManagement: null,
        isUserManagementSearchOpen: false,
      });
    },

    reset: () => {
      // remove search params

      set({
        isSearchOpen: false,
        // searchInput: '',
        // searchQuery: '',
        selectedCommand: null,
        selectedQuickSearchItem: null,
        filteredCommands: [],
        focusIndex: 0,
        showBugReportPage: false,
        isSecondarySearchOpen: false,
        isChangeFileStatusEnabled: false,
        statusIndex: 0,
        selectedSmartClips: [],
        isAddFilesToDestinationOpen: false,
        selectedProjectLibraryFiles: [],
        selectedQuickSearchItems: [],
        navigationSearchResultFocusIndex: 0,
      });
    },

    resetSecondarySearch: () => {
      set({
        isSecondarySearchOpen: false,
        isAddFilesToDestinationOpen: false,
        selectedProjectLibraryFiles: [],
        visitedNodes: [],
        isAddingTo: null,
        selectedProject: null,
        selectedSmartClips: [],
        outflowIndex: 0,
        selectedSmartSearchClip: null,
        bugInput: "",
        bugModuleName: "",
        isProjectFileStatusEnabled: false,

        // selectedQuickSearchFolderItems: []
      });
    },
  }))
);
