// import { useEffect, useState } from "react";

// import { cn } from "@nextui-org/react";

// import { ChevronDownSmall } from "@tessact/icons";

// import { Button } from "../../components/ui/Button";
// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownSection,
//   DropdownTrigger,
// } from "../../components/ui/Dropdown";

// import { TaggingStatusIcon } from "../../components/";

// import { useUpdateTaggingStatus } from "../../api-integration/mutations/tagging";
// import { TaggingStatus } from "../../api-integration/types/library";

// interface TaggingStatusDropdownProps {
//   status: TaggingStatus;
//   assetId: string;
//   variant?: "default" | "compact" | "pill";
// }

// const getLabelFromStatus = (status: TaggingStatus) => {
//   switch (status) {
//     case "not_yet_ready":
//       return "Not started";
//     case "ready_for_tagging":
//       return "Ready for tagging";
//     case "in_progress":
//       return "In progress";
//     case "completed":
//       return "Completed";
//     case "cancelled":
//       return "Cancelled";
//   }
// };

// export const TaggingStatusDropdown = ({
//   status,
//   assetId,
//   variant = "default",
// }: TaggingStatusDropdownProps) => {
//   const [currentStatus, setCurrentStatus] = useState<TaggingStatus>(status);

//   useEffect(() => {
//     setCurrentStatus(status);
//   }, [status]);

//   const { mutate } = useUpdateTaggingStatus(assetId);

//   return (
//     <Dropdown placement="bottom-start">
//       <DropdownTrigger>
//         {variant === "default" ? (
//           <Button
//             color="secondary"
//             startContent={<TaggingStatusIcon status={currentStatus} />}
//             endContent={<ChevronDownSmall className="h-4 w-4" />}
//             aria-label="Tagging status dropdown"
//           >
//             {getLabelFromStatus(currentStatus)}
//           </Button>
//         ) : (
//           <div
//             className={cn(
//               "bg-ds-asset-card-card-bg text-sm text-ds-text-secondary",
//               "rounded-full p-2",
//               "border border-black/[3%] dark:border-white/5",
//               "flex items-center gap-1",
//               "transition hover:bg-ds-asset-card-bg-hover",
//               "cursor-pointer"
//             )}
//             onClick={(e) => {
//               e.stopPropagation();
//               e.preventDefault();
//             }}
//           >
//             <TaggingStatusIcon status={currentStatus} />
//             {variant === "pill" && (
//               <span className="text-md">
//                 {getLabelFromStatus(currentStatus)}
//               </span>
//             )}
//           </div>
//         )}
//       </DropdownTrigger>
//       <DropdownMenu
//         onAction={(key) => {
//           if (key === currentStatus) return;

//           mutate(key as TaggingStatus, {
//             onError: () => {
//               setCurrentStatus(status);
//             },
//           });
//           setCurrentStatus(key as TaggingStatus);
//         }}
//       >
//         <DropdownSection title="Tagging Status">
//           <DropdownItem
//             key="not_yet_ready"
//             startContent={<TaggingStatusIcon status="not_yet_ready" />}
//           >
//             Not started
//           </DropdownItem>
//           <DropdownItem
//             key="ready_for_tagging"
//             startContent={<TaggingStatusIcon status="ready_for_tagging" />}
//           >
//             Ready for tagging
//           </DropdownItem>
//           <DropdownItem
//             key="in_progress"
//             startContent={<TaggingStatusIcon status="in_progress" />}
//           >
//             In progress
//           </DropdownItem>
//           <DropdownItem
//             key="completed"
//             startContent={<TaggingStatusIcon status="completed" />}
//           >
//             Completed
//           </DropdownItem>
//           <DropdownItem
//             key="cancelled"
//             startContent={<TaggingStatusIcon status="cancelled" />}
//           >
//             Cancelled
//           </DropdownItem>
//         </DropdownSection>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };
