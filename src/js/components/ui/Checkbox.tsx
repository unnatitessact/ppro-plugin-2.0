import {
  Checkbox as NextUICheckbox,
  CheckboxGroup as NextUICheckboxGroup
} from '@nextui-org/checkbox';
import { extendVariants } from '@nextui-org/react';

export const Checkbox = extendVariants(NextUICheckbox, {
  defaultVariants: {
    variant: 'default',
    defaultClassname: 'default'
  },
  variants: {
    defaultClassname: {
      default: {
        base: 'flex items-start gap-2',
        wrapper:
          'before:border-ds-checkbox-unchecked-border group-data-[hover=true]:before:bg-ds-checkbox-unchecked-hover-bg after:bg-ds-checkbox-checked-bg after:text-ds-checkbox-checked-text text-ds-checkbox-checked-text m-0'
      }
    },
    variant: {
      ds: {
        wrapper:
          'before:border-ds-checkbox-unchecked-border group-data-[hover=true]:before:bg-ds-checkbox-unchecked-hover-bg after:bg-ds-checkbox-checked-bg after:text-ds-checkbox-checked-text text-ds-checkbox-checked-text m-0'
      },
      default: {
        wrapper:
          '!before:border-ds-checkbox-unchecked-border group-data-[hover=true]:before:bg-ds-checkbox-unchecked-hover-bg after:bg-ds-checkbox-checked-bg after:text-ds-checkbox-checked-text text-ds-checkbox-checked-text m-0'
      },
      primary: {
        wrapper:
          'before:border-ds-checkbox-unchecked-border group-data-[hover=true]:before:bg-primary-200 after:bg-primary-400 after:text-ds-checkbox-checked-text text-ds-checkbox-checked-text m-0'
      },
      light: {
        wrapper:
          'before:border-ds-checkbox-unchecked-border group-data-[hover=true]:before:bg-ds-checkbox-unchecked-hover-bg after:bg-ds-checkbox-checked-bg after:text-ds-checkbox-checked-text text-ds-checkbox-checked-text m-0',
        base: 'data-[hover=true]:bg-default-200 rounded-lg'
      }
    }
  }
});

export const CheckboxGroup = extendVariants(NextUICheckboxGroup, {});
