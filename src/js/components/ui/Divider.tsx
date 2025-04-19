("");

import { Divider as NextUIDivider } from "@nextui-org/divider";
import { extendVariants } from "@nextui-org/react";

export const Divider = extendVariants(NextUIDivider, {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "bg-ds-divider-line",
      border: "bg-ds-table-row-border",
    },
  },
});
