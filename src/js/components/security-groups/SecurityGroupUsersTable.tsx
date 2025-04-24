// import { useEffect, useMemo, useRef, useState } from 'react';

// import { usePermissions } from '@/context/permissions';
// import { useDebouncedValue } from '@mantine/hooks';
// import { cn, PopoverTrigger, Skeleton, useDisclosure } from '@nextui-org/react';
// import pluralize from 'pluralize';
// import { useInView } from 'react-intersection-observer';

// import { ChevronDownSmall, CrossLarge, PeopleRemove } from '@tessact/icons';

// import { Button } from '@/components/ui/Button';
// // import DataTable from '@/components/ui/DataTable';

// import ConfirmationModal from '@/components/ui/modal/ConfirmationModal';
// import { Popover, PopoverContent } from '@/components/ui/Popover';
// import { ScrollShadow } from '@/components/ui/ScrollShadow';
// import { User } from '@/components/ui/User';
// import UserFallback from '@/components/ui/UserFallback';

// import { FetchingNextPageIndicator } from '@/components/library/FetchingNextPageIndicator';
// import WorkspacePill from '@/components/security-groups/WorkspacePill';

// import { useRemoveMembersFromSecurityGroup } from '@/api-integration/mutations/security-group';
// import { useSecurityGroupUsersQuery } from '@/api-integration/queries/security-groups';
// import { Workspace } from '@/api-integration/types/user-management';

// import { Column } from '@/types/table';

// import { checkPermission, PERMISSIONS } from '@/utils/accessUtils';

// import { PROFILE_COMBINATIONS } from '@/data/colors';
// import { debounceTime } from '@/data/inputs';

// import Table from '../table/Table';

// interface SecurityGroupUsersTableProps {
//   groupId: string;
//   searchQuery: string;
//   setSearchQuery: (value: string) => void;
//   groupName?: string;
//   isSelectionEnabled?: boolean;
// }

// export const SecurityGroupUsersTable = ({
//   groupId,
//   searchQuery,
//   setSearchQuery,
//   groupName,
//   isSelectionEnabled = true
// }: SecurityGroupUsersTableProps) => {
//   const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);
//   const { data, isLoading, fetchNextPage, isFetchingNextPage, isSuccess, hasNextPage } =
//     useSecurityGroupUsersQuery(groupId, debouncedSearchQuery);
//   const { organizationPermissions } = usePermissions();
//   const heightRef = useRef<HTMLDivElement>(null);

//   const users = data?.pages.flatMap((page) => page.results) || [];

//   const [selectedData, setSelectedData] = useState<typeof users>([]);
//   const [sortColumn, setSortColumn] = useState<{
//     key: string;
//     order: 'asc' | 'desc' | '';
//   }>({
//     key: '',
//     order: ''
//   });

//   const {
//     isOpen: isRemoveUsersFromGroupModalOpen,
//     onOpen: onRemoveUsersFromGroupModalOpen,
//     onOpenChange: onRemoveUsersFromGroupModalOpenChange
//   } = useDisclosure();

//   const { mutateAsync: removeUserFromGroup, isPending: isRemoveUserFromGroupPending } =
//     useRemoveMembersFromSecurityGroup(groupId);

//   // const columns = useMemo<ColumnDef<(typeof users)[0]>[]>(
//   //   () => [
//   //     {
//   //       id: 'name',
//   //       enableHiding: false,
//   //       header: 'NAME',
//   //       cell: ({ row }) => {
//   //         return (
//   //           <User
//   //             name={row.original.profile.display_name || 'No display name'}
//   //             description={row.original.email}
//   //             avatarProps={{
//   //               src: row.original.profile.profile_picture as string,
//   //               alt: row.original.profile?.display_name,
//   //               size: 'md',
//   //               showFallback: true,
//   //               classNames: {
//   //                 base: cn(PROFILE_COMBINATIONS[row.original?.profile?.color || 0])
//   //               },
//   //               fallback: (
//   //                 <UserFallback
//   //                   firstName={row.original.profile.first_name}
//   //                   lastName={row.original.profile?.last_name}
//   //                   displayName={row.original.profile?.display_name}
//   //                   email={row.original.email}
//   //                   color={row.original.profile?.color}
//   //                 />
//   //               )
//   //             }}
//   //           />
//   //         );
//   //       },
//   //       enableSorting: false,
//   //       enableResizing: true
//   //     },

