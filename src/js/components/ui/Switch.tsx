import { extendVariants } from '@nextui-org/react';
import { Switch as NextUISwitch } from '@nextui-org/switch';

export const Switch = extendVariants(NextUISwitch, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        base: 'h-5 w-8',
        wrapper:
          'group-data-[selected=true]:bg-gradient-to-tl group-data-[selected=true]:from-ds-toggle-selected-bg-from group-data-[selected=true]:to-ds-toggle-selected-bg-to bg-gradient-to-r from-ds-toggle-default-bg-from to-ds-toggle-default-bg-to',
        thumb:
          'w-4 h-4 gap-px group-data-[selected=true]:bg-ds-toggle-selected-knob-bg bg-ds-toggle-default-knob-bg before:h-1.5 before:w-px before:bg-ds-toggle-default-knob-ridge before:rounded-lg after:h-1.5 after:w-px after:bg-ds-toggle-default-knob-ridge after:rounded-lg group-data-[selected=true]:before:bg-ds-toggle-selected-knob-ridge group-data-[selected=true]:after:bg-ds-toggle-selected-knob-ridge'
      }
    }
  }
});
