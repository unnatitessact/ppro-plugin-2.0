// import React, {
//   Dispatch,
//   ReactNode,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState
// } from 'react';

// import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
// import { cn, Skeleton } from '@nextui-org/react';
// import { useInView } from 'react-intersection-observer';
// import { z } from 'zod';

// import { PeopleAdd } from '@tessact/icons';

// import { itemClassnames, Listbox, ListboxItem } from '@/components/ui/Listbox';
// import { popoverClassNames } from '@/components/ui/Popover';
// import { User } from '@/components/ui/User';
// import UserFallback from '@/components/ui/UserFallback';

// import { Searchbar } from '@/components/Searchbar';

// import { useCheckUser } from '@/api-integration/mutations/auth';
// import { Role, UserWithRoles } from '@/api-integration/types/user-management';

// import { PROFILE_COMBINATIONS } from '@/data/colors';

// interface UsersSelectionListProps {
//   defaultRole?: Role;
//   users: UserWithRoles[];
//   searchQuery: string;
//   setSearchQuery: Dispatch<SetStateAction<string>>;
//   setSelectedUsers: Dispatch<SetStateAction<UserWithRoles[]>>;
//   fetchNextPage: () => void;
//   isSuccess: boolean;
//   openUsersList: boolean;
//   setOpenUsersList: Dispatch<SetStateAction<boolean>>;
//   selectedUsers: UserWithRoles[];
//   placeholder?: string;
//   isLoadingUsers: boolean;
//   isFetchingNextPage: boolean;
//   hasNextPage: boolean;
//   emptyContent?: ReactNode;
//   showInviteUser?: boolean;
// }

// const UsersSelectionList = ({
//   defaultRole,
//   users,
//   searchQuery,
//   setSearchQuery,
//   setSelectedUsers,
//   fetchNextPage,
//   isSuccess,
//   openUsersList,
//   setOpenUsersList,
//   selectedUsers,
//   placeholder,
//   isLoadingUsers,
//   isFetchingNextPage,
//   hasNextPage,
//   emptyContent,
//   showInviteUser
// }: UsersSelectionListProps) => {
//   const handleAddUser = (userId: string) => {
//     const userToAdd = users?.find((user) => user.id === userId);
//     if (userToAdd) {
//       // Add the user to the selectedUsers list if not already added
//       setSelectedUsers((prevSelectedUsers) => {
//         if (!prevSelectedUsers.some((user) => user.id === userId)) {
//           return [
//             ...prevSelectedUsers,
//             { ...userToAdd, roles: defaultRole ? [defaultRole] : [] } as UserWithRoles
//           ];
//         }
//         return prevSelectedUsers;
//       });
//       setOpenUsersList(false);
//       setSearchQuery('');
//     }
//   };

//   const handleAddNewUser = () => {
//     setSelectedUsers((prevSelectedUsers) => {
//       if (!prevSelectedUsers.some((user) => user.email === searchQuery)) {
//         return [
//           ...prevSelectedUsers,
//           {
//             id: `new-user-${searchQuery}`,
//             email: searchQuery,
//             roles: defaultRole ? [defaultRole] : [],
//             profile: {
//               display_name: searchQuery,
//               first_name: '',
//               last_name: '',
//               profile_picture: '',
//               color: 'amber'
//             }
//           } as UserWithRoles
//         ];
//       }
//       return prevSelectedUsers;
//     });
//     setOpenUsersList(false);
//     setSearchQuery('');
//   };

//   const outsideRef = useClickOutside(() => setOpenUsersList(false));

//   const { ref, inView } = useInView();

//   useEffect(() => {
//     if (inView && isSuccess) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage, isSuccess]);

//   const handleSearchQueryChange = (value: string) => {
//     if (value.length === 0) {
//       setOpenUsersList(false);
//     }
//     if (value.length > 0) {
//       setOpenUsersList(true);
//     }
//     setSearchQuery(value);
//   };

//   const isUserToInviteAlreadySelected = useMemo(() => {
//     return selectedUsers?.some(
//       (user) => user.email === searchQuery && user.id.startsWith('new-user-')
//     );
//   }, [searchQuery, selectedUsers]);

//   return (
//     <div className="flex flex-col gap-2">
//       <Searchbar
//         onFocus={() => setOpenUsersList(true)}
//         value={searchQuery}
//         onValueChange={handleSearchQueryChange}
//         placeholder={placeholder ?? 'Search for users'}
//       />

