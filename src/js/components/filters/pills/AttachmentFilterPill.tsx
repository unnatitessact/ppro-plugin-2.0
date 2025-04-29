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
  const { removeFilter, modifyFilter } = useLibraryStore();

  const { id, label, operator } = filter;

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
            {getIconFromType("attachment", 16)}
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
              modifyFilter(id, {
                ...filter,
                operator: key as string,
              })
            }
          >
            <DropdownItem key="not_null">is present</DropdownItem>
            <DropdownItem key="null">is not present</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {operator && (
        <div className={clickablePillCn} onClick={() => removeFilter(id)}>
          <CrossSmall size={20} />
        </div>
      )}
    </div>
  );
};
