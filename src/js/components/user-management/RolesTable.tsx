// 'use client';

// import type { Role } from '@/api-integration/types/user-management';
// import type { RoleType } from '@/types/user-management';
// import type { Key } from 'react';

// import { useMemo, useState } from 'react';

// import { usePermissions } from '@/context/permissions';
// import { useElementSize } from '@mantine/hooks';
// import { cn, Skeleton, useDisclosure } from '@nextui-org/react';

// import { DotGrid1X3Horizontal } from '@tessact/icons';

// import { Button } from '@/components/ui/Button';
// // import DataTable from '@/components/ui/DataTable';
// import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
// import ConfirmationModal from '@/components/ui/modal/ConfirmationModal';

// import DefaultRolePill from '@/components/user-management/DefaultRolePill';

// import { useDeleteRole, useSetRoleAsDefault } from '@/api-integration/mutations/user-management';

// import { Column } from '@/types/table';

// import { checkPermission, PERMISSIONS } from '@/utils/accessUtils';

// import Table from '../table/Table';

// interface RolesTableProps {
//   roles: Role[];
//   isRolesLoading: boolean;
//   roleType: RoleType;
//   onRowClick: (role: Role) => void;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
// }

// export const RolesTable = ({
//   roles,
//   isRolesLoading,
//   roleType,
//   onRowClick,
//   searchQuery,
//   setSearchQuery
// }: RolesTableProps) => {
//   const { organizationPermissions } = usePermissions();

//   const [selectedRowForDeletion, setSelectedRowForDeletion] = useState<Role | undefined>(undefined);
//   const { ref: heightRef, height } = useElementSize();

//   const hasPermission = checkPermission(
//     PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_ROLES,
//     organizationPermissions || []
//   );

//   const {
//     isOpen: isConfirmDeleteOpen,
//     onOpen: onConfirmDeleteOpen,
//     onOpenChange: onConfirmDeleteOpenChange
//   } = useDisclosure();

//   const { mutate: deleteRole, isPending } = useDeleteRole(roleType);
//   const { mutate: setRoleAsDefault } = useSetRoleAsDefault(roleType);

//   const actions = hasPermission
//     ? [
//         {
//           label: 'Set as default',
//           key: 'default-role',
//           onAction: (id: string) => {
//             setRoleAsDefault({
//               id
//             });
//           }
//         },
//         {
//           label: 'Delete role',
//           key: 'delete-role',
//           onAction: (id: string) => {
//             onConfirmDeleteOpen();
//             setSelectedRowForDeletion(roles.find((role) => role.id === id));
//           }

//           // className: 'text-danger'
//         }
//       ]
//     : [];

//   // const columns = useMemo<ColumnDef<Role>[]>(
//   //   () => [
//   //     {
//   //       id: 'title',
//   //       enableHiding: false,
//   //       header: 'Title',
//   //       cell: ({ row }) => {
//   //         return (
//   //           <div
//   //             className={cn(
//   //               'flex items-center gap-2 font-medium',
//   //               hasPermission && 'cursor-pointer'
//   //             )}
//   //             onClick={() => hasPermission && onRowClick(row.original)}
//   //           >
//   //             {row.original.title}
//   //             {row.original.is_default && <DefaultRolePill />}
//   //           </div>
//   //         );
//   //       },
//   //       enableSorting: false,
//   //       enableResizing: true
//   //     },
//   //     {
//   //       id: 'user_count',
//   //       enableHiding: true,
//   //       header: 'Users',
//   //       cell: ({ row }) => {
//   //         return (
//   //           <span className="text-xs font-medium">
//   //             {row.original.user_count === 0 ? (
//   //               'No users'
//   //             ) : (
//   //               <>
//   //                 {row.original.user_count}
//   //                 {row.original.user_count === 1 ? ' user' : ' users'}
//   //               </>
//   //             )}
//   //           </span>
//   //         );
//   //       },
//   //       enableSorting: false,
//   //       enableResizing: true
//   //     },
//   //     {
//   //       id: 'description',
//   //       enableHiding: true,
//   //       header: 'Description',
//   //       cell: ({ row }) => {
//   //         return (
//   //           <p className="text-xs text-default-400">
//   //             {row.original.description ? row.original.description : 'No description'}
//   //           </p>
//   //         );
//   //       },
//   //       enableSorting: false,
//   //       enableResizing: false
//   //     },
//   //     {
//   //       id: 'menu',
//   //       enableHiding: false,
//   //       header: '',
//   //       enableSorting: false,
//   //       enableResizing: false,
//   //       cell: ({ row }) => {
//   //         return (
//   //           <div className="flex h-full w-full items-center justify-end">
//   //             {(hasPermission || hasPermission) && (
//   //               <RolesMenu
//   //                 role={row.original}
//   //                 roleType={roleType}
//   //                 hasModifyPermission={hasPermission}
//   //               />
//   //             )}
//   //           </div>
//   //         );
//   //       }
//   //     }
//   //   ],
//   //   [onRowClick, roleType, hasPermission, hasPermission]
//   // );

