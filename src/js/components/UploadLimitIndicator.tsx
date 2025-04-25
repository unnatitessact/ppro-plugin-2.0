import { Progress } from "@nextui-org/react";
import { motion } from "framer-motion";
import prettyBytes from "pretty-bytes";

import { useUsageLimit } from "@/api-integration/queries/globals";

export const UploadLimitIndicator = () => {
  const { isLoading, isError, data } = useUsageLimit();

  if (isLoading || isError || !data) {
    return null;
  }

  const usedPercentage = (data.storage_used / data.storage_limit) * 100;

  const moreThanSeventyFivePercentUsed = usedPercentage > 75;
  const moreThanNinetyPercentUsed = usedPercentage > 90;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mt-2 flex flex-col gap-4 rounded-xl border border-ds-menu-border bg-ds-menu-bg p-3"
    >
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Free plan usage</h3>
        <p className="text-xs text-ds-text-secondary">
          The free plan limits the amount of files you can upload.
        </p>
      </div>
      <div className="space-y-2">
        <Progress
          value={usedPercentage}
          color={
            moreThanNinetyPercentUsed
              ? "danger"
              : moreThanSeventyFivePercentUsed
              ? "warning"
              : "success"
          }
          aria-label="Upload limit"
          size="sm"
        />
        <p className="text-xs text-ds-text-secondary">
          {prettyBytes(data.storage_used * 1000 * 1000)} /{" "}
          {prettyBytes(data.storage_limit * 1000 * 1000)} this month
        </p>
      </div>
    </motion.div>
  );
};
