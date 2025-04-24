import { createContext, ReactNode, useContext } from "react";

import { useUserOrganizationPermissionListQuery } from "../api-integration/queries/user-management";
import { GetUserPermissionsResponse } from "../api-integration/types/user-management";

interface PermissionsContextType {
  organizationPermissions: GetUserPermissionsResponse | undefined;
  isLoadingOrganizationPermissions: boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
  organizationPermissions: [],
  isLoadingOrganizationPermissions: false,
});

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const {
    data: organizationPermissions,
    isLoading: isLoadingOrganizationPermissions,
  } = useUserOrganizationPermissionListQuery();

  return (
    <PermissionsContext.Provider
      value={{
        organizationPermissions,
        isLoadingOrganizationPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => {
  return useContext(PermissionsContext);
};
