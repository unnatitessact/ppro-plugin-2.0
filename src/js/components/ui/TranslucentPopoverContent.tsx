import React, { ComponentPropsWithoutRef } from "react";

import { cn } from "@nextui-org/react";

import { PopoverContent } from "./RadixPopover";

// Make sure you are using RadixPopover instead of using NextUI Popover when using translucent popovers

export const TranslucentPopoverContent = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof PopoverContent>) => {
  return (
    <PopoverContent
      className={cn(
        "relative items-start justify-start overflow-hidden border-ds-search-outline/60 bg-ds-search-bg/75 p-0 backdrop-blur-xl backface-hidden transform-gpu",
        className
      )}
      {...rest}
    />
  );
};
