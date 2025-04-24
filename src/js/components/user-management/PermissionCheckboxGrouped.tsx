// import { useEffect, useState } from 'react';

// import { Checkbox } from '@/components/ui/Checkbox';

// import { Permission } from '@/api-integration/types/user-management';

// interface GroupWithPermissions {
//   id: string;
//   permissions: string[];
// }
// interface PermissionCheckboxGroupedProps {
//   selectedPermissions: GroupWithPermissions[];
//   toggleSelectedGroup: (id: string) => void;
//   toggleSelectedPermission: (groupId: string, codename: string[]) => void;
//   heading: string;
//   permissionList: Permission[];
//   groupId: string;
// }

// const PermissionCheckboxGrouped = ({
//   selectedPermissions,
//   toggleSelectedGroup,
//   toggleSelectedPermission,
//   heading,
//   permissionList,
//   groupId
// }: PermissionCheckboxGroupedProps) => {
//   // Local state to keep track of checked status for each permission
//   const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     const initialStates = permissionList.reduce(
//       (acc, permission) => {
//         acc[permission.codename] = selectedPermissions?.some((sp) =>
//           sp?.permissions?.includes(permission.codename)
//         );
//         return acc;
//       },
//       {} as Record<string, boolean>
//     );
//     setCheckedStates(initialStates);
//   }, [permissionList, selectedPermissions]);

//   const allChecked = permissionList.every((permission) => checkedStates[permission.codename]);
//   const someChecked = permissionList.some((permission) => checkedStates[permission.codename]);
//   const groupCheckboxState = allChecked ? true : someChecked ? 'indeterminate' : false;

//   const handleCheckboxChange = (codename: string, checked: boolean) => {
//     const newCheckedStates = { ...checkedStates, [codename]: checked };
//     setCheckedStates(newCheckedStates);
//     toggleSelectedPermission(
//       groupId,
//       Object.keys(newCheckedStates).filter((key) => newCheckedStates[key])
//     );
//   };

//   const handleGroupCheckboxChange = (checked: boolean) => {
//     const newCheckedStates = permissionList.reduce(
//       (acc, permission) => {
//         acc[permission.codename] = checked;
//         return acc;
//       },
//       {} as Record<string, boolean>
//     );

//     setCheckedStates(newCheckedStates);
//     toggleSelectedGroup(groupId);

//     if (checked) {
//       toggleSelectedPermission(
//         groupId,
//         permissionList.map((p) => p.codename)
//       );
//     } else {
//       toggleSelectedPermission(groupId, []);
//     }
//   };

//   return (
//     <div className="mt-7 flex w-full flex-col gap-5">
//       <Checkbox
//         radius="sm"
//         isSelected={groupCheckboxState === true}
//         isIndeterminate={groupCheckboxState === 'indeterminate'}
//         onValueChange={(val) => handleGroupCheckboxChange(val)}
//         classNames={{
//           base: 'gap-2'
//         }}
//       >
//         <span className="font-medium text-default-900">{heading}</span>
//       </Checkbox>
//       <div className="flex flex-col gap-4 pl-6">
//         {permissionList.map((permission, i) => (
//           <Checkbox
//             key={i}
//             radius="sm"
//             value={permission.codename}
//             isSelected={checkedStates[permission.codename]}
//             onValueChange={(val) => handleCheckboxChange(permission.codename, val)}
//             classNames={{
//               wrapper: 'translate-y-1'
//             }}
//           >
//             <span className="text-sm font-medium text-default-900">{permission.name}</span>
//           </Checkbox>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PermissionCheckboxGrouped;
