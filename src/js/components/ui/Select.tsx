import type { SelectProps } from '@nextui-org/select';

import { forwardRef } from 'react';

import { extendVariants } from '@nextui-org/react';
import {
  Select as NextUISelect,
  SelectItem as NextUISelectItem,
  SelectSection as NextUISelectSection
} from '@nextui-org/select';

const StyledSelect = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return (
    <NextUISelect
      ref={ref}
      classNames={{
        popoverContent: 'bg-ds-menu-bg border-ds-menu-border border p-0',
        value: 'text-ds-menu-text-secondary',
        trigger:
          'bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover data-[focus=true]:bg-ds-input-bg-hover text-ds-input-text shadow-none transition'
      }}
      listboxProps={{
        classNames: {
          base: 'p-2 bg-ds-menu-bg border-ds-menu-border border rounded-xl',
          list: 'space-y-1'
        },
        itemClasses: {
          base: 'bg-ds-menu-bg data-[selectable=true]:focus:bg-ds-menu-bg-hover data-[hover=true]:bg-ds-menu-bg-hover',
          description: 'text-ds-menu-text-secondary'
        }
      }}
      {...props}
    />
  );
});
StyledSelect.displayName = 'StyledSelect';

export const Select = extendVariants(StyledSelect, {
  defaultVariants: {
    labelPlacement: 'outside'
  }
});

export const SelectItem = extendVariants(NextUISelectItem, {});

export const SelectSection = extendVariants(NextUISelectSection, {});
