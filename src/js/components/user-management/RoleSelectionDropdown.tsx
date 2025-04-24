// 'use client';

// import '@nextui-org/react';

// import { DropdownProps } from '@nextui-org/react';

// import ButtonWithNumber from '@/components/ui/ButtonWithNumber';
// import { Checkbox } from '@/components/ui/Checkbox';
// import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';

// import { RoleChip } from '@/components/user-management/RoleChip';

// import { Role } from '@/api-integration/types/user-management';

// import { COMBINATIONS_KEY } from '@/data/colors';

// interface RoleSelectionDropdownProps extends Omit<DropdownProps, 'children'> {
//   roles: Role[];
//   selectedRoles: Set<string>;
//   setSelectedRoles: (roles: Set<string>) => void;
//   disableAllItems?: boolean;
//   hideCheckboxes?: boolean;
//   variant?: 'default' | 'countInWords';
// }

// interface RoleItem {
//   title: string;
//   color: COMBINATIONS_KEY;
//   isSelected?: boolean;
//   hideCheckbox?: boolean;
// }

// export const RoleSelectionDropdown = ({
//   roles,
//   selectedRoles,
//   setSelectedRoles,
//   disableAllItems = false,
//   hideCheckboxes = false,
//   variant = 'default',
//   ...rest
// }: RoleSelectionDropdownProps) => {
//   return (
//     <Dropdown placement="bottom-end" {...rest}>
//       <DropdownTrigger>
//         <ButtonWithNumber
//           number={selectedRoles?.size - 1 > 0 ? selectedRoles?.size - 1 : undefined}
//           customString={
//             variant === 'countInWords'
//               ? selectedRoles.size === 1
//                 ? roles.find((role) => role.id === Array.from(selectedRoles)[0])?.title
//                 : `${selectedRoles.size} roles`
//               : undefined
//           }
//         />
//       </DropdownTrigger>
//       <DropdownMenu
//         classNames={{
//           list: 'max-h-60 overflow-y-auto'
//         }}
//         closeOnSelect={false}
//         disallowEmptySelection
//         selectionMode="multiple"
//         selectedKeys={selectedRoles}
//         disabledKeys={disableAllItems ? roles.map((role) => role.id) : undefined}
//         onSelectionChange={(keys) => setSelectedRoles(keys as Set<string>)}
//         emptyContent={<RoleSelectionDropdownEmptyContent />}
//       >
//         {roles.map((role) => (
//           <DropdownItem key={role.id} hideSelectedIcon>
//             <RoleSelectionDropdownItemContent
//               title={role.title}
//               color={role.color}
//               isSelected={selectedRoles.has(role.id)}
//               hideCheckbox={hideCheckboxes}
//             />
//           </DropdownItem>
//         ))}
//       </DropdownMenu>
//     </Dropdown>
//   );
// };

// export const RoleSelectionDropdownItemContent = ({
//   title,
//   color,
//   isSelected,
//   hideCheckbox = false
// }: RoleItem) => {
//   return (
//     <div className="flex items-center gap-2">
//       {!hideCheckbox && <Checkbox isSelected={isSelected} />}
//       <RoleChip label={title} color={color} />
//     </div>
//   );
// };

// const RoleSelectionDropdownEmptyContent = () => (
//   <div className="flex h-full w-full items-center justify-center text-sm font-medium text-ds-text-secondary">
//     No roles are available to select.
//   </div>
// );
