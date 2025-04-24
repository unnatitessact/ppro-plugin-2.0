// import React, { useEffect, useState } from "react";

// // import { useParams } from "next/navigation";

// import { cn } from "@nextui-org/react";
// import { AnimatePresence, motion } from "framer-motion";

// import { ChevronRightSmall } from "@tessact/icons";

// import { Link } from '@/components/ui/NextLink';

// import TeamNode from '@/components/user-management/sidebar/TeamNode';
// import WorkspaceIcon from '@/components/user-management/WorkspaceIcon';

// import { WorkspaceWithTeamsListItem } from '@/types/user-management';

// interface WorkspaceNodeProps {
//   workspace: WorkspaceWithTeamsListItem;
//   maxWidth: number;
// }

// const WorkspaceNode = ({ workspace, maxWidth }: WorkspaceNodeProps) => {
//   const { workspaceId, teamId } = useParams() as { workspaceId: string; teamId: string };
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   const isActive = workspaceId === workspace.id && teamId === undefined;

//   useEffect(() => {
//     if (isActive && workspace.teams.length > 0) {
//       setIsExpanded(true);
//     }
//   }, [isActive, workspace.teams]);

//   return (
//     <div className="flex flex-col">
//       <div className="flex select-none items-center text-ds-text-secondary">
//         <div className="flex size-4 flex-shrink-0">
//           {workspace.teams.length > 0 && (
//             <ChevronRightSmall
//               size={16}
//               className={cn('cursor-pointer transition', isExpanded && 'rotate-90')}
//               onPointerDown={() => setIsExpanded((prevExpanded) => !prevExpanded)}
//             />
//           )}
//         </div>
//         <Link href={`/admin/workspaces/${workspace.id}`} className="w-full">
//           <motion.div
//             className={cn('relative flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-2')}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <span className="size-5 flex-shrink-0">
//               <WorkspaceIcon
//                 title={workspace.title}
//                 color={workspace.color}
//                 size="sm"
//                 image={workspace.display_image}
//                 rounded="lg"
//               />
//             </span>
//             <p
//               className={cn(
//                 'overflow-hidden truncate text-sm transition-colors',
//                 (isExpanded || isActive) && 'text-ds-text-primary'
//               )}
//               style={{ maxWidth: maxWidth || '100%' }}
//             >
//               {workspace.title}
//             </p>
//             {isHovered && (
//               <motion.div
//                 layout
//                 transition={{ duration: 0.2 }}
//                 layoutId="tree-hover-indicator"
//                 className="absolute inset-0 -z-20 h-9 w-full rounded-xl bg-ds-link-bg-hover"
//               ></motion.div>
//             )}
//             {isActive && (
//               <motion.div
//                 layout
//                 transition={{ duration: 0.2 }}
//                 layoutId="tree-active-indicator"
//                 className="absolute inset-0 -z-10 h-9 w-full rounded-xl bg-ds-link-bg-selected"
//               ></motion.div>
//             )}
//           </motion.div>
//         </Link>
//       </div>
//       <div>
//         <AnimatePresence>
//           {isExpanded ? (
//             <motion.div
//               initial={{ height: 0 }}
//               animate={{ height: 'auto', overflow: 'hidden' }}
//               transition={{ mass: 1, stiffness: 320, damping: 40, type: 'spring' }}
//               exit={{ height: 0 }}
//               key={'team-container'}
//               className="relative flex flex-col"
//             >
//               <div
//                 style={{ height: `${workspace.teams.length * 36 - 26}px` }}
//                 className="absolute left-2 top-0 -z-10 w-px  border-0 border-l border-ds-link-tree-lines"
//               />

//               {workspace.teams.map((team) => (
//                 <TeamNode key={team.id} team={team} maxWidth={maxWidth} parentId={workspace.id} />
//               ))}
//             </motion.div>
//           ) : null}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default WorkspaceNode;
