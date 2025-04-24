import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ProjectsRootTab = 'all-projects' | 'all-tasks';

interface UserPreferencesState {
  projectTabSelectionFlag: boolean;
  setProjectTabSelectionFlag: (projectTabSelectionFlag: boolean) => void;
  projectsSelectedTab: ProjectsRootTab;
  setProjectsSelectedTab: (selectedTab: ProjectsRootTab) => void;
  errorPageVisits: number[];
  addErrorPageVisit: () => void;
  resetErrorPageVisits: () => void;

  selectedFeatureFlags: string[];
  setSelectedFeatureFlags: (selectedFeatureFlags: string[]) => void;
  addOrRemoveFeatureFlag: (item: string) => void;
  clearSelectedFeatureFlags: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      projectTabSelectionFlag: false,
      setProjectTabSelectionFlag: (projectTabSelectionFlag) => set({ projectTabSelectionFlag }),
      projectsSelectedTab: 'all-projects',
      setProjectsSelectedTab: (projectsSelectedTab) => set({ projectsSelectedTab }),
      errorPageVisits: [],
      addErrorPageVisit: () => {
        const currentTime = Date.now();
        const twoMinutesAgo = currentTime - 2 * 60 * 1000;
        set((state) => ({
          errorPageVisits: [
            ...state.errorPageVisits.filter((time) => time > twoMinutesAgo),
            currentTime
          ]
        }));
      },
      resetErrorPageVisits: () => set({ errorPageVisits: [] }),

      selectedFeatureFlags: [],
      setSelectedFeatureFlags: (selectedFeatureFlags) => set({ selectedFeatureFlags }),
      addOrRemoveFeatureFlag: (item) =>
        set((state) => ({ selectedFeatureFlags: [...state.selectedFeatureFlags, item] })),
      clearSelectedFeatureFlags: () => set({ selectedFeatureFlags: [] })
    }),
    {
      name: 'user-preferences-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projectTabSelectionFlag: state.projectTabSelectionFlag,
        errorPageVisits: state.errorPageVisits,
        projectsSelectedTab: state.projectsSelectedTab
      })
    }
  )
);
