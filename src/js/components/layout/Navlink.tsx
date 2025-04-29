import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ReactNode } from "react";

import { useParamsStateStore } from "@/stores/params-state-store";

interface NavLinkProps {
  label: string;
  href?: string;
  icon?: ReactNode;
  secondary?: boolean;
  onClick?: () => void;
  layoutIdPrefix?: string;
  endContent?: ReactNode;
  target?: string;
  isLinkActive?: boolean;
}

export const NavLink = ({
  label,
  href,
  icon,
  secondary,
  onClick,
  layoutIdPrefix,
  endContent,
  isLinkActive,
}: NavLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isActive = false;

  // const isActive =
  //   (href &&
  //     (currentPage === href ||
  //       (href[href.length - 1] === "/" &&
  //         href?.slice(0, -1) === currentPage))) ||
  //   isLinkActive;

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        onClick={onClick}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2",
          "text-sm font-medium",
          secondary
            ? "text-ds-link-text-secondary hover:text-ds-link-text-primary"
            : "text-ds-link-text-primary",
          "delay-200 duration-200"
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {endContent}
      </a>
      {isHovered && (
        <motion.div
          layoutId="hover-indicator"
          className="absolute inset-0 -z-20 h-full w-full rounded-xl bg-ds-link-bg-hover"
        ></motion.div>
      )}
      {isActive && (
        <motion.div
          layoutId="select-indicator"
          className="absolute inset-0 -z-10 h-full w-full rounded-xl bg-ds-link-bg-selected"
        ></motion.div>
      )}
    </motion.div>
  );
};
