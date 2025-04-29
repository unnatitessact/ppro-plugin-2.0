import { useEffect, useRef, useState } from 'react';

import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { cn } from '@nextui-org/react';

import { CrossSmall } from '@tessact/icons';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

import { Filter } from '@/stores/library-store';

import { getIconFromType } from '@/utils/metadata';

interface TextFilterPillProps {
  filter: Filter;
}

const clickablePillCn = cn(
  'px-2 py-1 bg-ds-combo-pill-bg',
  'hover:bg-ds-combo-pill-bg-label',
  'cursor-pointer transition'
);

const nonClickablePillCn = cn('px-2 py-1 bg-ds-combo-pill-bg', 'flex items-center gap-1');

const getLabelFromType = (operator: string) => {
  if (operator === 'contains') {
    return 'contains';
  }
  if (operator === 'does_not_contain') {
    return 'does not contain';
  }
};

export const TextFilterPill = ({ filter }: TextFilterPillProps) => {
  const { removeFilter, modifyFilter } = useLibraryFilterState();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator) removeFilter(id);
  });

  const [valueInput, setValueInput] = useState(value || '');
  const [debouncedValue] = useDebouncedValue(valueInput, 300);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedValue) {
      modifyFilter(id, {
        ...filter,
        value: debouncedValue
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[1px]',
        'text-sm text-ds-combo-pill-label',
        'overflow-hidden rounded-lg'
      )}
    >
      <Popover isOpen={!operator}>
        <PopoverTrigger>
          <div className={nonClickablePillCn}>
            {getIconFromType('text', 20)}
            {label}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox
            onAction={(key) => {
              modifyFilter(id, {
                ...filter,
                operator: key as string
              });
              setTimeout(() => {
                inputRef.current?.focus();
              }, 500);
            }}
          >
            <ListboxItem key="contains">contains</ListboxItem>
            <ListboxItem key="does_not_contain">does not contain</ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && (
        <Dropdown>
          <DropdownTrigger>
            <div className={clickablePillCn}>{getLabelFromType(operator)}</div>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                operator: key as string
              })
            }
          >
            <DropdownItem key="contains">contains</DropdownItem>
            <DropdownItem key="does_not_contain">does not contain</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {operator && (
        <div className={cn(clickablePillCn, 'p-1')}>
          <input
            type="text"
            placeholder="Value to filter"
            className="w-24 bg-transparent outline-none"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            ref={inputRef}
          />
        </div>
      )}
      {operator && (
        <div className={clickablePillCn} onClick={() => removeFilter(id)}>
          <CrossSmall size={20} />
        </div>
      )}
    </div>
  );
};
