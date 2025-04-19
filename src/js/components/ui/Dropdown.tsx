("");

import type { DropdownMenuProps } from "@nextui-org/dropdown";

import { forwardRef } from "react";

import {
  Dropdown as NextUIDropdown,
  DropdownItem as NextUIDropdownItem,
  DropdownMenu as NextUIDropdownMenu,
  DropdownSection as NextUIDropdownSection,
  DropdownTrigger as NextUIDropdownTrigger,
} from "@nextui-org/dropdown";
import { extendVariants } from "@nextui-org/react";

import {
  containerClassnames,
  itemClassnames,
  sectionClassNames,
} from "./Listbox";

export const Dropdown = extendVariants(NextUIDropdown, {
  defaultVariants: {
    variant: "default",
    radius: "md",
  },
  variants: {
    variant: {
      default: {
        content: "bg-ds-menu-bg border-ds-menu-border border-1",
      },
    },
  },
});

export const DropdownTrigger = extendVariants(NextUIDropdownTrigger, {
  defaultVariants: {},
});

const StyledDropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (props, ref) => {
    return (
      <NextUIDropdownMenu
        ref={ref}
        classNames={containerClassnames}
        itemClasses={itemClassnames}
        {...props}
      >
        {props.children}
      </NextUIDropdownMenu>
    );
  }
);

StyledDropdownMenu.displayName = "StyledDropdownMenu";

export const DropdownMenu = extendVariants(StyledDropdownMenu, {
  defaultVariants: {},
});

export const DropdownItem = extendVariants(NextUIDropdownItem, {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: itemClassnames,
    },
  },
});

export const DropdownSection = extendVariants(NextUIDropdownSection, {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: sectionClassNames,
    },
  },
});
