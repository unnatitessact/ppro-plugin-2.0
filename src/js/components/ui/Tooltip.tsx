import { extendVariants } from '@nextui-org/react';
import { Tooltip as NextTooltip } from '@nextui-org/tooltip';

export const Tooltip = extendVariants(NextTooltip, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        base: 'before:border before:border-ds-tooltip-border before:bg-ds-tooltip-bg before:bg-opacity-80 before:backdrop-filter before:backdrop-blur-md after:bg-ds-tooltip-bg after:h-[2px] after:rounded-[1px] after:w-3 after:bottom-0 after:left-[50%] after:translate-x-[-50%]',
        // base: 'before:content-[url(/projects/tooltip-border.svg)] before:ml-[-10px] before:rotate-0 before:translate-y-[-3px] before:bg-transparent before:shadow-none before:stroke-ds-tooltip-border before:color',

        content:
          'text-ds-tooltip-text bg-opacity-80 border bg-ds-tooltip-bg border-ds-tooltip-border rounded-xl backdrop-filter backdrop-blur-md'
      }
    }
  }
});
