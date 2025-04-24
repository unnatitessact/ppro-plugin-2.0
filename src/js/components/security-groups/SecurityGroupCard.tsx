// 'use client';

// import type { Key } from 'react';

// import { useRouter } from 'next/navigation';

// import { usePermissions } from '@/context/permissions';
// import { cn, Divider, useDisclosure } from '@nextui-org/react';
// import { Briefcase } from 'lucide-react';

// import { DotGrid1X3Horizontal, Group3 } from '@tessact/icons';

// import { Avatar } from '@/components/ui/Avatar';
// import { Button } from '@/components/ui/Button';
// import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
// import ConfirmationModal from '@/components/ui/modal/ConfirmationModal';

// import { EditSecurityGroupModal } from '@/components/security-groups/modals/EditSecurityGroupModal';

// import { useOrganization } from '@/hooks/useOrganization';

// import { useDeleteSecurityGroup } from '@/api-integration/mutations/security-group';
// import { useWorkspacesQuery } from '@/api-integration/queries/user-management';
// import { User } from '@/api-integration/types/auth';

// import { checkPermission, PERMISSIONS } from '@/utils/accessUtils';

// interface SecurityGroupCardProps {
//   id: string;
//   name: string;
//   description?: string;
//   users: User[];
//   isOrganizationGroup?: boolean;
// }

// export const SecurityGroupCard = ({
//   id,
//   name,
//   description,
//   users,
//   isOrganizationGroup
// }: SecurityGroupCardProps) => {
//   const router = useRouter();
//   const organization = useOrganization();
//   const { organizationPermissions } = usePermissions();
//   const { data: workspaces } = useWorkspacesQuery(organization?.id, '', Infinity);

//   const {
//     isOpen: isEditModalOpen,
//     onOpen: openEditModal,
//     onClose: closeEditModal
//   } = useDisclosure();

//   const {
//     isOpen: isDeleteModalOpen,
//     onOpen: openDeleteModal,
//     onClose: closeDeleteModal
//   } = useDisclosure();

//   const onDropdownAction = (key: Key) => {
//     if (key === 'edit') {
//       openEditModal();
//     }
//     if (key === 'delete') {
//       openDeleteModal();
//     }
//   };

//   const { mutateAsync, isPending } = useDeleteSecurityGroup(id, organization.id);

//   return (
//     <>
//       <div
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           router.push(`/admin/security-groups/${id}`);
//         }}
//         className="group/card cursor-pointer space-y-4 rounded-xl bg-background-200 p-6 transition hover:bg-background-300"
//       >
//         <header className="space-y-1">
//           <div className="flex items-center justify-between gap-2">
//             <h2 className="truncate text-xl font-medium">{name}</h2>
//             {checkPermission(
//               PERMISSIONS.ORGANIZATION.CAN_CREATE_EDIT_DELETE_SECURITY_GROUPS,
//               organizationPermissions || []
//             ) &&
//               !isOrganizationGroup && (
//                 <Dropdown placement="bottom-end">
//                   <DropdownTrigger>
//                     <Button
//                       isIconOnly
//                       size="md"
//                       variant="light"
//                       aria-label="security-group-dropdown"
//                     >
//                       <DotGrid1X3Horizontal size={20} />
//                     </Button>
//                   </DropdownTrigger>
//                   <DropdownMenu onAction={onDropdownAction}>
//                     <DropdownItem key="edit">Edit name and description</DropdownItem>
//                     <DropdownItem key="delete" color="danger" className="text-danger">
//                       Delete permanently
//                     </DropdownItem>
//                   </DropdownMenu>
//                 </Dropdown>
//               )}
//           </div>
//           <p className="line-clamp-2 text-sm text-ds-text-secondary">{description}</p>
//         </header>
//         <div className="flex items-center gap-4 text-sm text-ds-text-secondary">
//           <div className="flex items-center gap-2">
//             <Group3 size={16} />
//             <p>{isOrganizationGroup ? 'All' : users.length} users</p>
//           </div>
//           <Divider orientation="vertical" className="h-4 bg-divider" />
//           {workspaces && workspaces?.length > 0 && (
//             <div className="flex items-center gap-2">
//               <Briefcase size={16} />
//               <p>{workspaces?.length} workspaces</p>
//             </div>
//           )}
//         </div>
//         {isOrganizationGroup ? (
//           <div className="rounded-full bg-background-100 py-2 text-center text-ds-text-secondary">
//             Auto adds all users
//           </div>
//         ) : (
//           <div className="flex w-full pl-[15px]">
//             {users.slice(0, 5).map((user, i) => (
//               <Avatar
//                 key={i}
//                 name={user.profile.display_name}
//                 src={user.profile.profile_picture || undefined}
//                 radius="full"
//                 color="primary"
//                 classNames={{
//                   base: cn(
//                     `bg-primary-300 ring-0 ring-offset-0 border-1.5 border-background-200 group-hover/card:border-background-300 transition z-${i + 1} -ml-[15px]`
//                   )
//                 }}
//               />
//             ))}
//             {users.length > 5 && (
//               <Avatar
//                 name={users.length > 5 ? `+${users.length - 5}` : ''}
//                 src={undefined}
//                 radius="full"
//                 color="primary"
//                 classNames={{
//                   base: cn(
//                     `bg-primary-300 ring-0 ring-offset-0 border-1.5 border-background-200 group-hover/card:border-background-300 transition z-${10} -ml-[15px]`
//                   )
//                 }}
//               />
//             )}
//           </div>
//         )}
//       </div>
//       <EditSecurityGroupModal
//         isOpen={isEditModalOpen}
//         closeModal={closeEditModal}
//         id={id}
//         name={name}
//         description={description || ''}
//       />
//       <ConfirmationModal
//         isOpen={isDeleteModalOpen}
//         onOpenChange={closeDeleteModal}
//         title={`Delete ${name}?`}
//         subtitle="To delete this item permanently re-enter the name of the security group"
//         confirmText="Yes, delete"
//         confirmAction={async () => {
//           await mutateAsync();
//         }}
//         confirmField={name}
//         isLoading={isPending}
//       />
//     </>
//   );
// };
