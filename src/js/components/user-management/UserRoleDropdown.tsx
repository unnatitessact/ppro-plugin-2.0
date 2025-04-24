// 'use client';

// import React, { useCallback, useMemo } from 'react';

// import { useRoles } from '@/context/roles';

// // import { useQueryClient } from '@tanstack/react-query';

// import RoleChipDropdown from '@/components/user-management/RoleChipDropdown';

// // import { useOrganization } from '@/hooks/useOrganization';

// import {
//   useAddUsersToTeams,
//   useAddUsersToWorkspace,
//   useUpdateOrganizationUserRoles
// } from '@/api-integration/mutations/user-management';
// // import { rolesQueryKey } from '@/api-integration/queries/user-management';
// import {
//   //  GetRolesResponse,
//   Role
// } from '@/api-integration/types/user-management';

// import { RoleType } from '@/types/user-management';

// interface UserRoleDropdownProps {
//   userId: string;
//   roleType: RoleType;
//   userRoles: Role[];
//   teamId?: string;
//   workspaceId?: string;
//   hasWritePermission?: boolean;
//   readOnly?: boolean;
//   showOnlySelectedRoles?: boolean;
// }

// const UserRoleDropdown = ({
//   userId,
//   roleType,
//   userRoles,
//   workspaceId,
//   teamId,
//   hasWritePermission = false
// }: UserRoleDropdownProps) => {
//   // const queryClient = useQueryClient();
//   // const organization = useOrganization();

//   // const roles = queryClient.getQueryData(
//   //   rolesQueryKey(roleType, organization?.id, undefined)
//   // ) as GetRolesResponse;

//   const { roles } = useRoles(roleType);

//   //   const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set([]));
//   const { mutate: updateOrganizationRoles } = useUpdateOrganizationUserRoles();
//   const { mutate: updateTeamRoles } = useAddUsersToTeams();
//   const { mutate: updateWorkspaceRoles } = useAddUsersToWorkspace();
//   const selectedRoles = useMemo(() => new Set(userRoles.map((role) => role.id)), [userRoles]);
//   const setSelectedRoles = useCallback(
//     (newRoles: Set<string>) => {
//       const role_ids = Array.from(newRoles).sort(
//         (a, b) =>
//           roles.findIndex((role) => role.id === a) - roles.findIndex((role) => role.id === b)
//       );
//       switch (roleType) {
//         case 'organization':
//           updateOrganizationRoles([
//             {
//               user_id: userId,
//               role_ids
//             }
//           ]);
//           break;
//         case 'workspace':
//           if (!workspaceId) break;
//           updateWorkspaceRoles([
//             {
//               user_id: userId,
//               role_ids,
//               workspace: workspaceId
//             }
//           ]);
//           break;
//         case 'team':
//           if (!teamId) break;
//           updateTeamRoles([
//             {
//               user_id: userId,
//               role_ids,
//               team_id: teamId
//             }
//           ]);
//           break;
//       }
//     },
//     [
//       roleType,
//       userId,
//       updateOrganizationRoles,
//       updateTeamRoles,
//       updateWorkspaceRoles,
//       teamId,
//       workspaceId,
//       roles
//     ]
//   );

//   if (!roles) return null;
//   return (
//     <RoleChipDropdown
//       selectedRoles={selectedRoles}
//       setSelectedRoles={setSelectedRoles}
//       roles={hasWritePermission ? roles : roles.filter((role) => selectedRoles.has(role.id))}
//       readOnly={!hasWritePermission}
//     />
//   );
// };

// export default UserRoleDropdown;
