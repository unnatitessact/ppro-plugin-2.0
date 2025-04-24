// 'use client';

// import { usePathname, useRouter } from 'next/navigation';

// import { cn } from '@nextui-org/react';

// import { Listbox, ListboxItem } from '@/components/ui/Listbox';

// import { TeamIcon } from '@/components/user-management/TeamIcon';

// import { WorkspaceWithTeamsListItem } from '@/types/user-management';

// interface TeamsListProps {
//   workspace: WorkspaceWithTeamsListItem;
// }

// export const TeamsList = ({ workspace }: TeamsListProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const teams = workspace.teams;

//   const handlePress = (teamId: string, workspaceId: string) => {
//     router.push(`/admin/workspaces/${workspaceId}/teams/${teamId}`);
//   };

//   return (
//     <Listbox
//       key={workspace.id}
//       aria-label="Teams list"
//       classNames={{
//         list: 'gap-4 pl-[72px] py-2'
//       }}
//       itemClasses={{
//         base: 'p-0 pl-2 py-2 flex bg-white dark:bg-black data-[hover=true]:bg-white dark:data-[hover=true]:bg-black items-stretch',
//         title: 'overflow-y-visible flex',
//         wrapper: 'flex items-center gap-3'
//       }}
//       emptyContent={null}
//     >
//       {teams?.map((team) => {
//         return (
//           <ListboxItem
//             textValue={team.title}
//             aria-label={team.title}
//             key={team.id}
//             className={cn({
//               'bg-default-200': pathname === `/admin/workspaces/${workspace.id}/teams/${team.id}`
//             })}
//             onPointerDown={() => handlePress(team.id, workspace?.id)}
//             startContent={
//               <TeamIcon size="sm" name={team.title} color={team.color} colorVariant="subtle" />
//             }
//           >
//             <p className="line-clamp-1 w-full whitespace-normal text-base font-medium normal-case text-default-900">
//               {team.title}
//             </p>

//             <div className="absolute -left-4 bottom-1/2 -z-10 h-16  w-6 rounded-bl-lg border border-transparent border-b-default-300 border-l-default-300" />
//           </ListboxItem>
//         );
//       })}
//     </Listbox>
//   );
// };
