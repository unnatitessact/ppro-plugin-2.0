import { useEffect, useRef, useState } from 'react';

import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { cn } from '@nextui-org/react';

import { CrossSmall } from '@tessact/icons';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { TimecodeInput } from '@/components/ui/TimecodeInput';

import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

import { Filter } from '@/stores/library-store';

import { getIconFromType } from '@/utils/metadata';

interface TimecodeFilterPillProps {
  filter: Filter;
}

const clickablePillCn = cn(
  'px-2 py-1 bg-ds-combo-pill-bg',
  'hover:bg-ds-combo-pill-bg-label',
  'cursor-pointer transition'
);

const nonClickablePillCn = cn('px-2 py-1 bg-ds-combo-pill-bg', 'flex items-center gap-1');

const getLabelFromType = (operator: string) => {
  if (operator === 'is') return 'is';
  if (operator === 'is_not') return 'is not';
  if (operator === 'before') return 'before';
  if (operator === 'after') return 'after';
};

export const TimecodeFilterPill = ({ filter }: TimecodeFilterPillProps) => {
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
            {getIconFromType('timecode', 20)}
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
            <ListboxItem key="is">is</ListboxItem>
            <ListboxItem key="is_not">is not</ListboxItem>
            <ListboxItem key="before">before</ListboxItem>
            <ListboxItem key="after">after</ListboxItem>
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
            <DropdownItem key="is">is</DropdownItem>
            <DropdownItem key="is_not">is not</DropdownItem>
            <DropdownItem key="before">before</DropdownItem>
            <DropdownItem key="after">after</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {operator && (
        <div className={cn(clickablePillCn, 'h-7 overflow-hidden p-0')}>
          <TimecodeInput value={valueInput} onChange={setValueInput} variant="small" />
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
