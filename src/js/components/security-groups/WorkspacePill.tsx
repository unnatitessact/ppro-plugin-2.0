// import React from "react";

// import { cn } from "@nextui-org/react";

// import WorkspaceIcon from "../../components/user-management/WorkspaceIcon";

// interface WorkspacePillProps {
//   title: string;
//   image?: string;
//   color?: string;
//   classNames?: {
//     base?: string;
//     text?: string;
//   };
//   className?: string;
// }

// const WorkspacePill = ({
//   title,
//   image,
//   color,
//   classNames,
//   className,
// }: WorkspacePillProps) => {
//   return (
//     <div
//       className={cn(
//         "flex items-center gap-2 rounded-xl bg-default-200 px-3 py-2",
//         classNames?.base,
//         className
//       )}
//     >
//       <WorkspaceIcon size="sm" image={image} title={title} color={color} />
//       <p className={cn("text-xs font-medium", classNames?.text)}>{title}</p>
//     </div>
//   );
// };

// export default WorkspacePill;
