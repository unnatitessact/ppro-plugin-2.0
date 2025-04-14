import type { AutocompleteProps, AutocompleteSectionProps } from '@nextui-org/react';

import { forwardRef } from 'react';

import {
  Autocomplete as NextUIAutocomplete,
  AutocompleteSection as NextUIAutocompleteSection
} from '@nextui-org/autocomplete';

import { containerClassnames, sectionClassNames } from './Listbox';
import { popoverClassNames } from './Popover';

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ classNames, listboxProps, scrollRef, ...props }, ref) => {
    return (
      <NextUIAutocomplete
        selectorButtonProps={{
          disableRipple: true
        }}
        classNames={{
          popoverContent: popoverClassNames.content,
          ...classNames
        }}
        listboxProps={{
          classNames: containerClassnames,
          ...listboxProps
        }}
        scrollShadowProps={{
          visibility: 'none',
          size: 0
        }}
        {...props}
        scrollRef={scrollRef}
        ref={ref}
      />
    );
  }
);
Autocomplete.displayName = 'Autocomplete';

export const AutocompleteSection = ({ classNames, ...props }: AutocompleteSectionProps) => (
  <NextUIAutocompleteSection
    classNames={{
      ...sectionClassNames,
      ...classNames
    }}
    {...props}
  />
);
