import React from 'react';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type AssetPageTab =
  | 'comments'
  | 'metadata'
  | 'ai'
  | 'technical-metadata'
  | 'properties'
  | 'access';

interface NewSearchActionsStore {
  isNewFolderOpen: boolean;
  onNewFolderOpenChange: () => void;
  isNewConnectedFolderOpen: boolean;
  onNewConnectedFolderOpenChange: () => void;
  inputFileRef: React.RefObject<HTMLInputElement>;
  isInviteUserOpen: boolean;
  onInviteUserOpenChange: () => void;
  isCreateWorkspaceOpen: boolean;
  onCreateWorkspaceOpenChange: () => void;
  isCreateSecurityGroupOpen: boolean;
  onCreateSecurityGroupOpenChange: () => void;
  isAddToExistingWorkspaceOpen: boolean;
  onAddToExistingWorkspaceOpenChange: () => void;
  isNewTeamWithSelectionOpen: boolean;
  onNewTeamWithSelectionOpenChange: () => void;
  isCreateTeamOpen: boolean;
  onCreateTeamOpenChange: () => void;
  isCommentInputFocused: boolean;
  setIsCommentInputFocusChange: (isCommentInputFocused: boolean) => void;
  selectedPanelTab?: AssetPageTab;
  setSelectedPanelTab: (selectedPanelTab: AssetPageTab) => void;
  isReviewStatusDropdownOpen: boolean;
  onReviewStatusDropdownOpenChange: () => void;
  isMarkersVisible: boolean;
  setIsMarkersVisible: (isMarkersVisible: boolean) => void;
  isExportCommentsOpen: boolean;
  setIsExportCommentsOpen: (isExportCommentsOpen: boolean) => void;

  // project page commands

  // project single page commands
}

export const useSearchActionsStore = create<NewSearchActionsStore>()(
  subscribeWithSelector((set) => ({
    isNewFolderOpen: false,
    onNewFolderOpenChange: () => set((state) => ({ isNewFolderOpen: !state.isNewFolderOpen })),
    isNewConnectedFolderOpen: false,
    onNewConnectedFolderOpenChange: () =>
      set((state) => ({ isNewConnectedFolderOpen: !state.isNewConnectedFolderOpen })),
    inputFileRef: React.createRef<HTMLInputElement>(),
    isInviteUserOpen: false,
    onInviteUserOpenChange: () => set((state) => ({ isInviteUserOpen: !state.isInviteUserOpen })),
    isCreateWorkspaceOpen: false,
    onCreateWorkspaceOpenChange: () =>
      set((state) => ({ isCreateWorkspaceOpen: !state.isCreateWorkspaceOpen })),
    isCreateSecurityGroupOpen: false,
    onCreateSecurityGroupOpenChange: () =>
      set((state) => ({ isCreateSecurityGroupOpen: !state.isCreateSecurityGroupOpen })),
    isAddToExistingWorkspaceOpen: false,
    onAddToExistingWorkspaceOpenChange: () =>
      set((state) => ({ isAddToExistingWorkspaceOpen: !state.isAddToExistingWorkspaceOpen })),
    isNewTeamWithSelectionOpen: false,
    onNewTeamWithSelectionOpenChange: () =>
      set((state) => ({ isNewTeamWithSelectionOpen: !state.isNewTeamWithSelectionOpen })),
    isCreateTeamOpen: false,
    onCreateTeamOpenChange: () => set((state) => ({ isCreateTeamOpen: !state.isCreateTeamOpen })),
    isCommentInputFocused: false,
    setIsCommentInputFocusChange: (isCommentInputFocused: boolean) =>
      set(() => ({ isCommentInputFocused: isCommentInputFocused })),
    selectedPanelTab: undefined,
    setSelectedPanelTab: (selectedPanelTab: AssetPageTab) =>
      set(() => ({ selectedPanelTab: selectedPanelTab })),
    isReviewStatusDropdownOpen: false,
    onReviewStatusDropdownOpenChange: () =>
      set((state) => ({ isReviewStatusDropdownOpen: !state.isReviewStatusDropdownOpen })),
    isMarkersVisible: false,
    setIsMarkersVisible: (isMarkersVisible: boolean) => {
      console.log('called markers visible', isMarkersVisible);
      set(() => ({ isMarkersVisible: isMarkersVisible }));
    },
    isExportCommentsOpen: false,
    setIsExportCommentsOpen: (isExportCommentsOpen: boolean) =>
      set(() => ({ isExportCommentsOpen: isExportCommentsOpen }))
  }))
);