//   //     {
//   //       id: 'last_active',
//   //       enableHiding: true,
//   //       header: 'LAST ACTIVE',
//   //       cell: ({ row }) => {
//   //         return <LastActive date={row.original.last_active} />;
//   //       },
//   //       enableSorting: false,
//   //       enableResizing: true
//   //     },
//   //     {
//   //       id: 'workspaces',
//   //       enableHiding: true,
//   //       header: 'WORKSPACES',
//   //       enableSorting: false,
//   //       enableResizing: false,
//   //       cell: ({
//   //         row: {
//   //           original: { workspaces }
//   //         }
//   //       }) => {
//   //         return <WorkspacePills workspaces={workspaces} />;
//   //       }
//   //     }
//   //   ],
//   //   []
//   // );

//   // const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     console.log(selectedData);
//   }, [selectedData]);

//   const tableColumns: Column<(typeof users)[0]>[] = useMemo(
//     () => [
//       {
//         header: 'Name',
//         label: 'Name',
//         key: 'name',
//         isRowHeader: true,
//         isResizable: true,
//         cell: ({ row }) => (
//           <User
//             name={row.profile.display_name || 'No display name'}
//             description={row.email}
//             avatarProps={{
//               src: row.profile.profile_picture as string,
//               alt: row.profile?.display_name,
//               size: 'md',
//               showFallback: true,
//               classNames: {
//                 base: cn(PROFILE_COMBINATIONS[row?.profile?.color || 0])
//               },
//               fallback: (
//                 <UserFallback
//                   firstName={row.profile.first_name}
//                   lastName={row.profile?.last_name}
//                   displayName={row.profile?.display_name}
//                   email={row.email}
//                   color={row.profile?.color}
//                 />
//               )
//             }}
//           />
//         ),
//         width: null,
//         minWidth: 400,
//         maxWidth: 1200,
//         isSortable: false
//       },
//       // {
//       //   header: 'Last active',
//       //   label: 'Last Active',
//       //   key: 'lastActive',
//       //   isRowHeader: false,
//       //   cell: ({ row }) => <LastActive date={row.last_active} />,
//       //   width: null,
//       //   minWidth: 300,
//       //   maxWidth: 800,
//       //   isResizable: true,
//       //   isSortable: false
//       // },
//       {
//         header: 'Workspaces',
//         label: 'Workspaces',
//         key: 'workspaces',
//         isRowHeader: false,
//         cell: ({ row }) => (
//           <>
//             <WorkspacePills workspaces={row.workspaces} />
//           </>
//           // <div>{row.roles?.map((role) => <div key={role.id}>{role.title}</div>)}</div>
//         ),
//         width: null,
//         minWidth: 300,
//         maxWidth: 800,
//         isResizable: true,
//         isSortable: false
//       }
//     ],
//     [organizationPermissions]
//   );

//   const { ref: scrollRef, inView } = useInView();

//   useEffect(() => {
//     if (inView && hasNextPage && isSuccess) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isSuccess, fetchNextPage]);

//   const height = Math.max(0, heightRef?.current?.clientHeight ?? 0 - 20);

//   return (
//     <div className="relative flex h-full flex-col gap-4 pb-5" ref={heightRef}>
//       <Table
//         tableId="security-group-users-table"
//         hasTableHeader={false}
//         columns={tableColumns}
//         selectedData={selectedData}
//         data={users}
//         setSelectedData={setSelectedData}
//         sortColumn={sortColumn}
//         setSortColumn={setSortColumn}
//         isRowDragEnabled={false}
//         isColumnDragEnabled={true}
//         isLoading={isLoading}
//         scrollHeight={height}
//         tableActionsY={selectedData.length > 0 ? 40 : 0}
//         paginationScrollRef={scrollRef}
//         isSelectionEnabled={isSelectionEnabled}
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
//         tableActions={
//           <div className="flex w-full items-center justify-between">
//             <p className="text-base font-medium">
//               {pluralize('user', selectedData.length, true)} selected
//             </p>

