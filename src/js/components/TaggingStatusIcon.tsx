import type { TaggingStatus } from "@/api-integration/types/library";

import {
  TriangleCheckedIcon,
  TriangleDottedIcon,
  TriangleHalfFilledIcon,
} from "@tessact/tessact-icons";

import { CircleX } from "@tessact/icons";

interface TaggingStatusIconProps {
  status: TaggingStatus;
  size?: number;
}

export const TaggingStatusIcon = ({
  status,
  size = 20,
}: TaggingStatusIconProps) => {
  const statusMap = {
    not_yet_ready: (
      <TriangleDottedIcon
        className="text-ds-text-secondary"
        height={size}
        width={size}
      />
    ),
    ready_for_tagging: (
      <TriangleDottedIcon
        className="text-ds-combination-amber-subtle-text"
        height={size}
        width={size}
      />
    ),
    in_progress: (
      <TriangleHalfFilledIcon
        className="text-ds-combination-amber-subtle-text"
        height={size}
        width={size}
      />
    ),
    completed: (
      <TriangleCheckedIcon
        className="text-ds-combination-green-subtle-text"
        height={size}
        width={size}
      />
    ),
    cancelled: (
      <CircleX
        className="text-ds-combination-red-subtle-text"
        height={size}
        width={size}
      />
    ),
  };

  return statusMap[status] || null;
};
