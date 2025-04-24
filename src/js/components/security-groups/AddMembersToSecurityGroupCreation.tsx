// import { useState } from "react";

// import { useDebouncedValue } from "@mantine/hooks";
// import { cn, ScrollShadow } from "@nextui-org/react";

// import { Check, CrossLarge } from "@tessact/icons";

// import { Button } from "../../components/ui/Button";
// // import { Input } from '@/components/ui/Input';
// // import { Listbox, ListboxItem } from '@/components/ui/Listbox';
// import { ModalBody, ModalFooter } from "../../components/ui/Modal";
// import { User } from "../../components/ui/User";
// import UserFallback from "../../components/ui/UserFallback";

// import UsersSelectionList from "../../components/user-management/UsersSelectionList";

// import { useOrganization } from "../../hooks/useOrganization";

// import { useCreateSecurityGroup } from "../../api-integration/mutations/security-groups";
// import { useOrganizationUsersQuery } from "../../api-integration/queries/user-management";
// import { UserWithRoles } from "../../api-integration/types/user-management";

// import { PROFILE_COMBINATIONS } from "../../constants/data-colors/data-colors";
// // import { debounceTime } from "../../constants/data-inputs";

// const debounceTime = 300;

// interface AddMembersToSecurityGroupCreationProps {
//   name: string;
//   description: string;
//   onClose: (isOpen: boolean) => void;
// }

// const AddMembersToSecurityGroupCreation = ({
//   name,
//   description,
//   onClose,
// }: AddMembersToSecurityGroupCreationProps) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearchQuery] = useDebouncedValue(searchQuery, debounceTime);
//   const [selectedUsers, setSelectedUsers] = useState<UserWithRoles[]>([]);
//   const [openUsersList, setOpenUsersList] = useState(false);

//   const organization = useOrganization();

//   const {
//     data: organizationUsers,
//     fetchNextPage,
//     isFetchingNextPage,
//     isSuccess,
//     isLoading: isLoadingUsers,
//     hasNextPage,
//   } = useOrganizationUsersQuery(organization?.id, debouncedSearchQuery);

//   const users = organizationUsers?.pages.flatMap((page) => page.results);

//   // const handleAddUser = (userId: string) => {
//   //   const userToAdd = users?.find((user) => user.id === userId);
//   //   if (userToAdd) {
//   //     // Add the user to the selectedUsers list if not already added
//   //     setSelectedUsers((prevSelectedUsers) => {
//   //       if (!prevSelectedUsers.some((user) => user.id === userId)) {
//   //         return [...prevSelectedUsers, userToAdd];
//   //       }
//   //       return prevSelectedUsers;
//   //     });
//   //     // Remove the user from the allUsers list
//   //   }
//   // };

//   const handleRemoveUser = (userId: string) => {
//     const userToRemove = selectedUsers.find((user) => user.id === userId);
//     if (userToRemove) {
//       // Remove the user from the selectedUsers list
//       setSelectedUsers((prevSelectedUsers) =>
//         prevSelectedUsers.filter((user) => user.id !== userId)
//       );
//       //
//     }
//   };

//   const { mutateAsync, isPending } = useCreateSecurityGroup();

//   return (
//     <form
//       className="flex min-h-52 flex-col gap-2"
//       onSubmit={async (e) => {
//         e.preventDefault();

//         try {
//           await mutateAsync({
//             organization: organization?.id as string,
//             title: name,
//             description: description,
//             users: selectedUsers.map((user) => user.id),
//           });

//           onClose(false);

//           // Close modal
//         } catch (error) {
//           console.error(error);
//         }
//       }}
//     >
//       <ModalBody>
//         <div className="relative flex max-h-80 min-h-80 flex-col gap-4">
//           <UsersSelectionList
//             setSelectedUsers={setSelectedUsers}
//             users={users ?? []}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             fetchNextPage={fetchNextPage}
//             openUsersList={openUsersList}
//             setOpenUsersList={setOpenUsersList}
//             isSuccess={isSuccess}
//             selectedUsers={selectedUsers}
//             isLoadingUsers={isLoadingUsers}
//             isFetchingNextPage={isFetchingNextPage}
//             hasNextPage={hasNextPage}
//             placeholder="Search for users in organization"
//           />
//           <ScrollShadow>
//             <div
//               className={cn({
//                 "absolute top-12 -z-10 hidden w-full": openUsersList,
//                 "z-0": !openUsersList,
//               })}
//             >
//               {selectedUsers.map((user) => (
//                 <UserListItem
//                   key={user.id}
//                   user={user}
//                   handleRemoveUser={handleRemoveUser}
//                 />
//               ))}
//             </div>
//           </ScrollShadow>
//         </div>
//         {/* <div className="min-h-80">
//           <div className="relative flex flex-col gap-2">
//             <Input
//               placeholder="Search for users"
//               value={searchQuery}
//               onChange={(e) => {
//                 if (!openUsersList) {
//                   setOpenUsersList(true);
//                 }
//                 setSearchQuery(e.target.value);
//               }}
//               startContent={<MagnifyingGlass size={20} />}
//               endContent={
//                 <motion.div
//                   initial={{
//                     rotate: 0
//                   }}
//                   animate={{
//                     rotate: openUsersList ? 180 : 0
//                   }}
//                   className="text-default-400"
//                 >
//                   <ChevronBottom size={14} />
//                 </motion.div>
//               }
//               onFocus={() => setOpenUsersList(true)}
//             />

