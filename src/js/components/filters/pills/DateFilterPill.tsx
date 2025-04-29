import { useState } from 'react';

import { parseDate } from '@internationalized/date';
import { useClickOutside } from '@mantine/hooks';
import { cn } from '@nextui-org/react';

import { CrossSmall } from '@tessact/icons';

import { Calendar } from '@/components/ui/Calendar';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

import { Filter } from '@/stores/library-store';

import { getIconFromType } from '@/utils/metadata';

interface DateFilterPillProps {
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
  if (operator === 'after') return 'after';
  if (operator === 'before') return 'before';
};

export const DateFilterPill = ({ filter }: DateFilterPillProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { removeFilter, modifyFilter } = useLibraryFilterState();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator || !value) removeFilter(id);
  });

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
            {getIconFromType('date', 20)}
            {label}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                operator: key as string
              })
            }
          >
            <ListboxItem key="is">is</ListboxItem>
            <ListboxItem key="is_not">is not</ListboxItem>
            <ListboxItem key="before">before</ListboxItem>
            <ListboxItem key="after">after</ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && !value && (
        <Popover isOpen={!value}>
          <PopoverTrigger>
            <div className={clickablePillCn}>{getLabelFromType(operator)}</div>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              value={value ? parseDate(value) : null}
              onChange={(value) =>
                modifyFilter(id, {
                  ...filter,
                  value: value.toString()
                })
              }
            />
          </PopoverContent>
        </Popover>
      )}
      {operator && value && (
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
      {value && (
        <Popover isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
          <PopoverTrigger>
            <div className={clickablePillCn} onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
              {value}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              value={value ? parseDate(value) : null}
              onChange={(value) => {
                modifyFilter(id, {
                  ...filter,
                  value: value.toString()
                });
                setIsCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      )}
      {operator && value && (
        <div className={clickablePillCn} onClick={() => removeFilter(id)}>
          <CrossSmall size={20} />
        </div>
      )}
    </div>
  );
};
