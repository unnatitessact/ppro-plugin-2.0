import { useEffect, useMemo } from "react";

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

interface SelectFilterPillProps {
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
  if (operator === "is_any_of") return "is any of";
  if (operator === "is_not_any_of") return "is not any of";
};

export const SelectFilterPill = ({ filter }: SelectFilterPillProps) => {
  const { removeFilter, modifyFilter } = useLibraryStore();

  const { id, label, value, operator } = filter;

  const ref = useClickOutside(() => {
    if (!operator || !value) removeFilter(id);
  });

  const selectedValues = useMemo(() => {
    return value ? value.split(",") : [];
  }, [value]);

  const selectedOptions =
    useMemo(() => {
      return filter.options.filter((option) =>
        selectedValues.includes(option.id)
      );
    }, [filter.options, selectedValues]) || [];

  useEffect(() => {
    if (operator === "is" || operator === "is_not") {
      if (selectedValues.length > 1) {
        modifyFilter(id, {
          ...filter,
          value: selectedValues[0],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator]);

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
            {getIconFromType("person", 16)}
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
            <ListboxItem key="is">is</ListboxItem>
            <ListboxItem key="is_not">is not</ListboxItem>
            <ListboxItem key="is_any_of">is any of</ListboxItem>
            <ListboxItem key="is_not_any_of">is not any of</ListboxItem>
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
              classNames={{ list: "max-h-60" }}
              selectionMode={
                operator === "is_any_of" || operator === "is_not_any_of"
                  ? "multiple"
                  : "single"
              }
              selectedKeys={value ? value.split(",") : undefined}
              onSelectionChange={(keys) => {
                modifyFilter(id, {
                  ...filter,
                  value: Array.from(keys).join(","),
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
            <DropdownItem key="is">is</DropdownItem>
            <DropdownItem key="is_not">is not</DropdownItem>
            <DropdownItem key="is_any_of">is any of</DropdownItem>
            <DropdownItem key="is_not_any_of">is not any of</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {value && (
        <Popover>
          <PopoverTrigger>
            <div className={cn(clickablePillCn)}>
              {selectedOptions.map((option) => option.value).join(", ")}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              classNames={{ list: "max-h-60" }}
              selectionMode={
                operator === "is_any_of" || operator === "is_not_any_of"
                  ? "multiple"
                  : "single"
              }
              selectedKeys={value ? value.split(",") : undefined}
              onSelectionChange={(keys) => {
                modifyFilter(id, {
                  ...filter,
                  value: Array.from(keys).join(","),
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
