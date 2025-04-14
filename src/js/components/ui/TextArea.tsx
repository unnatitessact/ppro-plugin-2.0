import type { TextAreaProps } from '@nextui-org/input';

import { forwardRef } from 'react';

import { Textarea as NextUITextArea } from '@nextui-org/input';
import { extendVariants } from '@nextui-org/react';

const StyledTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  return (
    <NextUITextArea
      ref={ref}
      classNames={{
        inputWrapper:
          'bg-ds-input-bg data-[hover=true]:bg-ds-input-bg-hover data-[focus=true]:bg-ds-input-bg-hover text-ds-input-text',
        description: 'text-ds-input-caption',
        errorMessage: 'text-ds-input-caption-error',
        input: 'text-ds-input-text placeholder:text-ds-input-text-placeholder',
        label: 'text-ds-input-label'
      }}
      {...props}
      as="div"
    />
  );
});
StyledTextArea.displayName = 'StyledTextArea';

export const TextArea = extendVariants(StyledTextArea, {
  defaultVariants: {
    labelPlacement: 'outside',
    size: 'md'
  },
  variants: {
    variant: {
      comment: {
        inputWrapper:
          'bg-transparent border-none shadow-none p-2 data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent h-auto',
        input:
          'h-5 placeholder:text-default-400 placeholder:font-normal font-medium text-ds-text-primary text-md'
      },
      transparent: {
        base: 'bg-transparent bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent',
        mainWrapper: 'bg-transparent',
        innerWrapper: 'bg-transparent',
        inputWrapper:
          'bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent group-data-[focus=true]:bg-transparent p-0 shadow-none',
        input: 'text-xs placeholder:text-ds-text-secondary'
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

export default TextArea;
