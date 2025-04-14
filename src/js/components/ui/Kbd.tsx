'use client';

import { Kbd as NextUIKbd } from '@nextui-org/kbd';
import { extendVariants } from '@nextui-org/react';

export const Kbd = extendVariants(NextUIKbd, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        base: 'inline-flex rounded-md border-1 border-ds-kbd-border bg-ds-kbd-bg py-0.5 px-1 shadow-none'
      },
      search: {
        base: 'rounded-md border border-ds-kbd-border px-1 py-0.5 text-xs font-medium text-ds-kbd-text shadow-none'
      }
    }
  }
});
