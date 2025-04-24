import { createContext, ReactNode, useContext, useEffect } from 'react';

import { useAuth } from '@/context/auth';

import { useUserFeatureFlagDetails } from '@/api-integration/queries/feature-flags';

interface FeatureFlagsContextType {
  featureFlags: Record<string, boolean>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  featureFlags: {}
});

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const { data: featureFlags, refetch } = useUserFeatureFlagDetails();

  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      refetch();
    }
  }, [session, refetch]);

  return (
    <FeatureFlagsContext.Provider
      value={{
        featureFlags: featureFlags || {}
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export const useFeatureFlags = () => {
  return useContext(FeatureFlagsContext);
};