//   const tableColumns: Column<Role>[] = useMemo(
//     () => [
//       {
//         header: 'Title',
//         label: 'Title',
//         key: 'title',
//         isRowHeader: true,
//         cell: ({ row }) => (
//           <div
//             className={cn('flex items-center gap-2 font-medium', hasPermission && 'cursor-pointer')}
//             onClick={() => hasPermission && onRowClick(row)}
//           >
//             {row.title}
//             {row.is_default && <DefaultRolePill />}
//           </div>
//         ),
//         width: null,
//         minWidth: 400,
//         maxWidth: 1200,
//         isResizable: true,
//         isSortable: false
//       },
//       {
//         header: 'User count',
//         label: 'User count',
//         key: 'userCount',
//         isRowHeader: false,
//         cell: ({ row }) => (
//           <span className="text-xs font-medium">
//             {row.user_count === 0 ? (
//               'No users'
//             ) : (
//               <>
//                 {row.user_count}
//                 {row.user_count === 1 ? ' user' : ' users'}
//               </>
//             )}
//           </span>
//         ),
//         width: null,
//         minWidth: 300,
//         maxWidth: 800,
//         isResizable: true,
//         isSortable: false
//       },
//       {
//         header: 'Description',
//         label: 'Description',
//         key: 'description',
//         isRowHeader: false,
//         cell: ({ row }) => {
//           return (
//             <p className="text-xs text-default-400">
//               {row.description ? row.description : 'No description'}
//             </p>
//           );
//         },
//         width: null,
//         minWidth: 300,
//         maxWidth: 800,
//         isResizable: true,
//         isSortable: false
//       }
//     ],
//     [organizationPermissions]
//   );

//   return (
//     <div className="relative flex h-full min-h-0" ref={heightRef}>
//       {/* <DataTable
//         columns={columns}
//         loaderState={[...Array(5)].map((_, index) => (
//           <Row key={index}>
//             <Cell>
//               <div className="p-6">
//                 <Skeleton className="h-5 w-32 rounded-md" />
//               </div>
//             </Cell>
//             <Cell>
//               <div className="p-6">
//                 <Skeleton className="h-4 w-20 rounded-md" />
//               </div>
//             </Cell>
//             <Cell>
//               <div className="p-6">
//                 <Skeleton className="h-6 w-20 rounded-full" />
//               </div>
//             </Cell>
//             <Cell></Cell>
//           </Row>
//         ))}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         isLoading={isRolesLoading}
//         data={roles || []}
//         selectedData={[]}
//         setSelectedData={() => {}}
//         triggerRemoveSelection={false}
//         setTriggerRemoveSelection={() => {}}
//         scrollRef={undefined}
//         tableActions={null}
//         isSelectionEnabled={false}
//         isHoverEnabled={true}
//       /> */}

//       <Table
//         tableId="roles"
//         isSelectionEnabled={false}
//         hasTableHeader={false}
//         hasRowActions={true}
//         rowActions={actions}
//         columns={tableColumns}
//         selectedData={[]}
//         data={roles}
//         setSelectedData={() => {}}
//         isRowDragEnabled={false}
//         isColumnDragEnabled={true}
//         tableActions={null}
//         isLoading={isRolesLoading}
//         loadingState={
//           <div className="flex justify-between px-3 py-4">
//             <div className="flex w-full items-center gap-1">
//               <Skeleton className="h-10 w-10 rounded-full" />

