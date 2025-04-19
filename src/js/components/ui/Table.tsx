import { extendVariants } from "@nextui-org/react";
import {
  Table as NextUITable,
  TableBody as NextUITableBody,
  TableCell as NextUITableCell,
  TableColumn as NextUITableColumn,
  TableHeader as NextUITableHeader,
  TableRow as NextUITableRow,
  getKeyValue,
  type TableProps as NextUITableProps,
} from "@nextui-org/react";
import React, { type ReactNode } from "react";

export const Table = extendVariants(NextUITable, {
  defaultVariants: {
    classNames: "default",
  },
  variants: {
    classNames: {
      default: {
        wrapper: "p-0 shadow-none border border-ds-table-row-border",
        th: "bg-ds-table-header-bg rounded-l-none rounded-r-none first:rounded-l-none last:rounded-r-none mb-0 pb-0 px-5 text-ds-text-secondary font-normal",
        tr: "hover:bg-ds-table-row-bg-hover transition group border-b last:border-none border-ds-table-row-border",
        thead: "last:*:hidden *:h-12",
        td: "h-20 py-0",
      },
    },
  },
});

export const TableBody = NextUITableBody;

export const TableCell = NextUITableCell;

export const TableColumn = NextUITableColumn;

export const TableHeader: React.FC<
  React.ComponentProps<typeof NextUITableHeader>
> = (props) => {
  return (<NextUITableHeader {...props} />) as JSX.Element;
};

export const TableRow = NextUITableRow;
