import { useClickOutside } from '@mantine/hooks';
import { cn } from '@nextui-org/react';

import { CrossSmall } from '@tessact/icons';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { Listbox, ListboxItem } from '@/components/ui/Listbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

import { StatusIcon } from '@/components/StatusIcon';

import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';

import { FileStatus } from '@/api-integration/types/library';

import { Filter } from '@/stores/library-store';

import { getIconFromType } from '@/utils/metadata';

interface FileStatusFilterPillProps {
  filter: Filter;
}

const clickablePillCn = cn(
  'px-2 py-1 bg-ds-combo-pill-bg',
  'hover:bg-ds-combo-pill-bg-label',
  'cursor-pointer transition'
);

const nonClickablePillCn = cn('px-2 py-1 bg-ds-combo-pill-bg', 'flex items-center gap-1');

const getLabelFromOperator = (operator: string) => {
  if (operator === 'is') return 'is';
  if (operator === 'is_not') return 'is not';
};

const getLabelFromValue = (value: FileStatus) => {
  if (value === 'approved') return 'Approved';
  if (value === 'in_progress') return 'In Progress';
  // if (value === 'inactive') return 'Inactive';
  if (value === 'not_started') return 'Not Started';
  // if (value === 'waiting') return 'Waiting';
  if (value === 'rejected') return 'Rejected';
  if (value === 'processed') return 'Processed';
  if (value === 'needs_edit') return 'Needs Edit';
};

export const FileStatusFilterPill = ({ filter }: FileStatusFilterPillProps) => {
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
            {getIconFromType('file_status', 16)}
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
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && !value && (
        <Popover isOpen={!value}>
          <PopoverTrigger>
            <div className={clickablePillCn}>{getLabelFromOperator(operator)}</div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              onAction={(key) => {
                modifyFilter(id, {
                  ...filter,
                  value: key as string
                });
              }}
            >
              <ListboxItem startContent={<StatusIcon status="approved" />} key="approved">
                Approved
              </ListboxItem>
              <ListboxItem startContent={<StatusIcon status="processed" />} key="processed">
                Processed
              </ListboxItem>
              <ListboxItem startContent={<StatusIcon status="in_progress" />} key="in_progress">
                In Progress
              </ListboxItem>
              <ListboxItem startContent={<StatusIcon status="needs_edit" />} key="needs_edit">
                Needs Edit
              </ListboxItem>
              <ListboxItem startContent={<StatusIcon status="not_started" />} key="not_started">
                Not Started
              </ListboxItem>
              <ListboxItem startContent={<StatusIcon status="rejected" />} key="rejected">
                Rejected
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      )}
      {operator && value && (
        <Dropdown>
          <DropdownTrigger>
            <div className={clickablePillCn}>{getLabelFromOperator(operator)}</div>
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
          </DropdownMenu>
        </Dropdown>
      )}
      {value && (
        <Dropdown>
          <DropdownTrigger>
            <div className={cn(clickablePillCn, 'flex items-center gap-2')}>
              <StatusIcon status={value as FileStatus} />
              {getLabelFromValue(value as FileStatus)}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => {
              modifyFilter(id, {
                ...filter,
                value: key as string
              });
            }}
          >
            <DropdownItem startContent={<StatusIcon status="approved" />} key="approved">
              Approved
            </DropdownItem>
            <DropdownItem startContent={<StatusIcon status="processed" />} key="processed">
              Processed
            </DropdownItem>
            <DropdownItem startContent={<StatusIcon status="in_progress" />} key="in_progress">
              In Progress
            </DropdownItem>
            <DropdownItem startContent={<StatusIcon status="needs_edit" />} key="needs_edit">
              Needs Edit
            </DropdownItem>
            <DropdownItem startContent={<StatusIcon status="not_started" />} key="not_started">
              Not Started
            </DropdownItem>
            <DropdownItem startContent={<StatusIcon status="rejected" />} key="rejected">
              Rejected
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