//               <div className="flex flex-col gap-1">
//                 <Skeleton className="h-4 w-44 rounded-md" />
//                 <Skeleton className="h-3 w-36 rounded-md" />
//               </div>
//             </div>

//             <div className="flex w-full flex-col gap-1">
//               <Skeleton className="h-4 w-44 rounded-md" />
//               <Skeleton className="h-3 w-36 rounded-md" />
//             </div>

//             <div className="flex w-full items-center gap-2">
//               <Skeleton className="h-4 w-12 rounded-full" />
//               <Skeleton className="h-4 w-12 rounded-full" />
//               <Skeleton className="h-4 w-12 rounded-full" />
//             </div>
//           </div>
//         }
//         searchQuery={searchQuery}
//         onSearchQueryChange={setSearchQuery}
//         scrollHeight={height - 20}
//       />

//       <ConfirmationModal
//         isOpen={isConfirmDeleteOpen}
//         onOpenChange={onConfirmDeleteOpenChange}
//         title={`Permanently delete ${selectedRowForDeletion?.title || ''}?`}
//         subtitle="To delete this item permanently, re-enter the name of the role."
//         confirmText="Yes, Delete"
//         confirmButtonColor="danger"
//         // confirmField={role?.title}
//         confirmAction={() => {
//           if (selectedRowForDeletion?.id) {
//             deleteRole(selectedRowForDeletion?.id, {
//               onSuccess: () => {
//                 onConfirmDeleteOpenChange();
//                 setSelectedRowForDeletion(undefined);
//               }
//             });
//           }
//         }}
//         isLoading={isPending}
//       />
//     </div>
//   );
// };

// export const RolesMenu = ({
//   role,
//   roleType,
//   hasModifyPermission
// }: {
//   role: Role;
//   roleType: RoleType;
//   hasModifyPermission?: boolean;
// }) => {
//   const {
//     isOpen: isConfirmDeleteOpen,
//     onOpen: onConfirmDeleteOpen,
//     onOpenChange: onConfirmDeleteOpenChange
//   } = useDisclosure();
//   const onDropdownAction = (key: Key) => {
//     switch (key) {
//       case 'delete-role':
//         onConfirmDeleteOpen();
//         break;
//       case 'default-role':
//         setRoleAsDefault({
//           id: role.id
//         });
//     }
//   };
//   const { mutate: deleteRole, isPending } = useDeleteRole(roleType);
//   const { mutate: setRoleAsDefault } = useSetRoleAsDefault(roleType);

//   const actions = hasModifyPermission
//     ? [
//         {
//           label: 'Set as default',
//           key: 'default-role'
//         },
//         {
//           label: 'Delete role',
//           key: 'delete-role',
//           className: 'text-danger'
//         }
//       ]
//     : [];

//   return (
//     <>
//       <Dropdown placement="bottom-end" offset={12}>
//         <DropdownTrigger>
//           <Button isIconOnly size="md" variant="light" aria-label="Role menu">
//             <DotGrid1X3Horizontal size={20} />
//           </Button>
//         </DropdownTrigger>
//         <DropdownMenu onAction={(key) => onDropdownAction(key)} aria-label="Role menu">
//           {actions?.map((action) => (
//             <DropdownItem key={action.key} className={action?.className}>
//               {action.label}
//             </DropdownItem>
//           ))}
//         </DropdownMenu>
//       </Dropdown>
//       <ConfirmationModal
//         isOpen={isConfirmDeleteOpen}
//         onOpenChange={onConfirmDeleteOpenChange}
//         title={`Permanently delete ${role?.title}?`}
//         subtitle="To delete this item permanently, re-enter the name of the role."
//         confirmText="Yes, Delete"
//         confirmButtonColor="danger"
//         confirmField={role?.title}
//         confirmAction={() =>
//           deleteRole(role?.id, {
//             onSuccess: () => {
//               onConfirmDeleteOpenChange();
//             }
//           })
//         }
//         isLoading={isPending}
//       />
//     </>
//   );
// };
