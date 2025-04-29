import { useEffect, useMemo } from 'react';

import { useClickOutside } from '@mantine/hooks';
import { cn } from '@nextui-org/react';

import { CrossSmall } from '@tessact/icons';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

import { Filter } from '@/stores/library-store';

import { getIconFromType } from '@/utils/metadata';

interface MultiselectFilterPillProps {
  filter: Filter;
}

const clickablePillCn = cn(
  'px-2 py-1 bg-ds-combo-pill-bg',
  'hover:bg-ds-combo-pill-bg-label',
  'cursor-pointer transition'
);

const nonClickablePillCn = cn('px-2 py-1 bg-ds-combo-pill-bg', 'flex items-center gap-1');

const getLabelFromType = (operator: string) => {
  if (operator === 'include') return 'include';
  if (operator === 'exclude') return 'exclude';
  if (operator === 'include_any_of') return 'include any of';
  if (operator === 'exclude_any_of') return 'exclude any of';
  if (operator === 'include_all') return 'include all';
  if (operator === 'exclude_all') return 'exclude all';
};

export const MultiselectFilterPill = ({ filter }: MultiselectFilterPillProps) => {
  const { removeFilter, modifyFilter } = useLibraryFilterState();

  // const { data: selectOptions } = useSelectOptionsQuery();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator || !value) removeFilter(id);
  });

  const selectedValues = useMemo(() => {
    return value ? value.split(',') : [];
  }, [value]);

  const selectedOptions =
    useMemo(() => {
      return filter.options.filter((option) => selectedValues.includes(option.id));
    }, [filter.options, selectedValues]) || [];

  useEffect(() => {
    if (operator === 'include' || operator === 'exclude') {
      if (selectedValues.length > 1) {
        modifyFilter(id, {
          ...filter,
          value: selectedValues[0]
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator]);

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
            {getIconFromType('person', 16)}
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
            <ListboxItem key="include">include</ListboxItem>
            <ListboxItem key="exclude">exclude</ListboxItem>
            <ListboxItem key="include_any_of">include any of</ListboxItem>
            <ListboxItem key="exclude_any_of">exclude any of</ListboxItem>
            <ListboxItem key="include_all">include all</ListboxItem>
            <ListboxItem key="exclude_all">exclude all</ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && !value && (
        <Popover isOpen={!value}>
          <PopoverTrigger>
            <div className={clickablePillCn}>{getLabelFromType(operator)}</div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              classNames={{ list: 'max-h-60' }}
              selectionMode={
                operator === 'include' || operator === 'exclude' ? 'single' : 'multiple'
              }
              selectedKeys={value ? value.split(',') : undefined}
              onSelectionChange={(keys) => {
                modifyFilter(id, {
                  ...filter,
                  value: Array.from(keys).join(',')
                });
              }}
              disallowEmptySelection
            >
              {filter.options.map((option) => (
                <ListboxItem key={option.id}>{option.value}</ListboxItem>
              ))}
            </Listbox>
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
            <DropdownItem key="include">include</DropdownItem>
            <DropdownItem key="exclude">exclude</DropdownItem>
            <DropdownItem key="include_any_of">include any of</DropdownItem>
            <DropdownItem key="exclude_any_of">exclude any of</DropdownItem>
            <DropdownItem key="include_all">include all</DropdownItem>
            <DropdownItem key="exclude_all">exclude all</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {value && (
        <Popover>
          <PopoverTrigger>
            <div className={cn(clickablePillCn)}>
              {selectedOptions.map((option) => option.value).join(', ')}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              classNames={{ list: 'max-h-60' }}
              selectionMode={
                operator === 'include' || operator === 'exclude' ? 'single' : 'multiple'
              }
              selectedKeys={value ? value.split(',') : undefined}
              onSelectionChange={(keys) => {
                modifyFilter(id, {
                  ...filter,
                  value: Array.from(keys).join(',')
                });
              }}
              disallowEmptySelection
            >
              {filter.options?.map((option) => (
                <ListboxItem key={option.id}>{option.value}</ListboxItem>
              ))}
            </Listbox>
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
