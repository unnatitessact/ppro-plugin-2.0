import { Chip as NextUIChip } from '@nextui-org/chip';
import { extendVariants } from '@nextui-org/react';

export const Chip = extendVariants(NextUIChip, {
  defaultVariants: {
    size: 'sm'
  },
  variants: {
    color: {
      filter: {
        base: 'bg-ds-comment-input-text-action text-ds-combination-red-solid-text w-6 py-0.5 px-2 max-w-none min-w-6 h-auto rounded-2xl flex items-center justify-center text-center',
        content: 'text-xs font-medium'
      }
    }
  }
});
