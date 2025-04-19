// import { Dispatch, SetStateAction } from 'react';

// import { SortParams } from '@/app/(protected)/(user-management)/admin/users/page';
import { cn } from "@nextui-org/react";
import { flexRender, Header } from "@tanstack/react-table";
// import Icon from '@tessact/central-icons';
import { Column, ColumnResizer } from "react-aria-components";

import { Checkbox } from "./Checkbox";

interface DataTableColumnProps<T> {
  header: Header<T, unknown>;
  index: number;
  onValueChange: (value: boolean) => void;
  areSomeRowsSelected: boolean;
  allRowsSelected: boolean;
  isLastColumn: boolean;
  // sortParams: SortParams;
  // setSortParams: Dispatch<SetStateAction<SortParams>>;
}

export const DataTableColumn = <T extends object>({
  header,
  index,
  onValueChange,
  areSomeRowsSelected,
  allRowsSelected,
  isLastColumn,
}: // sortParams,
// setSortParams
DataTableColumnProps<T>) => {
  return (
    <Column
      minWidth={200}
      maxWidth={800}
      key={header.id}
      className={cn("group/column p-6 pr-0", {
        "rounded-tl-xl": index === 0,
        "rounded-tr-xl": isLastColumn,
      })}
      isRowHeader={index === 0}
    >
      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {index === 0 && (areSomeRowsSelected || allRowsSelected) ? (
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <Checkbox
                onValueChange={onValueChange}
                isSelected={allRowsSelected}
                // isIndeterminate={areSomeRowsSelected}
              />
            </div>
          ) : null}
          <div
            className={cn(
              "text-secondary-30 flex items-center gap-4 text-sm font-medium text-default-400",
              {
                "flex translate-x-8 items-center gap-4 text-default-400 transition-all duration-300":
                  (areSomeRowsSelected || allRowsSelected) && index === 0,
              }
            )}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        </div>

        {!isLastColumn && header.column.columnDef.enableResizing ? (
          <ColumnResizer>
            <div className="h-6 w-0.5 cursor-col-resize bg-primary-300 px-[2px] opacity-0 transition-opacity active:opacity-80 group-hover/column:opacity-100"></div>
          </ColumnResizer>
        ) : null}
      </div>
    </Column>
  );
};
