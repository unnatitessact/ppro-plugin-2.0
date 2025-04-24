// import React, { useMemo } from 'react';

// import { DropdownProps } from '@nextui-org/react';

// import { RoleChip } from '@/components/user-management/RoleChip';
// import { RoleSelectionDropdown } from '@/components/user-management/RoleSelectionDropdown';

// import { Role } from '@/api-integration/types/user-management';

// export interface RoleChipDropdownProps extends Omit<DropdownProps, 'children'> {
//   roles: Role[];
//   selectedRoles: Set<string>;
//   setSelectedRoles: (roles: Set<string>) => void;
//   readOnly?: boolean;
// }

// const RoleChipDropdown = ({
//   roles,
//   selectedRoles,
//   setSelectedRoles,
//   readOnly = false,
//   ...rest
// }: RoleChipDropdownProps) => {
//   const roleToShowAsChip = useMemo(() => {
//     const selectedRolesArray = Array.from(selectedRoles);
//     for (const selectedRole of selectedRolesArray) {
//       const role = roles.find((role) => {
//         return role.id === selectedRole;
//       });
//       if (!role) continue;
//       return role;
//     }
//   }, [selectedRoles, roles]);

//   return (
//     <div className="flex items-center gap-2 ">
//       {roleToShowAsChip ? (
//         <RoleChip label={roleToShowAsChip.title} color={roleToShowAsChip.color} />
//       ) : (
//         <p className="text-sm text-ds-text-secondary">No roles</p>
//       )}
//       <div>
//         <RoleSelectionDropdown
//           roles={roles}
//           selectedRoles={selectedRoles}
//           setSelectedRoles={setSelectedRoles}
//           disableAllItems={readOnly}
//           hideCheckboxes={readOnly}
//           {...rest}
//         />
//       </div>
//     </div>
//   );
// };

// export default RoleChipDropdown;
