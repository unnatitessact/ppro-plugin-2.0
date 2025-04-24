// import type { Key } from 'react';

// import { useCallback, useEffect, useState } from 'react';

// import { cn, useDisclosure } from '@nextui-org/react';
// import { useInView } from 'react-intersection-observer';

// import { Chip } from '@/components/ui/Chip';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow
// } from '@/components/ui/Table';
// import { User } from '@/components/ui/User';
// import UserFallback from '@/components/ui/UserFallback';

// import UserProfileModal from '@/components/user-management/modals/user-profile/UserProfileModal';

// import { useOrganization } from '@/hooks/useOrganization';

// import { useOrganizationUsersQuery } from '@/api-integration/queries/user-management';
// import { UserWithRoles } from '@/api-integration/types/user-management';

// import { PROFILE_COMBINATIONS } from '@/data/colors';

// const columns = [
//   { label: 'NAME', key: 'name' },
//   // { label: 'LAST ACTIVE', key: 'last_active' },
//   { label: 'ORGANIZATION ROLE', key: 'organization_role' }
// ];

// export const UsersTable = ({ searchQuery }: { searchQuery: string }) => {
//   const {
//     isOpen: isUserProfileOpen,
//     onOpen: onUserProfileOpen,
//     onOpenChange: onUserProfileOpenChange
//   } = useDisclosure();

//   const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

//   const organization = useOrganization();

//   const { data: organizationUsers, fetchNextPage } = useOrganizationUsersQuery(
//     organization?.id,
//     searchQuery
//   );

//   const users = organizationUsers?.pages.flatMap((user) => user.results) || [];

//   const { ref, inView } = useInView();

//   useEffect(() => {
//     if (inView) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage]);

//   const renderCell = useCallback((user: (typeof users)[0], columnKey: Key) => {
//     switch (columnKey) {
//       case 'name':
//         return (
//           <User
//             name={user.profile.display_name || 'No display name'}
//             description={user.email}
//             classNames={{
//               name: 'cursor-pointer'
//             }}
//             onClick={() => {
//               setSelectedUser(user);
//               onUserProfileOpenChange();
//             }}
//             avatarProps={{
//               src: user.profile.profile_picture as string,
//               alt: user.profile?.display_name,
//               size: 'md',
//               showFallback: true,
//               classNames: {
//                 base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
//               },
//               fallback: (
//                 <UserFallback
//                   firstName={user.profile.first_name}
//                   lastName={user.profile?.last_name}
//                   displayName={user.profile?.display_name}
//                   email={user.email}
//                   color={user.profile?.color}
//                 />
//               )
//             }}
//           />
//         );
//       case 'last_active':
//         return (
//           <div className="spacy-y-1 text-xs font-medium">
//             <p>5:23pm</p>
//             <span className="text-default-500">23 hours ago</span>
//           </div>
//         );
//       case 'organization_role':
//         return (
//           <div className="flex flex-wrap gap-2">
//             {user.roles.map((role) => (
//               <Chip key={role.id}>{role.title}</Chip>
//             ))}
//           </div>
//         );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <>
//       <Table aria-label="Organization users">
//         <TableHeader columns={columns}>
//           {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
//         </TableHeader>
//         <TableBody items={users || []}>
//           {(user) => (
//             <TableRow key={user.id}>
//               {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       <button ref={ref} className="invisible">
//         Load More
//       </button>
//       <UserProfileModal
//         isOpen={isUserProfileOpen}
//         onOpenChange={onUserProfileOpenChange}
//         onOpen={onUserProfileOpen}
//         user={selectedUser}
//       />
//     </>
//   );
// };
