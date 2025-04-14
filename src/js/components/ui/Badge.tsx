import { Badge as NextUIBadge } from '@nextui-org/badge';
import { extendVariants } from '@nextui-org/react';

export const Badge = extendVariants(NextUIBadge, {
  defaultVariants: {},
  variants: {
    size: {
      xs: {
        badge:
          'z-1 h-2 w-2 aspect-square border border-background rounded-full p-0 bottom-[15%] right-[15%]'
      }
    }
  }
});
