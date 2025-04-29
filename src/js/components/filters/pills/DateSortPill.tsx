import { cn } from "@nextui-org/react";

import { CrossSmall } from "@tessact/icons";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/Dropdown";

import { useLibraryStore } from "@/stores/library-store";

import { Sort } from "@/stores/library-store";

interface DateSortPillProps {
  sort: Sort;
  order: number;
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

export const getLabelFromSort = (sort: "asc" | "desc") => {
  if (sort === "asc") return "oldest first";
  if (sort === "desc") return "latest first";
};

export const DateSortPill = ({ sort, order }: DateSortPillProps) => {
  const { removeSort, modifySort } = useLibraryStore();

  return (
    <div
      className={cn(
        "flex items-center gap-[1px]",
        "text-sm text-ds-combo-pill-label",
        "overflow-hidden rounded-lg"
      )}
    >
      <span className={cn("px-3 py-1", "bg-ds-combo-pill-bg-label")}>
        {order}
      </span>
      <div className={nonClickablePillCn}>{sort.label}</div>
      <Dropdown>
        <DropdownTrigger>
          <div className={clickablePillCn}>
            {getLabelFromSort(sort.direction)}
          </div>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) =>
            modifySort(sort.id, { ...sort, direction: key as "asc" | "desc" })
          }
        >
          <DropdownItem key="asc">oldest first</DropdownItem>
          <DropdownItem key="desc">latest first</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className={clickablePillCn} onClick={() => removeSort(sort.id)}>
        <CrossSmall size={20} />
      </div>
    </div>
  );
};
