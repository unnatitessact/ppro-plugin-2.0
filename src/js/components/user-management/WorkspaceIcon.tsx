import React from "react";

// import Image from 'next/image';

import { cn } from "@nextui-org/react";

import { TeamIcon } from "./TeamIcon";

interface WorkspaceIconProps {
  image?: string;
  title: string;
  /** sm: 20px, md: 24px, lg: 32px, xl: 40px, 2xl: 48px */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
}

const WorkspaceIcon = ({
  image,
  title,
  size = "md",
  rounded = "md",
  color,
}: WorkspaceIconProps) => {
  const dimensions = (() => {
    switch (size) {
      case "sm":
        return 20;
      case "md":
        return 24;
      case "lg":
        return 32;
      case "xl":
        return 40;
      case "2xl":
        return 48;
      case "3xl":
        return 56;
      default:
        return size;
    }
  })();

  const roundedClasses = cn({
    "rounded-sm": rounded === "sm",
    "rounded-md": rounded === "md",
    "rounded-lg": rounded === "lg",
    "rounded-xl": rounded === "xl",
    "rounded-2xl": rounded === "2xl",
  });

  if (image) {
    return (
      <img
        // quality={100}
        src={image}
        alt="Workspace Image"
        height={dimensions}
        width={dimensions}
        className={roundedClasses}
      />
    );
  }
  return (
    <TeamIcon
      name={title}
      size={size}
      rounded={rounded}
      color={color ?? undefined}
      colorVariant="solid"
    />
  );
};

export default WorkspaceIcon;
