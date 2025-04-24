import { cn } from "@nextui-org/react";

import { COLORS_TO_TAILWIND } from "@/constants/data-colors/data-colors";

// import { COMBINATIONS } from '@/data/colors';

interface TeamIconProps {
  name: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  color?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
  colorVariant?: "solid" | "subtle";
}

export const TeamIcon = ({
  name,
  size = "sm",
  color,
  rounded,
  colorVariant = "solid",
}: TeamIconProps) => {
  const colorClasses = cn(
    !color && "bg-primary-500 text-white border-none",
    COLORS_TO_TAILWIND[`${color}-${colorVariant}`],
    colorVariant === "subtle" &&
      `border border-ds-combination-${color}-subtle-border`
  );

  const sizeClasses = cn({
    "h-5 w-5 text-sm": size === "sm",
    "h-6 w-6 text-base": size === "md",
    "h-8 w-8 text-lg": size === "lg",
    "h-10 w-10 text-xl": size === "xl",
    "h-12 w-12 text-xl": size === "2xl",
    "h-14 w-14 text-xl": size === "3xl",
  });

  const roundedClasses = cn({
    "rounded-sm": rounded === "sm",
    "rounded-md": rounded === "md",
    "rounded-lg": rounded === "lg",
    "rounded-xl": rounded === "xl",
    "rounded-2xl": rounded === "2xl",
  });

  return (
    <div
      className={cn(
        `flex items-center justify-center rounded-md`,
        sizeClasses,
        roundedClasses,
        colorClasses
      )}
    >
      <span className="font-bold uppercase">{name[0]}</span>
    </div>
  );
};
