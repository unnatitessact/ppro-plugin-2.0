import { cn, Spinner } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

interface FetchingNextPageIndicatorProps {
  isFetching: boolean;
  customText?: string;
}

// export const FetchingNextPageIndicator = ({
//   isFetching,
//   customText
// }: FetchingNextPageIndicatorProps) => {
//   return (
//     <div
//       className={cn(
//         'pointer-events-none absolute bottom-0 z-[100] flex h-20  w-full items-center justify-center gap-3 bg-gradient-to-b from-transparent to-background-50 transition',
//         isFetching ? 'opacity-100' : 'opacity-0'
//       )}
//     >
//       <Spinner size="sm" />
//       <span className="pb-2">{customText ?? 'Fetching more files and folders...'}</span>
//     </div>
//   );
// };

export const FetchingNextPageIndicator = ({
  isFetching,
  customText,
}: FetchingNextPageIndicatorProps) => {
  return (
    <AnimatePresence>
      {isFetching && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn(
            "pointer-events-none absolute bottom-0 z-[100] flex h-20 w-full items-center justify-center"
          )}
        >
          <div className="noise flex items-center justify-center gap-1 rounded-full border border-ds-menu-border bg-ds-menu-bg px-1 py-0 pr-3 shadow-2xl">
            <Spinner
              classNames={{
                circle1: "border-b-ds-text-secondary",
                circle2: "border-b-ds-text-secondary",
              }}
              className="opacity-75 scale-50"
            />
            <span className="text-sm text-ds-text-secondary">
              {customText ?? "Fetching more files and folders..."}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
