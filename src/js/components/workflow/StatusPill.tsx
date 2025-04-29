import {
  CircleOneThirdIcon,
  CircleStatusCompletedIcon,
  CircleStatusDottedIcon,
  CircleStatusInactiveIcon,
  CircleStatusRejectedIcon,
} from "@tessact/tessact-icons";
//   import { Handle, Position } from '@xyflow/react';

import { CircleInfo, StopCircle, Video } from "@tessact/icons";

import { cn } from "@nextui-org/react";

import {
  StatusConnector,
  WorkflowTemplateConnectionEdges,
} from "@/api-integration/types/workflow";

export const IncomingStatusPill = ({
  status,
  status_connectors,
  icon,
  nodeId,
}: {
  status?: string;
  status_connectors?: StatusConnector[];
  icon?: string;
  nodeId: string;
  handles?: WorkflowTemplateConnectionEdges[];
}) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[28px] bg-ds-white-board-status-bg p-2 pr-3">
      {status_connectors?.map((item, i) => {
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-[6px] rounded-2xl bg-ds-white-board-card-bg px-2 py-[6px]"
            )}
          >
            {/* <ConnectionPoint
              id={item.id}
              nodeId={nodeId}
              isConnectable={true}
              target="target"
              isConnectableStart={false}
            /> */}
            {item?.connector_type === "No-File" && (
              <StopCircle size={14} className="text-ds-text-secondary" />
            )}
            {item?.connector_type === "File" && (
              <Video size={14} className="text-ds-text-secondary" />
            )}
          </div>
        );
      })}
      <Status status={status ?? "Not Started"} icon={icon} />
    </div>
  );
};

export const OutgoingStatusPill = ({
  status,
  nodeId,
  status_connectors,
  icon,
}: {
  status?: string;
  nodeId: string;
  status_connectors?: StatusConnector[];
  icon?: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[28px] bg-ds-white-board-status-bg p-2">
      <Status status={status ?? "Not Started"} icon={icon} />
      {status_connectors?.map((item, i) => {
        return (
          <div
            key={i}
            className="flex items-center gap-[6px] rounded-2xl bg-ds-white-board-card-bg px-2 py-[6px]"
          >
            {item?.connector_type === "No-File" && (
              <StopCircle size={14} className="text-ds-text-secondary" />
            )}
            {item?.connector_type === "File" && (
              <Video size={14} className="text-ds-text-secondary" />
            )}
            {/* <ConnectionPoint
              id={item.id}
              nodeId={nodeId}
              isConnectable={true}
              target="source"
              isConnectableStart={true}
            /> */}
          </div>
        );
      })}
    </div>
  );
};

// export const ConnectionPoint = ({
//   id,
//   isConnectable,
//   target,
//   isConnectableStart,
//   nodeId,
// }: {
//   id: string;
//   nodeId?: string;
//   isConnectable: boolean;
//   target: "source" | "target";
//   isConnectableStart: boolean;
// }) => {
//   return (
//     <div
//       key={id}
//       id={nodeId}
//       className="relative h-[20px] w-[20px] rounded-full border border-default-300 bg-default-50"
//     >
//       <Handle
//         id={id}
//         type={target}
//         position={Position.Top}
//         isConnectable={isConnectable}
//         isConnectableStart={isConnectableStart}
//         // isValidConnection={(connection) => {
//         //   console.log('connection', connection);
//         //   return true;
//         // }}
//         // onConnect={(params) => console.log('handle onConnect', params)}
//       />
//     </div>
//   );
// };

export const Status = ({ status, icon }: { status: string; icon?: string }) => {
  return (
    <div className="flex items-center gap-1">
      <StepStatusIcons icon={icon ?? "circle-inactive"} size={20} />
      <span className="truncate text-sm font-medium text-ds-text-primary">
        {status ?? "Not Started"}
      </span>
    </div>
  );
};

export const StepStatusIcons = ({
  icon,
  size,
}: {
  icon: string;
  size: number;
}) => {
  switch (icon) {
    case "circle-inactive":
      return (
        <CircleStatusInactiveIcon
          height={size}
          width={size}
          className="text-ds-text-secondary"
        />
      );
    case "circle-not-started":
      return (
        <CircleStatusDottedIcon
          height={size}
          width={size}
          className="text-ds-text-secondary"
        />
      );
    case "circle-inprogress":
      return (
        <CircleOneThirdIcon
          height={size - 3}
          width={size - 3}
          className="text-ds-combination-amber-subtle-text"
        />
      );
    case "check-green":
      return (
        <CircleStatusCompletedIcon
          height={size}
          width={size}
          className="text-green-400"
        />
      );
    case "check-grey":
      return (
        <CircleStatusCompletedIcon
          height={size}
          width={size}
          className="text-ds-text-secondary"
        />
      );
    case "check-white":
      return (
        <CircleStatusCompletedIcon
          height={size}
          width={size}
          className="text-ds-text-primary"
        />
      );
    case "check-blue":
      return (
        <CircleStatusCompletedIcon
          height={size}
          width={size}
          className="text-ds-combination-purple-subtle-text"
        />
      );
    case "cross-red":
      return (
        <CircleStatusRejectedIcon
          height={size}
          width={size}
          className="text-ds-combination-red-subtle-text"
        />
      );
    case "cross-yellow":
      return (
        <CircleStatusRejectedIcon
          height={size}
          width={size}
          className="text-ds-combination-amber-subtle-text"
        />
      );
    case "attention-red":
      return (
        <CircleInfo
          height={size}
          width={size}
          className="text-ds-combination-red-subtle-text"
        />
      );
    case "attention-yellow":
      return (
        <CircleInfo
          height={size}
          width={size}
          className="text-ds-combination-amber-subtle-text"
        />
      );
    default:
      return (
        <CircleStatusInactiveIcon
          height={size}
          width={size}
          className="text-ds-text-secondary"
        />
      );
  }
};
