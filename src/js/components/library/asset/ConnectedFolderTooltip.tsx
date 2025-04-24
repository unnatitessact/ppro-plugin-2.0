import { FolderLinkFilled } from "@tessact/icons";

import { Button } from "../../ui/Button";
import { Tooltip } from "../../ui/Tooltip";

export const ConnectedFolderTooltip = () => (
  <Tooltip
    showArrow
    className="p-3"
    placement="bottom"
    content={
      <div className="flex w-full flex-col text-sm">
        <div className="text-ds-tooltip-text">Connected folder</div>
        <div className="text-ds-text-secondary">
          All files in this folder are
          <br /> two way synced
        </div>
      </div>
    }
  >
    <Button
      isIconOnly
      variant="light"
      className="flex-shrink-0 text-ds-text-secondary"
      aria-label="Connected folder"
    >
      <FolderLinkFilled size={16} />
    </Button>
  </Tooltip>
);
