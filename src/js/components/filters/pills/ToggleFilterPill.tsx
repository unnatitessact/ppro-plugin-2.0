import { useClickOutside } from "@mantine/hooks";
import { cn } from "@nextui-org/react";

import { CrossSmall } from "@tessact/icons";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { Listbox, ListboxItem } from "@/components/ui/Listbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

import { useLibraryStore } from "@/stores/library-store";

import { Filter } from "@/stores/library-store";

import { getIconFromType } from "@/utils/metadata";

interface ToggleFilterPillProps {
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
  if (operator === "is") return "is true";
  if (operator === "is_not") return "is false";
};

export const ToggleFilterPill = ({ filter }: ToggleFilterPillProps) => {
  const { removeFilter, modifyFilter } = useLibraryStore();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator) removeFilter(id);
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
            {getIconFromType("toggle", 16)}
            {label}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                operator: key as string,
              })
            }
          >
            <ListboxItem key="is">is true</ListboxItem>
            <ListboxItem key="is_not">is false</ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      {operator && value && (
        <Dropdown>
          <DropdownTrigger>
            <div className={clickablePillCn}>{getLabelFromType(operator)}</div>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) =>
              modifyFilter(id, {
                ...filter,
                operator: key as string,
              })
            }
          >
            <DropdownItem key="is">is true</DropdownItem>
            <DropdownItem key="is_not">is false</DropdownItem>
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
