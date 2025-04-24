import { createContext, ReactNode, useContext } from 'react';

import { useWorkspacePreferencesQuery } from '@/api-integration/queries/settings';
import { GetWorkspacePreferencesResponse } from '@/api-integration/types/settings';

interface WorkspacePreferencesContextType {
  workspacePreferences: GetWorkspacePreferencesResponse | undefined;
  isLoadingWorkspacePreferences: boolean;
}

const WorkspacePreferencesContext = createContext<WorkspacePreferencesContextType>({
  workspacePreferences: undefined,
  isLoadingWorkspacePreferences: false
});

export function WorkspacePreferencesProvider({ children }: { children: ReactNode }) {
  const { data: workspacePreferences, isLoading: isLoadingWorkspacePreferences } =
    useWorkspacePreferencesQuery();

  return (
    <WorkspacePreferencesContext.Provider
      value={{
        workspacePreferences,
        isLoadingWorkspacePreferences
      }}
    >
      {children}
    </WorkspacePreferencesContext.Provider>
  );
}

export const useWorkspacePreferences = () => {
  return useContext(WorkspacePreferencesContext);
};
