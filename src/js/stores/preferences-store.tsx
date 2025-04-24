import { create } from "zustand";

// import { PreferencesTab } from "../components/preferences/PreferencesModal";

export type PreferencesTab =
  | "profile"
  | "appearance"
  | "notifications"
  | "shortcuts"
  | "security-access"
  | "publishing";

import {
  FeatureFlagUpdateStatus,
  Organization,
} from "../api-integration/types/feature-flag";

interface PreferencesState {
  isPreferencesModalOpen: boolean;
  setIsPreferencesModalOpen: (isPreferencesModalOpen: boolean) => void;
  isSocialMediaAccountActive: boolean;
  setIsSocialMediaAccountActive: (isSocialMediaAccountActive: boolean) => void;
  selectedItem: PreferencesTab;
  setSelectedItem: (selectedItem: PreferencesTab) => void;

  // feature flag data
  featureFlagData: FeatureFlagUpdateStatus;
  setFeatureFlagData: (featureFlagData: FeatureFlagUpdateStatus) => void;
  selectedOrganization: Organization;
  setSelectedOrganization: (selectedOrganization: Organization) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  isPreferencesModalOpen: false,
  setIsPreferencesModalOpen: (isPreferencesModalOpen) =>
    set({ isPreferencesModalOpen }),
  isSocialMediaAccountActive: false,
  setIsSocialMediaAccountActive: (isSocialMediaAccountActive) =>
    set({ isSocialMediaAccountActive }),
  selectedItem: "profile",
  setSelectedItem: (selectedItem) => set({ selectedItem }),

  // feature flag data
  featureFlagData: {
    organization: "",
    flags: {},
  },
  setFeatureFlagData: (featureFlagData) => set({ featureFlagData }),
  selectedOrganization: {
    id: "",
    title: "",
  },
  setSelectedOrganization: (selectedOrganization) =>
    set({ selectedOrganization }),
}));
