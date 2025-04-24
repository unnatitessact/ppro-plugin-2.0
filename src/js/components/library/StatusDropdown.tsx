import { useEffect, useState } from "react";

// import { useParams } from 'next/navigation';

import { cn } from "@nextui-org/react";

import { ChevronDownSmall } from "@tessact/icons";

import { Button } from "../../components/ui/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../components/ui/Dropdown";

import { StatusIcon } from "../../components/StatusIcon";

import { useActionsToasts } from "../../hooks/useActionsToasts";

import { useUpdateFileStatus } from "../../api-integration/mutations/library";
import { FileStatus } from "../../api-integration/types/library";

import { getLabelFromFileStatus } from "../../utils/status";
import { useParamsStateStore } from "../../stores/params-state-store";

interface StatusDropdownProps {
  status: FileStatus;
  assetId: string;
  variant?: "default" | "compact" | "pill";
}

export const StatusDropdown = ({
  status,
  assetId,
  variant = "default",
}: StatusDropdownProps) => {
  const [currentStatus, setCurrentStatus] = useState<FileStatus>(status);
  // const { folderId } = useParams() as { folderId: string };
  const { selectedAssetId, folderId } = useParamsStateStore();

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const { mutate } = useUpdateFileStatus(assetId);

  const { showToast } = useActionsToasts();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        {variant === "default" ? (
          <Button
            color="secondary"
            startContent={<StatusIcon status={currentStatus} />}
            endContent={<ChevronDownSmall className="h-4 w-4" />}
            aria-label="Library status dropdown"
          >
            {getLabelFromFileStatus(currentStatus)}
          </Button>
        ) : (
          <div
            className={cn(
              "bg-ds-asset-card-card-bg text-sm text-ds-text-secondary",
              "rounded-full p-2",
              "border border-black/[3%] dark:border-white/5",
              "flex items-center gap-1",
              "transition hover:bg-ds-asset-card-bg-hover",
              "cursor-pointer"
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <StatusIcon status={currentStatus} />
            {variant === "pill" && (
              <span className="text-md">
                {getLabelFromFileStatus(currentStatus)}
              </span>
            )}
          </div>
        )}
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          if (key === currentStatus) return;

          mutate(key as FileStatus, {
            onError: () => {
              setCurrentStatus(status);
            },
            onSuccess: () => {
              showToast("on_file_status_change", folderId);
            },
          });
          setCurrentStatus(key as FileStatus);
        }}
      >
        <DropdownItem
          key="not_started"
          startContent={<StatusIcon status="not_started" />}
        >
          Not started
        </DropdownItem>
        <DropdownItem
          key="needs_edit"
          startContent={<StatusIcon status="needs_edit" />}
        >
          Needs edit
        </DropdownItem>
        {/* <DropdownItem key="processed" startContent={<StatusIcon status="processed" />}>
          Processed
        </DropdownItem> */}
        <DropdownItem
          key="in_progress"
          startContent={<StatusIcon status="in_progress" />}
        >
          In progress
        </DropdownItem>
        <DropdownItem
          key="approved"
          startContent={<StatusIcon status="approved" />}
        >
          Approved
        </DropdownItem>
        <DropdownItem
          key="rejected"
          startContent={<StatusIcon status="rejected" />}
        >
          Rejected
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
