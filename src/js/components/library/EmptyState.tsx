"use client";

import { motion } from "framer-motion";

// import { FishEmptyStateCard } from "../components/library/empty-state/FishEmptyStateCard";
import { FishEmptyStateCard } from "../empty-state/FishEmptyStateCard";

interface LibraryEmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const LibraryEmptyState = ({
  title,
  description,
  action,
}: LibraryEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full pb-5 pr-2"
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-[20px] border border-ds-menu-border">
        <FishEmptyStateCard
          title={title}
          description={description}
          action={action}
        />
      </div>
    </motion.div>
  );
};
