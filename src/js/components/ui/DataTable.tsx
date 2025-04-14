import type { RefObject } from 'react';

import { ReactNode, useEffect, useState } from 'react';

// import { SortParams } from '@/app/(protected)/(user-management)/admin/users/page';
import { cn } from '@nextui-org/react';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import { ResizableTableContainer, Table, TableBody, TableHeader } from 'react-aria-components';

import {
  ColumnWideAdd,
  CrossSmallFilled,
  EyeOpen,
  EyeSlash,
  MagnifyingGlass
} from '@tessact/icons';

import { DataTableColumn } from '@/components/ui/DataTableColumn';
import { DataTableRow } from '@/components/ui/DataTableRow';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/Dropdown';
import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { Button } from './Button';

interface DataTable<T> {
  columns: ColumnDef<T>[];
  data: T[];
  tableActions: ReactNode;
  setSelectedData: (data: T[]) => void;
  triggerRemoveSelection: boolean;
  selectedData: T[];
  setTriggerRemoveSelection: (trigger: boolean) => void;
  scrollRef: RefObject<HTMLElement> | undefined;
  loaderState: ReactNode;
  isLoading: boolean;
  isSelectionEnabled: boolean;
  isHoverEnabled?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // sortParams: SortParams;
  // setSortParams: Dispatch<SetStateAction<SortParams>>;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  tableActions,
  setSelectedData,
  triggerRemoveSelection,
  selectedData,
  scrollRef,
  loaderState,
  isLoading,
  isSelectionEnabled,
  isHoverEnabled,
  searchQuery,
  setSearchQuery
  // sortParams,
  // setSortParams
}: DataTable<T>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    columns,
    data: data,
    state: {
      rowSelection,
      columnVisibility
    },
    defaultColumn: {
      minSize: 300,
      maxSize: 800
    },
    columnResizeMode: 'onChange',
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0
      }
    }
  });

  useEffect(() => {
    if (triggerRemoveSelection) {
      table.toggleAllRowsSelected(false);
    }
  }, [triggerRemoveSelection, table]);

  useEffect(() => {
    setSelectedData(
      Object.entries(table.getState().rowSelection).map(([index]) => {
        return data[+index];
      })
    );
  }, [table.getState().rowSelection, setSelectedData]);

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-full flex-1 flex-col">
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger>
          <Button
            isIconOnly
            className="absolute right-0 top-0 flex h-[72px] w-12 cursor-pointer items-center justify-center rounded-none rounded-tr-xl bg-ds-table-header-button hover:bg-ds-table-header-button-hover"
            aria-label="Add column"
          >
            <ColumnWideAdd size={20} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) => {
            if (columnVisibility[key] !== undefined) {
              setColumnVisibility((prev) => ({
                ...prev,
                [key]: !prev[key]
              }));
            } else {
              setColumnVisibility((prev) => ({
                ...prev,
                [key]: false
              }));
            }
          }}
        >
          {table
            .getAllColumns()
            .filter((column) => column.columnDef.enableHiding)
            .map((column) => (
              <DropdownItem key={column.id}>
                <div className="flex items-center justify-between">
                  <p>{column.columnDef.header as ReactNode}</p>
                  {columnVisibility[column.id] === false ? (
                    <EyeSlash size={16} />
                  ) : (
                    <EyeOpen size={16} />
                  )}
                </div>
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>

      <ScrollShadow className="h-full min-w-full">
        <AnimatePresence>
          <div className="relative h-full w-full min-w-full">
            {tableActions && (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) ? (
              <motion.div
                initial={{
                  y: -10
                }}
                animate={{
                  y: 0,
                  transition: {
                    duration: 0.3
                  }
                }}
                exit={{
                  y: -10,
                  transition: {
                    duration: 0.3
                  }
                }}
                layout
                className="absolute left-0 top-[73px] w-full  bg-primary-400 px-4 py-1"
              >
                {tableActions}{' '}
              </motion.div>
            ) : null}

            <ResizableTableContainer>
              <Table className={'h-full w-full min-w-full max-w-full'}>
                <TableHeader className="relative w-full bg-ds-table-header-bg">
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header, index) => (
                      <DataTableColumn
                        key={header.id}
                        header={header}
                        index={index}
                        // setSortParams={setSortParams}
                        // sortParams={sortParams}
                        isLastColumn={index === headerGroup.headers.length - 1}
                        areSomeRowsSelected={table.getIsSomeRowsSelected()}
                        allRowsSelected={table.getIsAllRowsSelected()}
                        onValueChange={() => {
                          table.toggleAllRowsSelected();
                        }}
                      />
                    ))
                  )}
                </TableHeader>

                <TableBody
                  className={cn('transition duration-1000', {
                    'translate-y-12': table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
                  })}
                >
                  {isLoading ? loaderState : null}
                  {table.getRowModel().rows.map((row) => (
                    <DataTableRow
                      key={row.id}
                      row={row}
                      isSelectionEnabled={isSelectionEnabled}
                      selectedData={selectedData}
                      isRowSelected={row.getIsSelected()}
                      setSelectedData={setSelectedData}
                      onValueChange={row.getToggleSelectedHandler()}
                      isSomeRowsSelected={
                        table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()
                      }
                      isHoverEnabled={isHoverEnabled}
                    />
                  ))}
                </TableBody>
              </Table>
            </ResizableTableContainer>
            {data.length === 0 && !isLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  {searchQuery ? (
                    <>
                      <div className="relative text-default-400">
                        <MagnifyingGlass size={32} />

                        <div className="absolute left-0 top-1/2">
                          <CrossSmallFilled size={16} />
                        </div>
                      </div>

                      <p>No assets matching your search</p>
                      <Button onPress={() => setSearchQuery('')} aria-label="Clear search">
                        Clear
                      </Button>
                    </>
                  ) : (
                    <div>
                      <p>No data to display</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AnimatePresence>
        <div ref={scrollRef as RefObject<HTMLDivElement>} className="invisible"></div>
      </ScrollShadow>
    </div>
  );
};

export default DataTable;
