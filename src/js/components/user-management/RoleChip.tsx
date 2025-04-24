// import { ChipProps, cn, SlotsToClasses } from "@nextui-org/react";

// import { Chip } from "@/components/ui/Chip";

// import { COLORS_TO_TAILWIND, COMBINATIONS_KEY } from "@/data/colors";

// export const RoleChip = ({
//   label,
//   color,
//   chipProps,
//   classNames,
//   size,
// }: {
//   label: string;
//   color?: COMBINATIONS_KEY;
//   classNames?: SlotsToClasses<
//     "base" | "content" | "dot" | "avatar" | "closeButton"
//   >;
//   chipProps?: ChipProps;
//   size?: "sm" | "md" | "lg";
// }) => {
//   return (
//     <Chip
//       title={label}
//       aria-label={label}
//       size={size ?? "md"}
//       classNames={{
//         base: cn(
//           "select-none rounded-2xl p-2 text-sm h-8",
//           COLORS_TO_TAILWIND[`${color}-subtle`],
//           classNames?.base
//         ),
//         content: cn(
//           "font-bold truncate max-w-40 p-0",
//           size === "sm" ? "text-xs" : "text-sm",
//           classNames?.content
//         ),
//         dot: classNames?.dot,
//         avatar: classNames?.avatar,
//         closeButton: classNames?.closeButton,
//       }}
//       {...chipProps}
//     >
//       {label}
//     </Chip>
//   );
// };
