import { createContext, ReactNode, useContext } from "react";

import { usePreferencesQuery } from "../api-integration/queries/preferences";
import { GetPreferencesResponse } from "../api-integration/types/preferences";

interface PreferencesContextType {
  preferences: GetPreferencesResponse | undefined;
  isLoadingPreferences: boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: undefined,
  isLoadingPreferences: false,
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { data: preferences, isLoading: isLoadingPreferences } =
    usePreferencesQuery();

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoadingPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => {
  return useContext(PreferencesContext);
};
