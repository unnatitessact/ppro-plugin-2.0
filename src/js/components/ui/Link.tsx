import { Link as NextUILink } from '@nextui-org/link';
import { extendVariants } from '@nextui-org/react';

export const Link = extendVariants(NextUILink, {
  variants: {
    color: {
      primary: 'text-primary-400'
    }
  },
  defaultVariants: {
    color: 'primary'
  }
});
