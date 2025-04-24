import { useClickOutside } from "@mantine/hooks";
import { cn } from "@nextui-org/react";

import { CrossSmall } from "@tessact/icons";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../../ui/Dropdown";
import { Listbox, ListboxItem } from "../../../ui/Listbox";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/Popover";

import { useLibraryStore } from "../../../../stores/library-store";

// import { useFilterStore } from "../../../../stores/library-filter-store";

// import { useLibraryFilterState } from "../../../hooks/useLibraryFilterState";

import { Filter } from "../../../../stores/library-store";

import { getIconFromType } from "../../../../utils/metadata";

interface AttachmentFilterPillProps {
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
  if (operator === "not_null") return "is present";
  if (operator === "null") return "is not present";
};

export const AttachmentFilterPill = ({ filter }: AttachmentFilterPillProps) => {
  // const { removeFilter, modifyFilter } = useLibraryFilterState();

  const { filters, setFilters } = useLibraryStore();

  const { id, label, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator) setFilters(filters.filter((f) => f.id !== id));
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
            {getIconFromType("attachment", 16)}
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
            <ListboxItem key="not_null">is present</ListboxItem>
            <ListboxItem key="null">is not present</ListboxItem>
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
              setFilters(
                filters.map((f) =>
                  f.id === id ? { ...f, operator: key as string } : f
                )
              )
            }
          >
            <DropdownItem key="not_null">is present</DropdownItem>
            <DropdownItem key="null">is not present</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {operator && (
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
