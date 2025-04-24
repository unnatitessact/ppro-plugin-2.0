import { useState } from "react";

import { parseDate } from "@internationalized/date";
import { useClickOutside } from "@mantine/hooks";
import { cn } from "@nextui-org/react";

import { CrossSmall } from "@tessact/icons";

import { Calendar } from "../../../ui/Calendar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../../ui/Dropdown";
import { Listbox, ListboxItem } from "../../../ui/Listbox";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/Popover";

// import { useLibraryFilterState } from '../../../hooks/useLibraryFilterState';

import { Filter, useLibraryStore } from "../../../../stores/library-store";

import { getIconFromType } from "../../../../utils/metadata";

interface DateFilterPillProps {
  filter: Filter;
}

const clickablePillCn = cn(
  "px-2 py-1 bg-ds-combo-pill-bg",
  "hover:bg-ds-combo-pill-bg-label",
  "cursor-pointer transition"
);

const nonClickablePillCn = cn(
  "px-2 py-1 bg-ds-combo-pill-bg",
  "flex items-center gap-1"
);

const getLabelFromType = (operator: string) => {
  if (operator === "is") return "is";
  if (operator === "is_not") return "is not";
  if (operator === "after") return "after";
  if (operator === "before") return "before";
};

export const DateFilterPill = ({ filter }: DateFilterPillProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { setFilters, filters } = useLibraryStore();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator || !value) setFilters(filters.filter((f) => f.id !== id));
  });

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-[1px]",
        "text-sm text-ds-combo-pill-label",
        "overflow-hidden rounded-lg"
      )}
    >
      <Popover isOpen={!operator}>
        <PopoverTrigger>
          <div className={nonClickablePillCn}>
            {getIconFromType("date", 20)}
            {label}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox
            onAction={(key) =>
              setFilters(
                filters.map((f) =>
                  f.id === id ? { ...f, operator: key as string } : f
                )
              )
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
                setFilters(
                  filters.map((f) =>
                    f.id === id ? { ...f, value: value.toString() } : f
                  )
                )
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
              setFilters(
                filters.map((f) =>
                  f.id === id ? { ...f, operator: key as string } : f
                )
              )
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
        <Popover
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        >
          <PopoverTrigger>
            <div
              className={clickablePillCn}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              {value}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              value={value ? parseDate(value) : null}
              onChange={(value) => {
                setFilters(
                  filters.map((f) =>
                    f.id === id ? { ...f, value: value.toString() } : f
                  )
                );
                setIsCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      )}
      {operator && value && (
        <div
          className={clickablePillCn}
          onClick={() => setFilters(filters.filter((f) => f.id !== id))}
        >
          <CrossSmall size={20} />
        </div>
      )}
    </div>
  );
};
