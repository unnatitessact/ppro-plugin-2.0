import { forwardRef, ReactNode } from "react";

// import { WorkspaceIcon } from "./WorkspaceIcon";

import WorkspaceIcon from "../WorkspaceIcon";

interface TabLabelProps {
  children: ReactNode;
}

export const TabLabel = ({ children }: TabLabelProps) => (
  <p className="p-0 text-xs font-medium uppercase">{children}</p>
);

interface WorkspaceTabLabelProps {
  children: string;
  workspaceImage: string;
  title: string;
  color?: string;
}

export const WorkspaceTabLabel = forwardRef(function Label(
  { children, workspaceImage, title, color }: WorkspaceTabLabelProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className="grid grid-cols-[max-content_1fr] items-center gap-3"
      aria-label={children}
      title={children}
    >
      <WorkspaceIcon image={workspaceImage} title={title} color={color} />
      <p className="items-center truncate text-base font-medium normal-case text-default-900">
        {children}
      </p>
    </div>
  );
});
