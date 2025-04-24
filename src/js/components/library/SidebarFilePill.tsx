import { useState } from "react";

// import { useParams } from 'next/navigation';

import { cn, Link } from "@nextui-org/react";
import { motion } from "framer-motion";

import { FileBendFilled } from "@tessact/icons";

// import { Link } from '@/components/ui/NextLink';

import { useParamsStateStore } from "../../stores/params-state-store";

interface SidebarFilePillProps {
  href: string;
  name: string;
  maxWidth?: number;
  fileId: string;
}

export const SidebarFilePill = ({
  href,
  name,
  maxWidth,
  fileId,
}: SidebarFilePillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedAssetId } = useParamsStateStore();
  const isActive = selectedAssetId === fileId;
  return (
    <Link href={href} className="w-full">
      <motion.div
        className={cn(
          "relative flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-2"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex-shrink-0">
          <FileBendFilled size={20} className="text-ds-text-secondary" />
        </span>
        <p
          className={cn("overflow-hidden truncate text-sm")}
          style={{ maxWidth: maxWidth || "100%" }}
        >
          {name}
        </p>
        {isHovered && (
          <motion.div
            layout
            transition={{ duration: 0.2 }}
            layoutId="tree-hover-indicator"
            className="absolute inset-0 -z-20 h-9 w-full rounded-xl bg-ds-link-bg-hover"
          ></motion.div>
        )}
        {isActive && (
          <motion.div
            layout
            transition={{ duration: 0.2 }}
            layoutId="tree-active-indicator"
            className="absolute inset-0 -z-10 h-9 w-full rounded-xl bg-ds-link-bg-selected"
          ></motion.div>
        )}
      </motion.div>
    </Link>
  );
};
