import { DateInput as NextUIDateInput } from '@nextui-org/date-input';
import { extendVariants, DatePicker as NextUIDatePicker } from '@nextui-org/react';

export const DateInput = extendVariants(NextUIDateInput, {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        base: 'rounded-xl',
        inputWrapper:
          'bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover data-[focus=true]:bg-ds-input-bg-hover text-ds-input-text shadow-none',
        input: 'text-ds-input-text placeholder:text-ds-input-text-placeholder text-xs'
      }
    }
  }
});

export const DatePicker = extendVariants(NextUIDatePicker, {
  defaultVariants: {
    variant: 'default',
    size: 'lg'
  },
  variants: {
    variant: {
      default: {
        base: 'rounded-xl',
        inputWrapper:
          'bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover data-[focus=true]:bg-ds-input-bg-hover text-ds-input-text shadow-none',
        input: 'text-ds-input-text placeholder:text-ds-input-text-placeholder text-xs',
        calendar: 'border border-ds-divider-line'
      }
    }
  }
});