//       <div
//         className={cn(
//           popoverClassNames.content,
//           'z-100',
//           !openUsersList && 'hidden',
//           showInviteUser && 'pb-0'
//         )}
//       >
//         <Listbox
//           bottomContent={
//             <>
//               <div ref={ref} />
//               {(hasNextPage || isFetchingNextPage) && (
//                 <div className="flex h-10 w-full items-start gap-2 px-2 pb-2">
//                   <Skeleton className="h-10 w-10 rounded-full" />
//                   <div className="flex flex-1 flex-col gap-1">
//                     <Skeleton className="h-5 w-full rounded-md" />
//                     <Skeleton className="h-4 w-full rounded-md" />
//                   </div>
//                 </div>
//               )}
//             </>
//           }
//           ref={outsideRef}
//           emptyContent={
//             showInviteUser ? (
//               <InviteUserItem
//                 isUserToInviteAlreadySelected={isUserToInviteAlreadySelected}
//                 searchQuery={searchQuery}
//                 onClick={handleAddNewUser}
//               />
//             ) : isLoadingUsers ? (
//               <div className="flex flex-col gap-3">
//                 {[...Array(3)].map((_, index) => (
//                   <div key={index} className="flex h-10 w-full items-start gap-2 p-0">
//                     <Skeleton className="h-10 w-10 rounded-full" />
//                     <div className="flex flex-1 flex-col gap-1">
//                       <Skeleton className="h-5 w-full rounded-md" />
//                       <Skeleton className="h-4 w-full rounded-md" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <>
//                 {emptyContent ? (
//                   emptyContent
//                 ) : (
//                   <div className="line-clamp-1 flex h-full w-full text-center text-sm font-medium text-ds-text-secondary">
//                     {searchQuery
//                       ? `No users matching for search query "${searchQuery}"`
//                       : 'No users found'}
//                   </div>
//                 )}
//               </>
//             )
//           }
//           className={cn('max-h-60 overflow-y-auto', 'transition-all duration-300 ease-in-out')}
//           classNames={{
//             emptyContent: showInviteUser && !isLoadingUsers && users.length === 0 ? 'p-0' : ''
//           }}
//         >
//           {users
//             ?.filter((user) => !selectedUsers?.some((selectedUser) => selectedUser.id === user.id))
//             ?.map((user) => (
//               <ListboxItem key={user.id} onPress={() => handleAddUser(user.id)}>
//                 <User
//                   name={user.profile?.display_name || 'No display name'}
//                   description={user.email}
//                   avatarProps={{
//                     src: user.profile?.profile_picture || undefined,
//                     alt: user.profile?.display_name?.toString(),
//                     size: 'md',
//                     showFallback: true,
//                     classNames: {
//                       base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
//                     },
//                     fallback: (
//                       <UserFallback
//                         firstName={user.profile.first_name}
//                         lastName={user.profile?.last_name}
//                         displayName={user.profile?.display_name}
//                         email={user.email}
//                         color={user.profile?.color}
//                       />
//                     )
//                   }}
//                   classNames={{
//                     name: 'cursor-pointer',
//                     base: 'gap-3'
//                   }}
//                 />
//               </ListboxItem>
//             ))}
//         </Listbox>
//         {users.length > 0 && showInviteUser && (
//           <div className="p-1">
//             <InviteUserItem
//               isUserToInviteAlreadySelected={isUserToInviteAlreadySelected}
//               searchQuery={searchQuery}
//               onClick={handleAddNewUser}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersSelectionList;

// const emailSchema = z.string().email();

// function useValidateEmail(email: string): boolean {
//   const [isValid, setIsValid] = useState(false);
//   useEffect(() => {
//     try {
//       emailSchema.parse(email);
//       setIsValid(true);
//     } catch (e) {
//       setIsValid(false);
//     }
//   }, [email]);
//   return isValid;
// }
// const InviteUserItem = ({
//   isUserToInviteAlreadySelected,
//   hidePadding,
//   searchQuery,
//   onClick
// }: {
//   isUserToInviteAlreadySelected: boolean;
//   hidePadding?: boolean;
//   searchQuery: string;
//   onClick: () => void;
// }) => {
//   const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 200);
//   const isEmailValid = useValidateEmail(debouncedSearchQuery);

//   const [isUserExisting, setIsUserExisting] = useState<boolean | undefined>(undefined);

//   const { mutateAsync: checkUser, isPending: isCheckingUser } = useCheckUser();

//   const check = useCallback(async () => {
//     await checkUser(debouncedSearchQuery, {
//       onSuccess: (exists) => {
//         if (exists) {
//           setIsUserExisting(true);
//         } else {
//           setIsUserExisting(false);
//         }
//       }
//     });
//   }, [debouncedSearchQuery, checkUser]);

//   useEffect(() => {
//     if (isEmailValid) {
//       check();
//     }
//   }, [isEmailValid, check]);

//   const enabled =
//     !isUserToInviteAlreadySelected && isEmailValid && !isUserExisting && !isCheckingUser;

//   return (
//     <div
//       onClick={enabled ? onClick : undefined}
//       className={cn(
//         itemClassnames.base,
//         !hidePadding && 'px-2 py-1.5',
//         enabled ? 'cursor-pointer' : 'pointer-events-none'
//       )}
//     >
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full border border-default-900/15 bg-ds-menu-bg text-ds-text-secondary">
//           <PeopleAdd size={20} />
//         </div>
//         <div className="flex flex-col text-ds-text-secondary">
//           <div className="w-full text-sm">
//             <span>Add </span>
//             <span className="text-ds-text-primary">{searchQuery}</span>
//           </div>
//           <div className="w-full text-xs">
//             {!isCheckingUser ? (
//               isUserToInviteAlreadySelected ? (
//                 'User already selected'
//               ) : isEmailValid ? (
//                 isUserExisting ? (
//                   'User part of another organization'
//                 ) : (
//                   'Tap to add '
//                 )
//               ) : (
//                 'Keep typing to add'
//               )
//             ) : (
//               <>&nbsp;</>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
