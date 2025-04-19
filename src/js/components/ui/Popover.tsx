("");

import {
  Popover as NextUIPopover,
  PopoverContent as NextUIPopoverContent,
  PopoverTrigger as NextUIPopoverTrigger,
} from "@nextui-org/popover";
import { extendVariants } from "@nextui-org/react";

export const popoverClassNames = {
  content:
    "min-w-max bg-ds-menu-bg border-ds-menu-border border-1 p-1 overflow-auto flex flex-col gap-1 rounded-xl",
};

export const Popover = extendVariants(NextUIPopover, {
  defaultVariants: {
    variant: "default",
    placement: "bottom-start",
  },
  variants: {
    variant: {
      default: popoverClassNames,
    },
  },
});

export const PopoverContent = extendVariants(NextUIPopoverContent, {
  defaultVariants: {},
});
export const PopoverTrigger = extendVariants(NextUIPopoverTrigger, {});
