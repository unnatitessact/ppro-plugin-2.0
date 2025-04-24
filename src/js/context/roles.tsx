import type { GetRolesResponse } from '@/api-integration/types/user-management';

import { createContext, ReactNode, useContext } from 'react';

import { useOrganization } from '@/hooks/useOrganization';

import { useRolesQuery } from '@/api-integration/queries/user-management';

import { RoleType } from '@/types/user-management';

type RolesContextType = {
  [role in RoleType]: {
    roles: GetRolesResponse;
    isLoading: boolean;
  };
};

const RolesContext = createContext<RolesContextType>({
  organization: {
    roles: [],
    isLoading: false
  },
  workspace: {
    roles: [],
    isLoading: false
  },
  team: {
    roles: [],
    isLoading: false
  }
});

export function RolesProvider({ children }: { children: ReactNode }) {
  const organization = useOrganization();

  const { data: organizationRolesList, isLoading: isLoadingOrganizationRolesList } = useRolesQuery(
    'organization',
    organization?.id
  );
  const { data: workspaceRolesList, isLoading: isLoadingWorkspaceRolesList } = useRolesQuery(
    'workspace',
    organization?.id
  );
  const { data: teamRolesList, isLoading: isLoadingTeamRolesList } = useRolesQuery(
    'team',
    organization?.id
  );

  return (
    <RolesContext.Provider
      value={{
        organization: {
          roles: organizationRolesList || [],
          isLoading: isLoadingOrganizationRolesList
        },
        workspace: {
          roles: workspaceRolesList || [],
          isLoading: isLoadingWorkspaceRolesList
        },
        team: {
          roles: teamRolesList || [],
          isLoading: isLoadingTeamRolesList
        }
      }}
    >
      {children}
    </RolesContext.Provider>
  );
}

export const useRoles = (type: RoleType) => {
  return useContext(RolesContext)[type];
};
