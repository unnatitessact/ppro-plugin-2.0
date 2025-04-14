"use client";

import * as React from "react";

import { cn } from "@nextui-org/react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { CheckFilled, DotGrid1X3HorizontalFilled } from "@tessact/icons";

import {
  containerClassnames,
  itemClassnames,
  sectionClassNames,
} from "../ui/Listbox";
import { popoverClassNames } from "../ui/Popover";

const DropdownMenu = DropdownMenuPrimitive.Root;

// const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "aria-expanded:opacity-70 aria-expanded:scale-[0.97]",
      className
    )}
    {...props}
  />
));

DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    inset?: boolean;
  }
>(({ className, startContent, endContent, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    onKeyUp={(event) => event.stopPropagation()}
    className={cn(
      "relative flex cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // itemFocusStates,
      itemClassnames.base,
      itemClassnames.title,
      itemFocusStates,
      inset && "pr-8",
      className
    )}
    {...props}
  >
    {startContent}
    <div className="flex flex-1">{children}</div>
    {endContent}
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 12, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      containerClassnames.base,
      containerClassnames.list,
      popoverClassNames.content,
      "z-100 w-full  p-2 shadow-small data-[state=closed]:animate-custom-out data-[state=open]:animate-custom-in",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
    disablePortal?: boolean;
  }
>(({ className, sideOffset = 7, disablePortal, ...props }, ref) => {
  const content = (
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // 'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
        containerClassnames.base,
        containerClassnames.list,
        "box-border inline-flex w-full flex-col items-center justify-center rounded-large border-1 border-ds-menu-border bg-ds-menu-bg p-1 text-sm subpixel-antialiased shadow-medium outline-none",
        "data-[state=closed]:animate-custom-out data-[state=open]:animate-custom-in",
        "z-100",
        "p-2",
        className
      )}
      {...props}
    />
  );
  return disablePortal ? (
    content
  ) : (
    <DropdownMenuPrimitive.Portal>{content}</DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={cn(sectionClassNames.base, sectionClassNames.group, className)}
    {...props}
  />
));
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
  }
>(({ className, startContent, children, endContent, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    onKeyUp={(event) => event.stopPropagation()}
    onClick={(event) => event.stopPropagation()}
    className={cn(
      "relative flex cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      itemFocusStates,
      itemClassnames.base,
      itemClassnames.title,
      itemFocusStates,
      inset && "pr-8",
      className
    )}
    {...props}
  >
    {startContent}
    <div className="flex flex-1">{children}</div>
    {endContent}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    startContent?: React.ReactNode;
    inset?: boolean;
  }
>(({ className, children, checked, startContent, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // itemFocusStates,
      itemClassnames.base,
      itemClassnames.title,
      itemFocusStates,
      inset && "pr-8",
      className
    )}
    checked={checked}
    {...props}
  >
    {startContent}
    <span
      className={cn(
        "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
        itemClassnames.selectedIcon
      )}
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckFilled className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <div className="flex flex-1">{children}</div>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotGrid1X3HorizontalFilled className="h-4 w-4 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      sectionClassNames.base,
      sectionClassNames.heading,
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(sectionClassNames.divider, className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

const itemFocusStates =
  "border-box focus-visible:dark:ring-offset-background-content1 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus hover:focus-visible:outline-none";
