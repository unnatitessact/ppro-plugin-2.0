// "use client";

// import { useState } from "react";

// import { useElementSize } from "@mantine/hooks";
// import { cn } from "@nextui-org/react";
// import { AnimatePresence, motion } from "framer-motion";

// import { ChevronRightSmall, PlusSmall } from "@tessact/icons";

// import { Button } from "../../ui/Button";
// import { ScrollShadow } from "../../ui/ScrollShadow";

// import NewWorkspaceModal from "../../modals/new-workspace/NewWorkspaceModal";
// import WorkspaceNode from "./WorkspaceNode";

// import { useWorkspacesWithTeamsListQuery } from "../../api-integration/queries/user-management";

// import { useSearchActionsStore } from "../../stores/search-actions-store";

// const WorkspacesTree = () => {
//   const { isCreateWorkspaceOpen, onCreateWorkspaceOpenChange } =
//     useSearchActionsStore();
//   const { data: workspacesList, isLoading: isLoadingWorkspacesList } =
//     useWorkspacesWithTeamsListQuery();
//   const [isExpanded, setIsExpanded] = useState(true);
//   const { ref, width } = useElementSize();

//   // const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   return (
//     <>
//       <div className="flex min-h-0 flex-col gap-3" ref={ref}>
//         <div className="flex select-none items-center text-ds-text-secondary">
//           <div className="flex size-4 flex-shrink-0">
//             <ChevronRightSmall
//               size={16}
//               className={cn(
//                 "cursor-pointer text-ds-text-secondary transition",
//                 isExpanded && "rotate-90"
//               )}
//               onPointerDown={() =>
//                 setIsExpanded((prevExpanded) => !prevExpanded)
//               }
//             />
//           </div>
//           <div
//             className="relative flex w-full cursor-pointer flex-col rounded-xl p-1"
//             onPointerDown={() => setIsExpanded((prevExpanded) => !prevExpanded)}
//           >
//             <p className="max-w-full overflow-hidden truncate text-sm">
//               Workspaces
//             </p>
//           </div>
//           <Button
//             onPointerDown={onCreateWorkspaceOpenChange}
//             size="xs"
//             disableHover
//             isIconOnly
//             className="flex size-5 flex-shrink-0"
//             aria-label="Create workspace"
//           >
//             <PlusSmall size={20} className="text-ds-text-secondary" />
//           </Button>
//         </div>
//         <AnimatePresence>
//           <ScrollShadow>
//             {isExpanded ? (
//               isLoadingWorkspacesList ? (
//                 <></>
//               ) : (
//                 <motion.div
//                   style={{
//                     overflow: "hidden",
//                     minHeight: 0,
//                     display: "flex",
//                     paddingBottom: 16,
//                   }}
//                   initial={{ height: 0 }}
//                   animate={{ height: "auto", overflow: "hidden" }}
//                   transition={{
//                     mass: 1,
//                     stiffness: 320,
//                     damping: 40,
//                     type: "spring",
//                   }}
//                   exit={{ height: 0 }}
//                   key={"container"}
//                 >
//                   <div className="mr-1 min-h-0 w-full">
//                     {workspacesList?.map((workspace) => (
//                       <WorkspaceNode
//                         key={workspace.id}
//                         workspace={workspace}
//                         maxWidth={width - 70}
//                       />
//                     ))}
//                   </div>
//                 </motion.div>
//               )
//             ) : null}
//           </ScrollShadow>
//         </AnimatePresence>
//       </div>
//       <NewWorkspaceModal
//         isOpen={isCreateWorkspaceOpen}
//         onOpenChange={onCreateWorkspaceOpenChange}
//       />
//     </>
//   );
// };

// export default WorkspacesTree;
