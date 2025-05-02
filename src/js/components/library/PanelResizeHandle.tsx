import { cn } from "@nextui-org/react";
import { PanelResizeHandle as Handle } from "react-resizable-panels";

export const PanelResizeHandle = ({
  direction = "horizontal",
}: {
  direction?: "horizontal" | "vertical";
}) => {
  return (
    <Handle
      className={cn(
        "group relative flex",
        direction === "horizontal" ? "h-full px-2" : "w-full py-2"
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/2 rounded bg-ds-divider-handle opacity-0 transition-opacity duration-250 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 group-active:opacity-100 group-data-[resize-handle-state=drag]:opacity-100",
          direction === "horizontal" ? "h-8 w-1" : "h-1 w-8"
        )}
      ></div>
      <div
        className={cn(
          "border-transparent bg-none transition-colors duration-250 group-hover:border-ds-divider-line group-active:border-ds-divider-line group-data-[resize-handle-state=drag]:border-ds-divider-line",
          direction === "horizontal" ? "h-full border-r" : "w-full border-b"
        )}
      ></div>
    </Handle>
  );
};