//             <div
//               className={cn({
//                 'absolute top-14 w-full': openUsersList,
//                 hidden: !openUsersList
//               })}
//             >
//               <ScrollShadow className="max-h-80">
//                 <Listbox
//                   ref={outsideRef}
//                   className={cn({
//                     'flex flex-col gap-2 rounded-xl bg-default-100 transition-all duration-300 ease-in-out':
//                       openUsersList,
//                     hidden: !openUsersList
//                   })}
//                 >
//                   {users
//                     ?.filter(
//                       (user) => !selectedUsers?.some((selectedUser) => selectedUser.id === user.id)
//                     )
//                     ?.map((user) => (
//                       <ListboxItem key={user.id} onPress={() => handleAddUser(user.id)}>
//                         <User
//                           name={user.profile?.display_name || 'No display name'}
//                           description={user.email}
//                           avatarProps={{
//                             src: user.profile?.profile_picture || undefined,
//                             alt: user.profile?.display_name,
//                             size: 'md',
//                             showFallback: true,
//                             classNames: {
//                               base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
//                             },
//                             fallback: (
//                               <UserFallback
//                                 firstName={user.profile.first_name}
//                                 lastName={user.profile?.last_name}
//                                 displayName={user.profile?.display_name}
//                                 email={user.email}
//                                 color={user.profile?.color}
//                               />
//                             )
//                           }}
//                           classNames={{
//                             name: 'cursor-pointer'
//                           }}
//                         />
//                       </ListboxItem>
//                     ))}
//                 </Listbox>
//                 <div ref={ref} />
//               </ScrollShadow>
//             </div>

//             <ScrollShadow className="flex h-60 flex-col" size={80} offset={2}>
//               <div
//                 className={cn({
//                   'flex max-h-72 flex-col py-2': !openUsersList,
//                   hidden: openUsersList
//                 })}
//               >
//                 {selectedUsers.map((user) => (
//                   <div className="flex items-center justify-between p-2" key={user.id}>
//                     <User
//                       name={user.profile.display_name}
//                       description={user.email}
//                       avatarProps={{
//                         src: user.profile.profile_picture as string,
//                         showFallback: true,
//                         classNames: {
//                           base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0])
//                         },
//                         fallback: (
//                           <UserFallback
//                             firstName={user.profile.first_name}
//                             lastName={user.profile?.last_name}
//                             displayName={user.profile?.display_name}
//                             email={user.email}
//                             color={user.profile?.color}
//                           />
//                         )
//                       }}
//                     />
//                     <Button isIconOnly onPress={() => handleRemoveUser(user.id)} variant="light">
//                       <CrossLarge size={20} />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </ScrollShadow>
//           </div>
//         </div> */}
//       </ModalBody>

//       <ModalFooter>
//         <div className="flex w-full items-center justify-between">
//           <p className="text-sm font-medium text-default-400">Step 2 of 2</p>
//           <Button
//             color="primary"
//             type="submit"
//             isLoading={isPending}
//             aria-label="Create security group"
//             startContent={<Check size={20} />}
//           >
//             Create Security Group
//           </Button>
//         </div>
//       </ModalFooter>
//     </form>
//   );
// };

// export default AddMembersToSecurityGroupCreation;

// const UserListItem = ({
//   user,
//   handleRemoveUser,
// }: {
//   user: UserWithRoles;
//   handleRemoveUser: (userId: string) => void;
// }) => {
//   return (
//     <div className="flex items-center justify-between p-2" key={user.id}>
//       <User
//         name={user.profile.display_name}
//         description={user.email}
//         avatarProps={{
//           src: user.profile.profile_picture as string,
//           showFallback: true,
//           classNames: {
//             base: cn(PROFILE_COMBINATIONS[user?.profile?.color || 0]),
//           },
//           fallback: (
//             <UserFallback
//               firstName={user.profile.first_name}
//               lastName={user.profile?.last_name}
//               displayName={user.profile?.display_name}
//               email={user.email}
//               color={user.profile?.color}
//             />
//           ),
//         }}
//       />
//       <Button
//         isIconOnly
//         onPress={() => handleRemoveUser(user.id)}
//         variant="light"
//         aria-label="Remove user"
//       >
//         <CrossLarge size={20} />
//       </Button>
//     </div>
//   );
// };
