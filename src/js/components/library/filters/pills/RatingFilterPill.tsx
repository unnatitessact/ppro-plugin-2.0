import { useState } from 'react';

import { useClickOutside } from '@mantine/hooks';
import { cn } from '@nextui-org/react';
import { Rating } from 'react-simple-star-rating';

import { CrossSmall } from '@tessact/icons';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

import { Filter } from '@/stores/library-store';

import { getIconFromType } from '@/utils/metadata';

interface RatingFilterPillProps {
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
  if (operator === 'greater_than') return 'greater than';
  if (operator === 'less_than') return 'less than';
};

export const RatingFilterPill = ({ filter }: RatingFilterPillProps) => {
  const { removeFilter, modifyFilter } = useLibraryFilterState();
  const { id, label, value, operator } = filter;

  const [isOperatorOpen, setIsOperatorOpen] = useState(!operator);
  const [isValueOpen, setIsValueOpen] = useState(!value && !!operator);

  const ref = useClickOutside(() => {
    if ((isOperatorOpen && !operator) || (isValueOpen && !value)) {
      removeFilter(id);
    }
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
      <Popover isOpen={isOperatorOpen} onOpenChange={(open) => setIsOperatorOpen(open)}>
        <PopoverTrigger>
          <div className={nonClickablePillCn}>
            {getIconFromType('rating', 16)}
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
              setIsOperatorOpen(false);
              setIsValueOpen(true);
            }}
          >
            <ListboxItem key="is">is</ListboxItem>
            <ListboxItem key="is_not">is not</ListboxItem>
            <ListboxItem key="greater_than">greater than</ListboxItem>
            <ListboxItem key="less_than">less than</ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && !value && (
        <Popover isOpen={isValueOpen} onOpenChange={(open) => setIsValueOpen(open)}>
          <PopoverTrigger>
            <div className={clickablePillCn}>{getLabelFromType(operator)}</div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              onAction={(key) => {
                modifyFilter(id, {
                  ...filter,
                  value: key as string
                });
                setIsValueOpen(false);
              }}
            >
              <ListboxItem key="5">
                <Rating readonly initialValue={5} size={16} SVGclassName="inline-flex" />
              </ListboxItem>
              <ListboxItem key="4">
                <Rating readonly initialValue={4} size={16} SVGclassName="inline-flex" />
              </ListboxItem>
              <ListboxItem key="3">
                <Rating readonly initialValue={3} size={16} SVGclassName="inline-flex" />
              </ListboxItem>
              <ListboxItem key="2">
                <Rating readonly initialValue={2} size={16} SVGclassName="inline-flex" />
              </ListboxItem>
              <ListboxItem key="1">
                <Rating readonly initialValue={1} size={16} SVGclassName="inline-flex" />
              </ListboxItem>
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
            <DropdownItem key="is">is</DropdownItem>
            <DropdownItem key="is_not">is not</DropdownItem>
            <DropdownItem key="greater_than">greater than</DropdownItem>
            <DropdownItem key="less_than">less than</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {value && (
        <Dropdown>
          <DropdownTrigger>
            <div className={clickablePillCn}>
              <Rating readonly initialValue={Number(value)} size={16} SVGclassName="inline-flex" />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                value: key as string
              })
            }
          >
            <DropdownItem key="5">
              <Rating readonly initialValue={5} size={16} SVGclassName="inline-flex" />
            </DropdownItem>
            <DropdownItem key="4">
              <Rating readonly initialValue={4} size={16} SVGclassName="inline-flex" />
            </DropdownItem>
            <DropdownItem key="3">
              <Rating readonly initialValue={3} size={16} SVGclassName="inline-flex" />
            </DropdownItem>
            <DropdownItem key="2">
              <Rating readonly initialValue={2} size={16} SVGclassName="inline-flex" />
            </DropdownItem>
            <DropdownItem key="1">
              <Rating readonly initialValue={1} size={16} SVGclassName="inline-flex" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {operator && value && (
        <div className={clickablePillCn} onClick={() => removeFilter(id)}>
          <CrossSmall size={20} />
        </div>
      )}
    </div>
  );
};
