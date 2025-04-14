import { Avatar as NextUIAvatar } from '@nextui-org/avatar';
import { extendVariants } from '@nextui-org/react';

export const Avatar = extendVariants(NextUIAvatar, {
  defaultVariants: {
    radius: 'lg',
    size: 'sm',
    classNames: 'custom'
  },
  variants: {
    size: {
      xs: {
        base: 'w-6 h-6'
      },
      cursor: {
        base: 'w-5 h-5 border-0 cursor-auto'
      }
    }
  }
});
