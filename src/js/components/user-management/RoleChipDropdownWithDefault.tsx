// import React, { useEffect } from 'react';

// import RoleChipDropdown, {
//   RoleChipDropdownProps
// } from '@/components/user-management/RoleChipDropdown';

// /**
//  * Extends the RoleChipDropdown component for forms where role selections is needed.
//  * Automatically sets a role with is_default flag as selected role
//  */
// const RoleChipDropdownWithDefault = (props: RoleChipDropdownProps) => {
//   const { roles, selectedRoles, setSelectedRoles } = props;
//   useEffect(() => {
//     // Select default role if no role is already selected
//     if (selectedRoles.size === 0 && roles.length > 0) {
//       const index = roles.findIndex((role) => role.is_default);
//       if (index === -1) {
//         return;
//       }
//       setSelectedRoles(new Set([roles[index].id]));
//     }
//   }, [selectedRoles, roles]);
//   return <RoleChipDropdown {...props} />;
// };

// export default RoleChipDropdownWithDefault;
