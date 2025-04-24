import type { FileStatus } from "../api-integration/types/library";

import {
  CircleOneThirdIcon,
  CircleStatusCompletedIcon,
  CircleStatusDottedIcon,
  CircleStatusInactiveIcon,
  CircleStatusRejectedIcon,
  CircleTwoThirdIcon,
} from "@tessact/tessact-icons";

interface StatusIconProps {
  status: FileStatus;
  size?: number;
}

export const StatusIcon = ({ status, size = 20 }: StatusIconProps) => {
  const statusMap = {
    inactive: (
      <CircleStatusInactiveIcon
        className="text-ds-text-secondary"
        height={size}
        width={size}
      />
    ),
    not_started: (
      <CircleStatusDottedIcon
        className="text-ds-text-secondary"
        height={size}
        width={size}
      />
    ),
    waiting: (
      <CircleStatusDottedIcon
        className="text-ds-combination-pink-subtle-text"
        height={size}
        width={size}
      />
    ),
    needs_edit: (
      <CircleStatusDottedIcon
        className="text-ds-combination-amber-subtle-text"
        height={size}
        width={size}
      />
    ),
    processed: (
      <CircleOneThirdIcon
        className="text-ds-combination-purple-subtle-text"
        height={size}
        width={size}
      />
    ),
    in_progress: (
      <CircleTwoThirdIcon
        className="text-ds-combination-amber-subtle-text"
        height={size}
        width={size}
      />
    ),
    approved: (
      <CircleStatusCompletedIcon
        className="text-ds-combination-green-subtle-text"
        height={size}
        width={size}
      />
    ),
    rejected: (
      <CircleStatusRejectedIcon
        className="text-ds-combination-red-subtle-text"
        height={size}
        width={size}
      />
    ),
  };

  return statusMap[status] || null;
};
