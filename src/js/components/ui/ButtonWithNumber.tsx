import React, { forwardRef, ReactNode } from 'react';

import { ButtonProps, cn } from '@nextui-org/react';

import { ChevronDownSmall } from '@tessact/icons';

import { Button } from '@/components/ui/Button';

interface ButtonWithNumberProps {
  showPlus?: boolean;
  number?: number;
  icon?: ReactNode;
  customString?: string;
}

const hoverClassnames =
  'bg-ds-button-secondary-bg transition-transform-colors-opacity group-hover:bg-ds-button-secondary-bg-hover group-aria-expanded:bg-ds-button-secondary-bg-hover group-hover:opacity-hover';

const ButtonWithNumber = forwardRef<HTMLButtonElement, ButtonWithNumberProps>(
  (
    { showPlus = true, number, icon, customString, ...rest }: ButtonWithNumberProps & ButtonProps,
    ref
  ) => {
    return (
      <Button
        {...rest}
        color="secondary"
        // className="group"
        className="group flex h-8 min-w-0 items-center justify-center rounded-xl bg-transparent p-0 opacity-100 aria-expanded:bg-transparent data-[hover=true]:bg-transparent data-[hover=true]:opacity-100"
        ref={ref}
      >
        <div className="flex h-8 gap-px">
          <div
            className={cn(
              'flex h-8 w-full max-w-40 items-center justify-center  rounded-bl-xl rounded-tl-xl px-3 py-0',
              !number && !customString && 'hidden',
              hoverClassnames
            )}
          >
            {customString ? (
              <div className="w-full truncate" title={customString}>
                {customString}
              </div>
            ) : (
              `${showPlus ? '+' : ''}${number}`
            )}
          </div>

          <div
            className={cn(
              'flex h-8 items-center justify-center rounded-br-xl rounded-tr-xl  py-0 pl-1',
              number ? 'pr-2' : 'px-1.5',
              hoverClassnames
            )}
          >
            {icon ?? <ChevronDownSmall size={20} />}
          </div>
        </div>
      </Button>
    );
  }
);

ButtonWithNumber.displayName = 'ButtonWithNumber';

export default ButtonWithNumber;
