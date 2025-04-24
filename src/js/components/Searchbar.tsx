import React, { forwardRef } from "react";

// import { InputProps } from '@nextui-org/input';
import { cn } from "@nextui-org/react";

import { MagnifyingGlass } from "@tessact/icons";

import { Input, InputProps } from "./ui/Input";

export interface SearchbarProps {
  value: string;
}

export const Searchbar = forwardRef<
  HTMLInputElement,
  InputProps & SearchbarProps
>(({ value, ...rest }, ref) => {
  return (
    <Input
      size="lg"
      value={value}
      startContent={
        <MagnifyingGlass
          size={20}
          className={cn(
            "transition group-data-[focus]:text-ds-text-primary",
            value.length > 0
              ? "text-ds-text-primary"
              : "text-ds-input-text-placeholder"
          )}
        />
      }
      className="group"
      ref={ref}
      {...rest}
    />
  );
});

Searchbar.displayName = "Searchbar";