//             <div className="flex items-center gap-2">
//               {checkPermission(
//                 PERMISSIONS.ORGANIZATION
//                   .CAN_MANAGE_SECURITY_GROUPS_PERMISSIONS_TO_CONTENT_ACROSS_WORKSPACES,
//                 organizationPermissions || []
//               ) && (
//                 <Button
//                   color="transparent"
//                   onPress={() => onRemoveUsersFromGroupModalOpen()}
//                   startContent={<PeopleRemove size={20} />}
//                   aria-label="Remove users"
//                 >
//                   Remove users
//                 </Button>
//               )}
//               <Button
//                 isIconOnly
//                 color="transparent"
//                 onPress={() => setSelectedData([])}
//                 aria-label="Clear selection"
//               >
//                 <CrossLarge size={20} />
//               </Button>
//             </div>
//           </div>
//         }
//         searchQuery={searchQuery}
//         onSearchQueryChange={setSearchQuery}
//       />

//       <ConfirmationModal
//         isOpen={isRemoveUsersFromGroupModalOpen}
//         onOpenChange={onRemoveUsersFromGroupModalOpenChange}
//         subtitle={`Remove  ${selectedData.length} ${pluralize('user', selectedData.length)} from ${groupName}?`}
//         title="Remove users from security group"
//         confirmText="Yes, Remove"
//         confirmButtonColor="danger"
//         confirmAction={async () => {
//           try {
//             await removeUserFromGroup(selectedData.map((user) => user.id) as string[], {
//               onSuccess: () => {
//                 onRemoveUsersFromGroupModalOpenChange();
//                 setSelectedData([]);
//               }
//             });
//           } catch (error) {
//             console.log(error);
//           }
//         }}
//         isLoading={isRemoveUserFromGroupPending}
//       />
//       <FetchingNextPageIndicator
//         isFetching={isFetchingNextPage}
//         customText="Loading more users..."
//       />
//     </div>
//   );
// };

// const WorkspacePills = ({ workspaces }: { workspaces: Workspace[] }) => {
//   if (workspaces.length === 0) {
//     return <></>;
//   }
//   return (
//     <div className="flex  flex-wrap gap-2 p-3">
//       <WorkspacePill
//         key={workspaces[0].id}
//         title={workspaces[0].title}
//         image={workspaces[0].display_image}
//         color={workspaces[0].color}
//       />
//       {workspaces.length > 1 && (
//         <Popover placement="bottom-end">
//           <PopoverTrigger className="h-9 bg-ds-button-secondary-bg">
//             <Button
//               color="secondary"
//               className="group flex h-9 min-w-0 items-center justify-center rounded-xl bg-transparent p-0 data-[hover=true]:bg-transparent"
//               aria-label="Show more workspaces"
//             >
//               <div className="flex h-9 gap-px">
//                 <div className="flex h-9 w-full items-center justify-center rounded-bl-xl rounded-tl-xl bg-ds-button-secondary-bg px-3 py-0 group-hover:bg-ds-button-secondary-bg-hover">
//                   {workspaces.length > 1 && `+${workspaces.length - 1}`}
//                 </div>
//                 <div className="flex h-9 items-center justify-center rounded-br-xl rounded-tr-xl bg-ds-button-secondary-bg py-0 pl-1 pr-2 group-hover:bg-ds-button-secondary-bg-hover">
//                   <ChevronDownSmall size={20} />
//                 </div>
//               </div>
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="max-h-60">
//             <ScrollShadow>
//               <div className="flex flex-col gap-1 px-2 py-3">
//                 {workspaces.slice(1).map((workspace) => (
//                   <WorkspacePill
//                     key={workspace.id}
//                     title={workspace.title}
//                     image={workspace.display_image}
//                     color={workspace.color}
//                     className="bg-transparent"
//                   />
//                 ))}
//               </div>
//             </ScrollShadow>
//           </PopoverContent>
//         </Popover>
//       )}
//     </div>
//   );
// };
