import { ComponentPropsWithRef } from 'react';

import { Input as NextUIInput } from '@nextui-org/input';
import { extendVariants } from '@nextui-org/react';

export const Input = extendVariants(NextUIInput, {
  defaultVariants: {
    size: 'lg',
    labelPlacement: 'outside',
    variant: 'default'
  },
  variants: {
    variant: {
      default: {
        inputWrapper:
          'bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover data-[focus=true]:bg-ds-input-bg-hover text-ds-input-text shadow-none',
        description: 'text-ds-input-caption',
        errorMessage: 'text-ds-input-caption-error',
        input: 'text-ds-input-text placeholder:text-ds-input-text-placeholder',
        label: 'text-ds-input-label'
      },
      transparent: {
        base: 'bg-transparent bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent',
        mainWrapper: 'bg-transparent',
        innerWrapper: 'bg-transparent',
        inputWrapper:
          'bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent group-data-[focus=true]:bg-transparent h-14 p-0',
        input: 'text-base placeholder:text-ds-text-secondary'
      },
      search: {
        base: 'bg-transparent border-b border-ds-search-outline bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent',
        mainWrapper: 'bg-transparent',
        innerWrapper: 'bg-transparent',
        inputWrapper:
          'bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent group-data-[focus=true]:bg-transparent h-14',
        input: 'text-base placeholder:text-ds-text-secondary'
      }
    },
    isInvalid: {
      true: {
        inputWrapper:
          'border-danger border bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover group-data-[focus=true]:bg-ds-input-bg'
      }
    },
    isDisabled: {
      true: {
        base: 'opacity-100',
        inputWrapper: 'text-ds-input-text-disabled',
        input: 'text-ds-input-text-disabled',
        label: 'text-ds-input-label-disabled'
      }
    }
  }
});

export type InputProps = ComponentPropsWithRef<typeof Input>;
